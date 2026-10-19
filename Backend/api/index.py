"""Vercel serverless function entry point."""
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Create a minimal fallback app
fallback_app = FastAPI(title="Legal Saathi API")

# Add CORS to fallback
fallback_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@fallback_app.get("/")
async def root():
    return {"message": "Legal Saathi API", "status": "ok"}

@fallback_app.get("/health/live")
async def health_live():
    return {"status": "alive", "service": "LegalSaathi AI"}

@fallback_app.get("/health/ready")
async def health_ready():
    return {"status": "ready", "service": "LegalSaathi AI"}

@fallback_app.get("/docs")
async def redirect_docs():
    return {"message": "API Documentation available at /docs"}

# Try to import the real app
app = fallback_app
try:
    from app.main import app as main_app
    app = main_app
    print("Successfully loaded app from app.main")
except ImportError as e:
    print(f"Import error: {e}. Using fallback app.")
except Exception as e:
    print(f"Error loading app: {e}. Using fallback app.")
