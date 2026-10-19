"""Main FastAPI application."""
import sys
from pathlib import Path

# Ensure project root is in sys.path
project_root = Path(__file__).resolve().parent.parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import config first
from app.core.config import get_settings

# Get settings with error handling
try:
    settings = get_settings()
except Exception as e:
    print(f"Config error: {e}")
    settings = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager."""
    yield


def create_app() -> FastAPI:
    """Create and configure FastAPI application."""
    app = FastAPI(
        title="LegalSaathi AI",
        version="1.0.0",
        description="Legal information assistant",
    )

    # Configure CORS
    cors_origins = ["*"]
    if settings and settings.cors_origins_list:
        cors_origins = settings.cors_origins_list

    app.add_middleware(
        CORSMiddleware,
        allow_origins=cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Health check routes
    @app.get("/health/live")
    async def health_live():
        return {"status": "alive", "service": "LegalSaathi AI"}

    @app.get("/health/ready")
    async def health_ready():
        return {"status": "ready", "service": "LegalSaathi AI"}

    # Try to add other routes
    try:
        from app.api.routes import auth
        app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
    except Exception as e:
        print(f"Auth routes error: {e}")

    try:
        from app.api.routes import legal
        app.include_router(legal.router, prefix="/api/v1/legal", tags=["legal"])
    except Exception as e:
        print(f"Legal routes error: {e}")

    return app


# Create app instance
app = create_app()


if __name__ == "__main__":
    import uvicorn
    if settings:
        uvicorn.run(app, host=settings.host, port=settings.port)
    else:
        uvicorn.run(app, host="0.0.0.0", port=8001)
