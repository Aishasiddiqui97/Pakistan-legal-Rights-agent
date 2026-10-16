"""Health check endpoints."""
from fastapi import APIRouter
from sqlalchemy import text

from app.core.config import get_settings
from app.db.session import SessionLocal
from app.services.groq_service import get_groq_service
from app.rag.vector_store import VectorStore

router = APIRouter()


@router.get("/live")
async def liveness():
    """
    Liveness probe - checks if the process is running.

    Returns:
        Simple status response
    """
    return {
        "status": "alive",
        "service": "LegalSaathi AI"
    }


@router.get("/ready")
async def readiness():
    """
    Readiness probe - checks if application is ready to serve requests.

    Returns:
        Detailed readiness status
    """
    settings = get_settings()
    checks = {
        "status": "ready",
        "service": "LegalSaathi AI",
        "checks": {}
    }

    # Check database
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        checks["checks"]["database"] = "ok"
    except Exception as e:
        checks["checks"]["database"] = f"error: {str(e)}"
        checks["status"] = "not_ready"

    # Check Groq configuration
    groq_service = get_groq_service()
    if groq_service:
        checks["checks"]["groq"] = "configured"
    else:
        checks["checks"]["groq"] = "not_configured"

    # Check vector store
    try:
        vector_store = VectorStore()
        checks["checks"]["vector_store"] = {
            "status": "ok",
            "size": vector_store.size
        }
    except Exception as e:
        checks["checks"]["vector_store"] = f"error: {str(e)}"

    return checks
