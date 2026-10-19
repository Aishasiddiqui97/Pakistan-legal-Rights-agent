import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from fastapi import FastAPI

# Create minimal app first
app = FastAPI(title="Legal Saathi API", version="1.0.0")

@app.get("/")
async def root():
    return {"message": "Legal Saathi API is running", "status": "ok"}

@app.get("/health/live")
async def health():
    return {"status": "alive", "service": "LegalSaathi AI"}

@app.get("/health/ready")
async def ready():
    return {"status": "ready", "service": "LegalSaathi AI"}

# Try to import full app, but don't fail if it errors
try:
    from app.main import app as full_app
    app = full_app
except Exception as e:
    print(f"Warning: Could not load full app: {e}")
    # Keep the minimal app above
