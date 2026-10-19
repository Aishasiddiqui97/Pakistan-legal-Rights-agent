"""Vercel serverless function entry point."""
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from fastapi import FastAPI

# Create a minimal fallback app
fallback_app = FastAPI(title="Legal Saathi API")

@fallback_app.get("/")
async def root():
    return {"message": "Legal Saathi API", "status": "ok"}

@fallback_app.get("/health/live")
async def health_live():
    return {"status": "alive"}

@fallback_app.get("/health/ready")
async def health_ready():
    return {"status": "ready"}

# Try to import the real app
try:
    from app.main import app
except ImportError as e:
    print(f"Import error: {e}")
    app = fallback_app
except Exception as e:
    print(f"Unexpected error: {e}")
    app = fallback_app
