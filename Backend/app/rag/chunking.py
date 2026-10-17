"""Text chunking utilities."""
import re
from typing import List, Optional, Tuple

from app.core.config import get_settings
from app.core.logging import get_logger

logger = get_logger(__name__)


class TextChunker:
    """Text chunking utility."""

    def __init__(self, chunk_size: int = None, chunk_overlap: int = None):
        """
        Initialize text chunker.

        Args:
            chunk_size: Maximum chunk size in characters
            chunk_overlap: Overlap between chunks in characters
        """
        settings = get_settings()
        self.chunk_size = chunk_size or settings.chunk_size
        self.chunk_overlap = chunk_overlap or settings.chunk_overlap

    def chunk_text(
        self,
        text: str,
        preserve_paragraphs: bool = True
    ) -> List[str]:
        """
        Split text into overlapping chunks.

        Args:
            text: Text to chunk
            preserve_paragraphs: Try to split on paragraph boundaries

        Returns:
            List of text chunks
        """
        if not text or not text.strip():
            return []

        # Clean text
        text = self._clean_text(text)

        if len(text) <= self.chunk_size:
            return [text]

        chunks = []

        if preserve_paragraphs:
            chunks = self._chunk_by_paragraphs(text)
        else:
            chunks = self._chunk_by_size(text)

        return [chunk.strip() for chunk in chunks if chunk.strip()]

    def _clean_text(self, text: str) -> str:
        """Clean text by normalizing whitespace."""
        # Normalize line breaks
        text = re.sub(r'\r\n', '\n', text)
        # Remove multiple consecutive blank lines
        text = re.sub(r'\n\s*\n\s*\n+', '\n\n', text)
        # Normalize spaces
        text = re.sub(r'[ \t]+', ' ', text)
        return text.strip()

    def _chunk_by_paragraphs(self, text: str) -> List[str]:
        """Chunk text while preserving paragraph boundaries."""
        paragraphs = re.split(r'\n\n+', text)
        chunks = []
        current_chunk = ""

        for para in paragraphs:
            para = para.strip()
            if not para:
                continue

            # If adding this paragraph exceeds chunk size
            if len(current_chunk) + len(para) + 2 > self.chunk_size:
                if current_chunk:
                    chunks.append(current_chunk)
                    # Start new chunk with overlap from previous
                    if self.chunk_overlap > 0:
                        overlap_text = current_chunk[-self.chunk_overlap:]
                        current_chunk = overlap_text + "\n\n" + para
                    else:
                        current_chunk = para
                else:
                    # Single paragraph is too large, split it
                    if len(para) > self.chunk_size:
                        para_chunks = self._chunk_by_size(para)
                        chunks.extend(para_chunks[:-1])
                        current_chunk = para_chunks[-1] if para_chunks else ""
                    else:
                        current_chunk = para
            else:
                # Add paragraph to current chunk
                if current_chunk:
                    current_chunk += "\n\n" + para
                else:
                    current_chunk = para

        if current_chunk:
            chunks.append(current_chunk)

        return chunks

    def _chunk_by_size(self, text: str) -> List[str]:
        """Chunk text by fixed size with overlap."""
        chunks = []
        start = 0

        while start < len(text):
            end = start + self.chunk_size

            # Try to break at sentence boundary
            if end < len(text):
                # Look for sentence end markers
                sentence_ends = ['. ', '.\n', '? ', '?\n', '! ', '!\n']
                best_break = end

                # Search backwards for sentence boundary
                for i in range(end, max(start + self.chunk_size // 2, start), -1):
                    if any(text[i:i+2].startswith(marker) for marker in sentence_ends):
                        best_break = i + 1
                        break

                end = best_break

            chunk = text[start:end].strip()
            if chunk:
                chunks.append(chunk)

            # Move to next chunk with overlap
            start = end - self.chunk_overlap if end < len(text) else end

        return chunks

    def extract_section_reference(self, text: str) -> Optional[str]:
        """
        Extract section/article reference from text.

        Args:
            text: Text to extract section from

        Returns:
            Section reference string or None
        """
        # Patterns for section references in legal documents
        patterns = [
            r'Section\s+(\d+[A-Z]?(?:\s*\([a-z0-9]+\))?)',  # Section 5, Section 5A, Section 5(a)
            r'Article\s+(\d+[A-Z]?(?:\s*\([a-z0-9]+\))?)',  # Article 3, Article 3A
            r'Rule\s+(\d+[A-Z]?(?:\s*\([a-z0-9]+\))?)',     # Rule 7
            r'Clause\s+(\d+[A-Z]?(?:\s*\([a-z0-9]+\))?)',   # Clause 2
            r'Part\s+([IVX]+)',                              # Part II, Part IV
            r'Chapter\s+([IVX]+|\d+)',                       # Chapter III, Chapter 5
        ]

        # Try to find section reference near the beginning of the text
        search_text = text[:500]  # Check first 500 chars

        for pattern in patterns:
            match = re.search(pattern, search_text, re.IGNORECASE)
            if match:
                # Get the type and number
                full_match = match.group(0)
                return full_match.strip()

        return None

    def extract_page_chunks(
        self,
        page_texts: List[Tuple[int, str]]
    ) -> List[Tuple[str, int, Optional[str]]]:
        """
        Extract chunks from pages while preserving page numbers and section references.

        Args:
            page_texts: List of (page_number, text) tuples

        Returns:
            List of (chunk_text, page_number, section) tuples
        """
        chunks_with_metadata = []

        for page_num, page_text in page_texts:
            page_chunks = self.chunk_text(page_text)
            for chunk in page_chunks:
                section = self.extract_section_reference(chunk)
                chunks_with_metadata.append((chunk, page_num, section))

        return chunks_with_metadata
