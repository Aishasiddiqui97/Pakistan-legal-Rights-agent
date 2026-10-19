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

from app.core.config import get_settings
from app.core.logging import setup_logging


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager."""
    # Startup - keep minimal
    try:
        setup_logging()
    except Exception as e:
        print(f"Logging error (non-fatal): {e}")
    
    yield
    # Shutdown
    pass


def create_app() -> FastAPI:
    """Create and configure FastAPI application."""
    try:
        settings = get_settings()
    except Exception as e:
        print(f"Settings load error: {e}")
        settings = None

    app = FastAPI(
        title="LegalSaathi AI",
        version="1.0.0",
        description="Legal information assistant for Karachi, Sindh, Pakistan",
        lifespan=lifespan,
    )

    # Configure CORS
    if settings and settings.cors_origins_list:
        cors_origins = settings.cors_origins_list
    else:
        cors_origins = ["*"]
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Register routes - defer imports until needed
    try:
        from app.api.routes import health
        app.include_router(
            health.router,
            prefix="/health",
            tags=["health"]
        )
    except Exception as e:
        print(f"Health routes error: {e}")

    try:
        from app.api.routes import auth
        app.include_router(
            auth.router,
            prefix="/api/v1/auth",
            tags=["auth"]
        )
    except Exception as e:
        print(f"Auth routes error: {e}")

    try:
        from app.api.routes import legal
        app.include_router(
            legal.router,
            prefix="/api/v1/legal",
            tags=["legal"]
        )
    except Exception as e:
        print(f"Legal routes error: {e}")

    return app


# Create app instance at module level for Vercel
try:
    app = create_app()
except Exception as e:
    print(f"Failed to create app: {e}")
    from fastapi import FastAPI
    app = FastAPI()
    
    @app.get("/health/live")
    async def fallback_health():
        return {"status": "error", "message": str(e)}


if __name__ == "__main__":
    import uvicorn
    settings = get_settings()
    uvicorn.run(app, host=settings.host, port=settings.port)
