import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.main import app

# Handle root path redirect
@app.get("/")
async def root():
    return {"message": "Legal Saathi API", "version": "1.0.0"}

# Export for Vercel
__all__ = ["app"]
