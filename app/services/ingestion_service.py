"""Document ingestion service."""
import hashlib
from pathlib import Path
from typing import List, Optional, Tuple

import fitz  # PyMuPDF
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.exceptions import DocumentProcessingError
from app.core.logging import get_logger
from app.db.models import DocumentChunk, LegalDocument
from app.rag.chunking import TextChunker
from app.rag.embeddings import get_embedding_service
from app.rag.vector_store import VectorStore

logger = get_logger(__name__)


class IngestionService:
    """Service for ingesting legal documents."""

    def __init__(self, db: Session):
        """Initialize ingestion service."""
        self.db = db
        self.chunker = TextChunker()
        self.embedding_service = get_embedding_service()
        self.vector_store = VectorStore()
        self.settings = get_settings()

    def ingest_document(
        self,
        file_path: Path,
        title: str,
        category: str,
        jurisdiction: str = "Karachi, Sindh, Pakistan",
        source_url: Optional[str] = None,
        issuing_authority: Optional[str] = None,
        publication_date: Optional[str] = None,
        version: Optional[str] = None,
    ) -> LegalDocument:
        """
        Ingest a legal document.

        Args:
            file_path: Path to document file
            title: Document title
            category: Legal category
            jurisdiction: Jurisdiction
            source_url: Source URL
            issuing_authority: Issuing authority
            publication_date: Publication date
            version: Document version

        Returns:
            LegalDocument instance

        Raises:
            DocumentProcessingError: If ingestion fails
        """
        if not file_path.exists():
            raise DocumentProcessingError(f"File not found: {file_path}")

        # Validate file size
        file_size = file_path.stat().st_size
        if file_size > self.settings.max_upload_size_bytes:
            raise DocumentProcessingError(
                f"File size {file_size} exceeds maximum {self.settings.max_upload_size_bytes}"
            )

        if file_size == 0:
            raise DocumentProcessingError("File is empty")

        # Calculate file hash
        file_hash = self._calculate_file_hash(file_path)

        # Check for duplicates
        existing = self.db.query(LegalDocument).filter(
            LegalDocument.file_hash == file_hash
        ).first()

        if existing:
            logger.info(f"Document already exists: {existing.title}")
            return existing

        # Detect document type
        doc_type = file_path.suffix.lower().lstrip('.')
        if doc_type not in ['pdf', 'txt']:
            raise DocumentProcessingError(f"Unsupported file type: {doc_type}")

        # Create document record
        document = LegalDocument(
            title=title,
            source_url=source_url,
            issuing_authority=issuing_authority,
            jurisdiction=jurisdiction,
            category=category,
            document_type=doc_type,
            file_path=str(file_path),
            file_hash=file_hash,
            publication_date=publication_date,
            version=version,
            ingestion_status="processing",
        )

        self.db.add(document)
        self.db.flush()

        try:
            # Extract text
            if doc_type == 'pdf':
                page_texts = self._extract_pdf_text(file_path)
            else:
                page_texts = self._extract_txt_text(file_path)

            if not page_texts:
                raise DocumentProcessingError("No text could be extracted from document")

            # Check for scanned PDF
            total_text = ''.join(text for _, text in page_texts)
            if doc_type == 'pdf' and len(total_text.strip()) < 100:
                raise DocumentProcessingError(
                    "Document appears to be a scanned PDF with insufficient extractable text. OCR is required."
                )

            # Create chunks
            chunks_with_metadata = self.chunker.extract_page_chunks(page_texts)

            if not chunks_with_metadata:
                raise DocumentProcessingError("No chunks created from document")

            # Generate embeddings
            chunk_texts = [chunk for chunk, _, _ in chunks_with_metadata]
            embeddings = self.embedding_service.embed_batch(chunk_texts)

            # Store chunks and vectors
            chunk_records = []
            vector_metadata = []

            for idx, ((chunk_text, page_num, section), embedding) in enumerate(
                zip(chunks_with_metadata, embeddings)
            ):
                vector_id = f"{document.id}_{idx}"

                chunk_record = DocumentChunk(
                    document_id=document.id,
                    chunk_index=idx,
                    content=chunk_text,
                    page_number=page_num,
                    section=section,
                    vector_id=vector_id,
                )
                chunk_records.append(chunk_record)

                vector_metadata.append({
                    "vector_id": vector_id,
                    "document_id": document.id,
                    "chunk_index": idx,
                    "category": category,
                    "jurisdiction": jurisdiction,
                })

            # Add to database
            self.db.bulk_save_objects(chunk_records)

            # Add to vector store
            self.vector_store.add_vectors(embeddings, vector_metadata)
            self.vector_store.save()

            # Update document status
            document.ingestion_status = "completed"
            document.total_pages = len(page_texts) if doc_type == 'pdf' else None
            document.total_chunks = len(chunk_records)

            self.db.commit()

            logger.info(f"Successfully ingested document: {title} ({len(chunk_records)} chunks)")

            return document

        except Exception as e:
            document.ingestion_status = "failed"
            document.ingestion_error = str(e)
            self.db.commit()
            logger.error(f"Failed to ingest document {title}: {e}")
            raise DocumentProcessingError(f"Ingestion failed: {e}")

    def _calculate_file_hash(self, file_path: Path) -> str:
        """Calculate SHA256 hash of file."""
        sha256_hash = hashlib.sha256()
        with open(file_path, "rb") as f:
            for byte_block in iter(lambda: f.read(4096), b""):
                sha256_hash.update(byte_block)
        return sha256_hash.hexdigest()

    def _extract_pdf_text(self, file_path: Path) -> List[Tuple[int, str]]:
        """
        Extract text from PDF with page numbers.

        Returns:
            List of (page_number, text) tuples
        """
        try:
            doc = fitz.open(file_path)
            page_texts = []

            for page_num, page in enumerate(doc, start=1):
                text = page.get_text()
                if text and text.strip():
                    page_texts.append((page_num, text))

            doc.close()
            return page_texts

        except Exception as e:
            logger.error(f"PDF extraction failed: {e}")
            raise DocumentProcessingError(f"Failed to extract PDF text: {e}")

    def _extract_txt_text(self, file_path: Path) -> List[Tuple[int, str]]:
        """
        Extract text from TXT file.

        Returns:
            List of (page_number, text) tuples (page_number is always 1 for TXT)
        """
        try:
            # Try common encodings
            encodings = ['utf-8', 'utf-8-sig', 'latin-1', 'cp1252']

            text = None
            for encoding in encodings:
                try:
                    with open(file_path, 'r', encoding=encoding) as f:
                        text = f.read()
                    break
                except UnicodeDecodeError:
                    continue

            if text is None:
                raise DocumentProcessingError("Could not decode text file with supported encodings")

            if not text.strip():
                raise DocumentProcessingError("Text file is empty")

            return [(1, text)]

        except Exception as e:
            logger.error(f"TXT extraction failed: {e}")
            raise DocumentProcessingError(f"Failed to extract TXT text: {e}")

    def rebuild_vector_store(self) -> int:
        """
        Rebuild the entire vector store from database.

        Returns:
            Number of vectors rebuilt
        """
        logger.info("Rebuilding vector store...")

        # Get all chunks
        chunks = self.db.query(DocumentChunk).join(LegalDocument).filter(
            LegalDocument.ingestion_status == "completed"
        ).all()

        if not chunks:
            logger.warning("No chunks found in database")
            return 0

        # Generate embeddings
        chunk_texts = [chunk.content for chunk in chunks]
        embeddings = self.embedding_service.embed_batch(chunk_texts)

        # Prepare metadata
        metadata = []
        for chunk in chunks:
            metadata.append({
                "vector_id": chunk.vector_id,
                "document_id": chunk.document_id,
                "chunk_index": chunk.chunk_index,
                "category": chunk.document.category,
                "jurisdiction": chunk.document.jurisdiction,
            })

        # Rebuild vector store
        self.vector_store.rebuild(embeddings, metadata)

        logger.info(f"Rebuilt vector store with {len(chunks)} vectors")

        return len(chunks)
