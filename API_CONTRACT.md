# LegalSaathi AI - API Contract

This document defines the REST API contract for the LegalSaathi AI backend.

**Base URL**: `http://localhost:8000`
**API Version**: v1
**API Prefix**: `/api/v1`

---

## Health Endpoints

### GET /health/live

**Description**: Liveness probe - checks if the process is running.

**Response**: 200 OK
```json
{
  "status": "alive",
  "service": "LegalSaathi AI"
}
```

---

### GET /health/ready

**Description**: Readiness probe - checks if the application is ready to serve requests.

**Response**: 200 OK
```json
{
  "status": "ready",
  "service": "LegalSaathi AI",
  "checks": {
    "database": "ok",
    "groq": "configured",
    "vector_store": {
      "status": "ok",
      "size": 150
    }
  }
}
```

---

## Legal Analysis Endpoints

### POST /api/v1/legal/analyze

**Description**: Analyze a legal question using the RAG pipeline.

**Request Body**:
```json
{
  "question": "My employer has not paid my salary for 3 months. What are my legal options?",
  "category": "unpaid_salary",
  "country": "Pakistan",
  "city": "Karachi",
  "province": "Sindh",
  "language": "en",
  "context": "I work for a private company and have a written contract."
}
```

**Request Fields**:
- `question` (required, string, 10-2000 chars): User's legal question
- `category` (optional, enum): One of `unpaid_salary`, `workplace_harassment`, `tenant_landlord`
- `country` (optional, string, default: "Pakistan"): Country
- `city` (optional, string, default: "Karachi"): City
- `province` (optional, string, default: "Sindh"): Province
- `language` (optional, string, default: "en"): Response language (`en` or `ur`)
- `context` (optional, string, max 5000 chars): Additional context

**Response**: 200 OK

**Status Values**:
- `answered`: Question was answered successfully
- `needs_clarification`: More information needed
- `insufficient_evidence`: Not enough legal sources available
- `unsupported_topic`: Question outside supported categories
- `outside_supported_jurisdiction`: Question outside Karachi, Sindh, Pakistan
- `error`: An error occurred

#### Success Response (status: "answered")
```json
{
  "request_id": "123e4567-e89b-12d3-a456-426614174000",
  "status": "answered",
  "jurisdiction": "Karachi, Sindh, Pakistan",
  "category": "unpaid_salary",
  "summary": "Employers in Sindh are legally required to pay wages on time...",
  "legal_information": "According to the Sindh Shops and Establishments Act...",
  "citations": [
    {
      "document_title": "Sindh Shops and Establishments Act, 2015",
      "provision": "Section 5",
      "page_number": 3,
      "source_url": "https://sindhlaws.gov.pk/...",
      "excerpt": "Every employer shall pay wages to employees..."
    }
  ],
  "next_steps": [
    "Document all unpaid wages with dates and amounts",
    "Send a written notice to employer requesting payment",
    "Contact the Labour Department if payment is not made"
  ],
  "evidence_to_preserve": [
    "Employment contract or appointment letter",
    "Salary slips and bank statements",
    "Written communications about salary"
  ],
  "follow_up_questions": [],
  "limitations": [
    "This information is based on available legal sources...",
    "Legal procedures may depend on specific circumstances..."
  ],
  "confidence": "high",
  "disclaimer": "This information is for educational purposes only and does not constitute legal advice. Consult a qualified lawyer for advice specific to your situation."
}
```

#### Clarification Needed Response (status: "needs_clarification")
```json
{
  "request_id": "123e4567-e89b-12d3-a456-426614174000",
  "status": "needs_clarification",
  "jurisdiction": "Karachi, Sindh, Pakistan",
  "category": "workplace_harassment",
  "summary": "We need some additional information...",
  "legal_information": "Your question relates to workplace harassment...",
  "citations": [],
  "next_steps": [],
  "evidence_to_preserve": [],
  "follow_up_questions": [
    "When did the harassment occur?",
    "Have you reported this to your employer?",
    "Does your employer have an inquiry committee?"
  ],
  "limitations": ["More details will help us provide more specific guidance"],
  "confidence": null,
  "disclaimer": "..."
}
```

#### Insufficient Evidence Response (status: "insufficient_evidence")
```json
{
  "request_id": "123e4567-e89b-12d3-a456-426614174000",
  "status": "insufficient_evidence",
  "jurisdiction": "Karachi, Sindh, Pakistan",
  "category": "tenant_landlord",
  "summary": "We don't have sufficient information in our knowledge base...",
  "legal_information": "While your question appears to be about tenant landlord...",
  "citations": [],
  "next_steps": [
    "Consult with a lawyer specializing in this area"
  ],
  "evidence_to_preserve": [],
  "follow_up_questions": [],
  "limitations": [
    "Our knowledge base is still being developed",
    "Some legal sources may not yet be available"
  ],
  "confidence": "low",
  "disclaimer": "..."
}
```

