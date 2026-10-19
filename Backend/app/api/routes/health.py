"""Health check endpoints."""
from fastapi import APIRouter

router = APIRouter()


@router.get("/live")
async def liveness():
    """Liveness probe - checks if the process is running."""
    return {"status": "alive", "service": "LegalSaathi AI"}


@router.get("/ready")
async def readiness():
    """Readiness probe - checks if application is ready to serve requests."""
    return {
        "status": "ready",
        "service": "LegalSaathi AI",
        "environment": "production"
    }
