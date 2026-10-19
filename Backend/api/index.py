import sys
from pathlib import Path

# Ensure app module is in path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

try:
    from app.main import app
except Exception as e:
    # Fallback if import fails
    from fastapi import FastAPI
    app = FastAPI(title="Legal Saathi API")
    
    @app.get("/health")
    async def health():
        return {"status": "error", "message": str(e)}