#### Unsupported Topic Response (status: "unsupported_topic")
```json
{
  "request_id": "123e4567-e89b-12d3-a456-426614174000",
  "status": "unsupported_topic",
  "jurisdiction": "Karachi, Sindh, Pakistan",
  "category": null,
  "summary": "This question is outside LegalSaathi AI's current scope.",
  "legal_information": "LegalSaathi AI currently provides information only about: 1. Unpaid salary...",
  "citations": [],
  "next_steps": [],
  "evidence_to_preserve": [],
  "follow_up_questions": [],
  "limitations": [
    "We can only assist with the three supported legal categories..."
  ],
  "confidence": null,
  "disclaimer": "..."
}
```

#### Out of Scope Jurisdiction (status: "outside_supported_jurisdiction")
```json
{
  "request_id": "123e4567-e89b-12d3-a456-426614174000",
  "status": "outside_supported_jurisdiction",
  "jurisdiction": "Outside supported area",
  "category": null,
  "summary": "This question is outside LegalSaathi AI's geographic scope.",
  "legal_information": "LegalSaathi AI provides legal information specifically for Karachi, Sindh, Pakistan...",
  "citations": [],
  "next_steps": [],
  "evidence_to_preserve": [],
  "follow_up_questions": [],
  "limitations": [
    "Our knowledge base covers Karachi, Sindh, Pakistan only"
  ],
  "confidence": null,
  "disclaimer": "..."
}
```

**Error Responses**:

- **503 Service Unavailable**: Groq service not configured
```json
{
  "detail": "Groq service is not configured. Please set GROQ_API_KEY in environment."
}
```

- **400 Bad Request**: Invalid request
```json
{
  "detail": "Validation error: question cannot be empty"
}
```

- **500 Internal Server Error**: Unexpected error
```json
{
  "detail": "An unexpected error occurred"
}
```

---

### POST /api/v1/legal/search

**Description**: Search for relevant legal documents.

**Request Body**:
```json
{
  "query": "unpaid wages remedies",
  "category": "unpaid_salary",
  "top_k": 5
}
```

**Request Fields**:
- `query` (required, string, 3-500 chars): Search query
- `category` (optional, enum): Filter by category (`unpaid_salary`, `workplace_harassment`, `tenant_landlord`)
- `top_k` (optional, integer, 1-10, default: 5): Number of results to return

**Response**: 200 OK
```json
{
  "query": "unpaid wages remedies",
  "results": [
    {
      "document_title": "Sindh Shops and Establishments Act, 2015",
      "content": "Every employer shall pay wages to employees on time...",
      "page_number": 3,
      "section": "Section 5",
      "source_url": "https://sindhlaws.gov.pk/...",
      "category": "unpaid_salary",
      "jurisdiction": "Karachi, Sindh, Pakistan",
      "score": 0.89
    }
  ],
  "total": 5
}
```

**Error Responses**:

- **400 Bad Request**: Invalid request
```json
{
  "detail": "Query too short"
}
```

---

## Data Models

### LegalCategory Enum
- `unpaid_salary`: Unpaid salary and employment disputes
- `workplace_harassment`: Workplace harassment
- `tenant_landlord`: Tenant and landlord disputes

### AnalysisStatus Enum
- `answered`: Successfully answered
- `needs_clarification`: Requires more information
- `insufficient_evidence`: Not enough legal sources
- `unsupported_topic`: Outside supported categories
- `outside_supported_jurisdiction`: Outside geographic scope
- `error`: Error occurred

### Confidence Enum
- `high`: High confidence in response
- `medium`: Medium confidence
- `low`: Low confidence

---

## Rate Limiting

Currently no rate limiting is enforced, but this may be added in future versions.

---

## Error Handling

All errors follow FastAPI's standard error response format:

```json
{
  "detail": "Error message here"
}
```

HTTP status codes:
- `200`: Success
- `400`: Bad Request (validation error)
- `422`: Unprocessable Entity (Pydantic validation)
- `500`: Internal Server Error
- `503`: Service Unavailable (dependency not available)

---

## CORS Configuration

CORS is enabled for origins specified in the `CORS_ORIGINS` environment variable.

Default: `http://localhost:3000,http://localhost:5173`

---

## Authentication

Currently no authentication is required. This may be added in future versions for administrative endpoints.

---

## Versioning

The API is versioned using URL path prefixes (`/api/v1`). Breaking changes will result in a new version number.
