"""Retrieval service for semantic search."""
from typing import List, Optional

from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.exceptions import RetrievalError
from app.core.logging import get_logger
from app.db.models import DocumentChunk, LegalDocument
from app.rag.embeddings import get_embedding_service
from app.rag.vector_store import VectorStore
from app.schemas.legal import SearchResult

logger = get_logger(__name__)


class RetrievalService:
    """Service for retrieving relevant legal documents."""

    def __init__(self, db: Session):
        """Initialize retrieval service."""
        self.db = db
        self.embedding_service = get_embedding_service()
        self.vector_store = VectorStore()
        self.settings = get_settings()

    def search(
        self,
        query: str,
        category: Optional[str] = None,
        top_k: int = 5,
    ) -> List[SearchResult]:
        """
        Search for relevant legal documents.

        Args:
            query: Search query
            category: Optional category filter
            top_k: Number of results to return

        Returns:
            List of search results

        Raises:
            RetrievalError: If search fails
        """
        if top_k > self.settings.max_retrieval_top_k:
            top_k = self.settings.max_retrieval_top_k

        if self.vector_store.size == 0:
            logger.warning("Vector store is empty")
            return []

        try:
            # Generate query embedding
            query_embedding = self.embedding_service.embed_text(query)

            # Prepare metadata filter
            filter_metadata = {}
            if category:
                filter_metadata["category"] = category

            # Search vector store
            vector_results = self.vector_store.search(
                query_embedding,
                top_k=top_k,
                filter_metadata=filter_metadata if filter_metadata else None
            )

            if not vector_results:
                logger.info(f"No results found for query: {query[:50]}")
                return []

            # Retrieve chunk details from database
            vector_ids = [meta["vector_id"] for _, _, meta in vector_results]

            chunks = self.db.query(DocumentChunk).filter(
                DocumentChunk.vector_id.in_(vector_ids)
            ).all()

            # Create mapping for quick lookup
            chunk_map = {chunk.vector_id: chunk for chunk in chunks}

            # Build search results
            results = []
            for _, distance, meta in vector_results:
                vector_id = meta["vector_id"]
                chunk = chunk_map.get(vector_id)

                if not chunk or not chunk.document:
                    logger.warning(f"Chunk not found for vector_id: {vector_id}")
                    continue

                result = SearchResult(
                    document_title=chunk.document.title,
                    content=chunk.content,
                    page_number=chunk.page_number,
                    section=chunk.section,
                    source_url=chunk.document.source_url,
                    category=chunk.document.category,
                    jurisdiction=chunk.document.jurisdiction,
                    score=1.0 / (1.0 + distance),  # Convert distance to similarity score
                )
                results.append(result)

            logger.info(f"Retrieved {len(results)} results for query")

            return results

        except Exception as e:
            logger.error(f"Search failed: {e}")
            raise RetrievalError(f"Search failed: {e}")

    def get_relevant_context(
        self,
        query: str,
        category: Optional[str] = None,
        top_k: int = 5,
    ) -> tuple[List[SearchResult], str]:
        """
        Get relevant context for RAG pipeline.

        Args:
            query: User question
            category: Optional category filter
            top_k: Number of results to retrieve

        Returns:
            Tuple of (search_results, formatted_context)
        """
        results = self.search(query, category, top_k)

        if not results:
            return [], ""

        # Format context for LLM
        context_parts = []
        for idx, result in enumerate(results, 1):
            context_part = f"[Source {idx}: {result.document_title}"
            if result.page_number:
                context_part += f", Page {result.page_number}"
            context_part += "]\n" + result.content

            context_parts.append(context_part)

        formatted_context = "\n\n---\n\n".join(context_parts)

        return results, formatted_context
