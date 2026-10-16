# LegalSaathi AI - Backend

Legal information assistant focused on employment disputes, workplace harassment, and tenant-landlord issues in Karachi, Sindh, Pakistan.

## Features

- **Focused Legal Categories**:
  - Unpaid salary and employment disputes
  - Workplace harassment
  - Tenant and landlord disputes

- **Geographic Scope**: Karachi, Sindh, Pakistan

- **RAG-Powered**: Semantic search over authentic legal documents with Groq LLM generation

- **Multilingual**: Supports English and Urdu queries (where embedding model supports)

## Tech Stack

- Python 3.11+
- FastAPI + Uvicorn
- SQLAlchemy 2.x + SQLite
- Groq API for LLM inference
- Sentence Transformers for embeddings
- FAISS for vector search
- PyMuPDF for PDF processing

## Setup

### Prerequisites

- Python 3.11 or newer
- Groq API key ([get one here](https://console.groq.com))

### Installation

1. **Clone the repository**:
```bash
cd Backend
```

2. **Create virtual environment**:

**Windows (PowerShell)**:
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**macOS/Linux**:
```bash
python3 -m venv venv
source venv/bin/activate
```

3. **Install dependencies**:
```bash
pip install -r requirements.txt
```

4. **Configure environment**:
```bash
cp .env.example .env
```

Edit `.env` and set your Groq API key:
```
GROQ_API_KEY=your_actual_groq_api_key_here
```

5. **Initialize database**:

The database is automatically initialized on first run.

## Running the Application

### Start the API server

```bash
python -m uvicorn app.main:app --reload
```

Or:

```bash
python app/main.py
```

The API will be available at `http://localhost:8000`

### API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Ingesting Legal Documents

### Add Documents

Place PDF or TXT files in the `data/documents/` directory. Organize by category using filename keywords:

- **Unpaid Salary**: Include "salary", "employment", or "wage" in filename
- **Workplace Harassment**: Include "harassment" in filename
- **Tenant/Landlord**: Include "tenant", "landlord", "rent", or "eviction" in filename

### Run Ingestion

```bash
python scripts/ingest_documents.py ingest --directory data/documents
```

### Rebuild Vector Index

If you need to rebuild the vector index from the database:

```bash
python scripts/ingest_documents.py rebuild
```

## Testing

### Run all tests

```bash
pytest
```

### Run with coverage

```bash
pytest --cov=app --cov-report=html
```

### Run specific test files

```bash
pytest tests/unit/test_chunking.py
pytest tests/integration/test_health.py
```

## Code Quality

### Lint with Ruff

```bash
ruff check app tests scripts
```

### Format with Ruff

```bash
ruff format app tests scripts
```

## API Usage Examples

### Health Check

```bash
curl http://localhost:8000/health/live
curl http://localhost:8000/health/ready
```

### Legal Analysis

```bash
curl -X POST http://localhost:8000/api/v1/legal/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "question": "My employer has not paid my salary for 3 months. What can I do?",
    "city": "Karachi",
    "province": "Sindh",
    "country": "Pakistan"
  }'
```

### Search Legal Documents

```bash
curl -X POST http://localhost:8000/api/v1/legal/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "unpaid wages remedies",
    "category": "unpaid_salary",
    "top_k": 5
  }'
```

## Supported Categories

### 1. Unpaid Salary and Employment Disputes

Questions about:
- Unpaid or delayed wages
- Employment contracts
- Termination and final dues
- Overtime pay
- Employer-employee disputes related to payment

### 2. Workplace Harassment

Questions about:
- Workplace harassment complaints
- Complaint mechanisms
- Legal protections
- Reporting channels
- Evidence preservation

### 3. Tenant and Landlord Disputes

Questions about:
- Rent disputes
- Security deposits
- Eviction notices
- Rental agreements
- Maintenance and repairs
- Tenancy rights

## Geographic Limitations

**LegalSaathi AI currently supports only Karachi, Sindh, Pakistan.**

Questions about other cities or provinces will receive a clear out-of-scope response explaining the geographic limitation.

## Known Limitations

1. **Knowledge Base Coverage**: The system's answers depend on the legal documents ingested. Insufficient sources will result in an "insufficient evidence" response.

2. **Not Legal Advice**: This system provides legal information only, not legal advice. Users should consult qualified lawyers for specific situations.

3. **Amendment Status**: Legal sources may not reflect the most recent amendments unless explicitly updated.

4. **Federal vs Provincial Law**: Some matters may be governed by federal law in addition to or instead of provincial law. The system attempts to identify applicable frameworks but cannot guarantee complete jurisdictional analysis.

5. **Scanned PDFs**: Documents that are scanned images require OCR processing before ingestion.

## Troubleshooting

### "GROQ_API_KEY is not configured"

Make sure you've set `GROQ_API_KEY` in your `.env` file.

### "Vector store is empty"

You need to ingest documents first:
```bash
python scripts/ingest_documents.py ingest --directory data/documents
```

### "Failed to load embedding model"

The first run will download the embedding model (~500MB). Ensure you have:
- Stable internet connection
- Sufficient disk space
- Write permissions in the Python environment

### Import errors

Make sure you're in the virtual environment and have installed all dependencies:
```bash
pip install -r requirements.txt
```

## Project Structure

```
Backend/
├── app/
│   ├── api/
│   │   └── routes/          # API route handlers
│   ├── core/                # Configuration, logging, exceptions
│   ├── db/                  # Database models and session
│   ├── rag/                 # RAG components (chunking, embeddings, vector store)
│   ├── schemas/             # Pydantic schemas
│   ├── services/            # Business logic services
│   ├── repositories/        # Data access layer
│   └── main.py              # FastAPI application
├── data/
│   ├── documents/           # Legal documents for ingestion
│   └── vector_store/        # FAISS vector index (generated)
├── scripts/
│   └── ingest_documents.py  # CLI for document ingestion
├── tests/
│   ├── unit/                # Unit tests
│   └── integration/         # Integration tests
├── requirements.txt
├── .env.example
└── README.md
```

## Development

### Adding New Legal Documents

1. Obtain authentic legal documents (PDF or TXT)
2. Place in `data/documents/`
3. Run ingestion script
4. Verify ingestion in logs

### Adding New Features

1. Create feature branch
2. Implement changes
3. Add tests
4. Run linting: `ruff check`
5. Run tests: `pytest`
6. Update documentation

## License

[Add your license here]

## Contact

[Add contact information here]
