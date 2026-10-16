"""Legal analysis endpoints."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.exceptions import GroqServiceError, LegalSaathiException
from app.core.logging import get_logger
from app.db.session import get_db_session
from app.schemas.legal import (
    LegalAnalysisRequest,
    LegalAnalysisResponse,
    SearchRequest,
    SearchResponse,
)
from app.services.groq_service import GroqService, get_groq_service
from app.services.legal_service import LegalService
from app.services.retrieval_service import RetrievalService

logger = get_logger(__name__)
router = APIRouter()


@router.post("/analyze", response_model=LegalAnalysisResponse)
async def analyze_legal_question(
    request: LegalAnalysisRequest,
    db: Session = Depends(get_db_session),
):
    """
    Analyze a legal question using the RAG pipeline.

    Args:
        request: Legal analysis request
        db: Database session

    Returns:
        Legal analysis response

    Raises:
        HTTPException: If analysis fails
    """
    groq_service = get_groq_service()

    if not groq_service:
        raise HTTPException(
            status_code=503,
            detail="Groq service is not configured. Please set GROQ_API_KEY in environment."
        )

    try:
        legal_service = LegalService(db, groq_service)
        response = legal_service.analyze(request)
        return response

    except GroqServiceError as e:
        logger.error(f"Groq service error: {e.message}")
        raise HTTPException(status_code=e.status_code, detail=e.message)

    except LegalSaathiException as e:
        logger.error(f"Legal service error: {e.message}")
        raise HTTPException(status_code=e.status_code, detail=e.message)

    except Exception as e:
        logger.error(f"Unexpected error in legal analysis: {e}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred")


@router.post("/search", response_model=SearchResponse)
async def search_legal_documents(
    request: SearchRequest,
    db: Session = Depends(get_db_session),
):
    """
    Search legal documents.

    Args:
        request: Search request
        db: Database session

    Returns:
        Search response with results

    Raises:
        HTTPException: If search fails
    """
    try:
        retrieval_service = RetrievalService(db)

        results = retrieval_service.search(
            query=request.query,
            category=request.category.value if request.category else None,
            top_k=request.top_k,
        )

        return SearchResponse(
            query=request.query,
            results=results,
            total=len(results),
        )

    except LegalSaathiException as e:
        logger.error(f"Search error: {e.message}")
        raise HTTPException(status_code=e.status_code, detail=e.message)

    except Exception as e:
        logger.error(f"Unexpected error in search: {e}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred")
