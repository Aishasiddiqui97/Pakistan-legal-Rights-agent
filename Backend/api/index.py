"""Vercel serverless function entry point - Minimal FastAPI app."""
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Create app
app = FastAPI(title="Legal Saathi API", version="1.0.0")

# Add CORS middleware FIRST
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Routes
@app.get("/")
async def root():
    return {
        "message": "LegalSaathi AI - Legal Information Assistant",
        "status": "running",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health/live"
    }

@app.get("/health/live")
async def health_live():
    return {"status": "alive", "service": "LegalSaathi AI"}

@app.get("/health/ready")
async def health_ready():
    return {"status": "ready", "service": "LegalSaathi AI"}

# Mock auth endpoints for now
@app.post("/api/v1/auth/login")
async def login(email: str = None, password: str = None):
    return {
        "access_token": "test_token_12345",
        "token_type": "bearer",
        "user": {
            "id": 1,
            "email": email or "test@example.com",
            "full_name": "Test User",
            "is_active": True
        }
    }

@app.post("/api/v1/auth/signup")
async def signup(email: str = None, password: str = None, full_name: str = None):
    return {
        "access_token": "test_token_12345",
        "token_type": "bearer",
        "user": {
            "id": 1,
            "email": email or "test@example.com",
            "full_name": full_name or "Test User",
            "is_active": True
        }
    }

@app.get("/api/v1/auth/me")
async def get_me():
    return {
        "id": 1,
        "email": "user@example.com",
        "full_name": "Test User",
        "is_active": True
    }

# Mock legal endpoints
@app.post("/api/v1/legal/analyze")
async def analyze_legal(question: str = None):
    return {
        "question": question or "Default question",
        "analysis": "This is a test response from the Legal Saathi AI backend.",
        "category": "general",
        "citations": [],
        "confidence": 0.95
    }

@app.post("/api/v1/legal/search")
async def search_legal(query: str = None):
    return {
        "query": query or "Default query",
        "results": [
            {
                "id": 1,
                "title": "Sample Legal Document",
                "content": "This is sample legal content",
                "category": "employment",
                "relevance": 0.98
            }
        ],
        "total": 1
    }

