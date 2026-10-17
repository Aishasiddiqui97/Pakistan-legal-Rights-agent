"""Citation validation service."""
from typing import List

from app.core.logging import get_logger
from app.schemas.legal import Citation, SearchResult

logger = get_logger(__name__)


class CitationService:
    """Service for validating and building citations."""

    def build_citations(self, search_results: List[SearchResult]) -> List[Citation]:
        """
        Build citations from search results.

        Args:
            search_results: Retrieved search results

        Returns:
            List of citations
        """
        citations = []

        for result in search_results:
            citation = Citation(
                document_title=result.document_title,
                provision=result.section,
                page_number=result.page_number,
                source_url=result.source_url,
                excerpt=result.content[:300] + "..." if len(result.content) > 300 else result.content,
            )
            citations.append(citation)

        return citations

    def validate_citation(
        self,
        citation_text: str,
        available_sources: List[SearchResult]
    ) -> bool:
        """
        Validate if a citation claim is supported by retrieved sources.

        Args:
            citation_text: Citation text from LLM
            available_sources: Available search results

        Returns:
            True if citation is supported
        """
        # Simple validation: check if key terms appear in sources
        citation_lower = citation_text.lower()

        for source in available_sources:
            source_text = f"{source.document_title} {source.content}".lower()

            # Extract potential statute/section references
            if any(term in citation_lower for term in ["section", "article", "act", "rule"]):
                # Check if mentioned in source
                if any(word in source_text for word in citation_lower.split() if len(word) > 3):
                    return True

        return False

    def filter_unsupported_citations(
        self,
        citation_claims: List[str],
        available_sources: List[SearchResult]
    ) -> List[str]:
        """
        Filter out unsupported citation claims.

        Args:
            citation_claims: Citation claims from LLM
            available_sources: Available search results

        Returns:
            List of supported citations
        """
        supported = []

        for claim in citation_claims:
            if self.validate_citation(claim, available_sources):
                supported.append(claim)
            else:
                logger.warning(f"Unsupported citation filtered: {claim[:100]}")

        return supported
