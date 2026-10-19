"""Vercel serverless function entry point - Minimal FastAPI app."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Create simple app
app = FastAPI(title="Legal Saathi API", version="1.0.0")

# Add CORS - Allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://pakistan-legal-rights-agent.vercel.app",
        "https://pakistan-legal-rights-agent-xnqz.vercel.app",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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

@app.get("/docs", include_in_schema=False)
async def docs():
    return {"message": "Swagger UI available at /docs"}
