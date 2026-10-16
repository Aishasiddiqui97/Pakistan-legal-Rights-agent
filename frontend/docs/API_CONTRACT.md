# Pakistan Legal Rights Agent — Backend Integration Contract (FastAPI)

> **Document Version**: 1.0.0  
> **Target Framework**: Python / FastAPI  
> **Status**: Proposed API Contract for Team Integration  
> **Base URL**: `http://localhost:8000/api/v1`

---

## 1. Authentication & Session Management

### 1.1 Citizen Sign Up
- **Method**: `POST`
- **Endpoint**: `/api/v1/auth/register`
- **Request Body (`application/json`)**:
  ```json
  {
    "name": "Aisha Siddiqui",
    "email": "aisha@example.com",
    "password": "Password123",
    "preferredJurisdiction": "sindh",
    "acceptedTerms": true
  }
  ```
- **Success Response (`201 Created` or `200 OK`)**:
  ```json
  {
    "user": {
      "id": "usr_sindh_981",
      "name": "Aisha Siddiqui",
      "email": "aisha@example.com",
      "preferredJurisdiction": "sindh",
      "role": "citizen",
      "createdAt": "2026-10-16T10:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
  *(Note: Token may also be set via an HttpOnly `Set-Cookie` session header; the frontend supports both Bearer header and cookie-based sessions).*

---

### 1.2 Citizen Sign In
- **Method**: `POST`
- **Endpoint**: `/api/v1/auth/login`
- **Request Body (`application/json`)**:
  ```json
  {
    "email": "aisha@example.com",
    "password": "Password123",
    "rememberMe": true
  }
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "user": {
      "id": "usr_sindh_981",
      "name": "Aisha Siddiqui",
      "email": "aisha@example.com",
      "preferredJurisdiction": "sindh",
      "role": "citizen",
      "createdAt": "2026-10-16T10:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

---

### 1.3 Get Current User Session
- **Method**: `GET`
- **Endpoint**: `/api/v1/auth/me`
- **Headers**: `Authorization: Bearer <token>` or active cookie session
- **Success Response (`200 OK`)**:
  ```json
  {
    "id": "usr_sindh_981",
    "name": "Aisha Siddiqui",
    "email": "aisha@example.com",
    "preferredJurisdiction": "sindh",
    "role": "citizen",
    "createdAt": "2026-10-16T10:00:00Z"
  }
  ```

---

### 1.4 Sign Out
- **Method**: `POST`
- **Endpoint**: `/api/v1/auth/logout`
- **Success Response (`200 OK` or `204 No Content`)**:
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```

---

## 2. Conversations & Legal Queries

### 2.1 List Saved Consultations
- **Method**: `GET`
- **Endpoint**: `/api/v1/conversations`
- **Query Parameters**:
  - `limit`: (Optional integer, default 20)
  - `offset`: (Optional integer, default 0)
- **Success Response (`200 OK`)**:
  ```json
  [
    {
      "id": "conv_4921",
      "title": "Tenant Eviction & Utility Disconnection in Clifton, Karachi",
      "lastMessagePreview": "Under Section 11 & 15 of the Sindh Rented Premises Ordinance 1979...",
      "jurisdiction": "sindh",
      "topic": "tenancy",
      "messageCount": 4,
      "createdAt": "2026-10-14T10:00:00Z",
      "updatedAt": "2026-10-16T08:30:00Z"
    }
  ]
  ```

---

### 2.2 Retrieve Full Conversation Detail
- **Method**: `GET`
- **Endpoint**: `/api/v1/conversations/{id}`
- **Success Response (`200 OK`)**:
  ```json
  {
    "id": "conv_4921",
    "title": "Tenant Eviction & Utility Disconnection in Clifton, Karachi",
    "lastMessagePreview": "Under Section 11 & 15...",
    "jurisdiction": "sindh",
    "topic": "tenancy",
    "messageCount": 2,
    "createdAt": "2026-10-14T10:00:00Z",
    "updatedAt": "2026-10-16T08:30:00Z",
    "messages": [
      {
        "id": "msg_001",
        "conversationId": "conv_4921",
        "role": "user",
        "content": "Can my landlord cut off my water?",
        "timestamp": "2026-10-14T10:00:00Z",
        "jurisdiction": "sindh",
        "topic": "tenancy"
      },
      {
        "id": "msg_002",
        "conversationId": "conv_4921",
        "role": "assistant",
        "content": "Under Section 11 of the Sindh Rented Premises Ordinance, 1979...",
        "timestamp": "2026-10-14T10:00:03Z",
        "jurisdiction": "sindh",
        "topic": "tenancy",
        "confidenceLevel": "verified-statute",
        "citations": [
          {
            "id": "cite_srpo_s11",
            "actTitle": "The Sindh Rented Premises Ordinance, 1979",
            "shortTitle": "SRPO 1979",
            "section": "Section 11",
            "enactmentYear": 1979,
            "jurisdiction": "sindh",
            "officialGazetteRef": "Sindh Govt. Gazette 1979",
            "verbatimExcerpt": "No landlord shall discontinue or withhold any amenity...",
            "explanatoryNote": "Cutting off utilities without a Rent Controller order is illegal."
          }
        ],
        "evidenceSnippets": [
          {
            "id": "snip_01",
            "sourceDocument": "The Sindh Rented Premises Ordinance, 1979",
            "sectionReference": "Section 11",
            "snippetText": "No landlord shall discontinue or withhold any amenity enjoyed by the tenant...",
            "relevanceConfidence": 0.98
          }
        ],
        "suggestedQuestions": [
          "How do I file a complaint with the Rent Controller?"
        ]
      }
    ]
  }
  ```

---

### 2.3 Send Message / Submit Legal Inquiry
- **Method**: `POST`
- **Endpoint**: `/api/v1/conversations/{id}/messages` (or `POST /api/v1/conversations` if starting a new thread)
- **Request Body (`application/json`)**:
  ```json
  {
    "conversationId": "conv_4921", // Omit if creating new conversation
    "content": "Can my landlord increase rent after 1 year?",
    "jurisdiction": "sindh",
    "topic": "tenancy"
  }
  ```
- **Success Response (`200 OK` or `201 Created`)**:
  ```json
  {
    "conversationId": "conv_4921",
    "userMessage": {
      "id": "msg_003",
      "conversationId": "conv_4921",
      "role": "user",
      "content": "Can my landlord increase rent after 1 year?",
      "timestamp": "2026-10-16T10:15:00Z",
      "jurisdiction": "sindh"
    },
    "assistantMessage": {
      "id": "msg_004",
      "conversationId": "conv_4921",
      "role": "assistant",
      "content": "Under Section 8 of the Sindh Rented Premises Ordinance, 1979...",
      "timestamp": "2026-10-16T10:15:04Z",
      "jurisdiction": "sindh",
      "confidenceLevel": "verified-statute",
      "citations": [...],
      "evidenceSnippets": [...],
      "suggestedQuestions": [...]
    }
  }
  ```

---

### 2.4 Delete Conversation
- **Method**: `DELETE`
- **Endpoint**: `/api/v1/conversations/{id}`
- **Success Response (`200 OK` or `204 No Content`)**:
  ```json
  {
    "success": true,
    "message": "Conversation deleted"
  }
  ```

---

## 3. Error Response Format (Standard FastAPI RFC-7807 / HTTPValidation)

When a validation or server error occurs:
```json
{
  "detail": "Invalid credentials or user does not exist"
}
```
Or for Pydantic validation errors (`422 Unprocessable Entity`):
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "value is not a valid email address",
      "type": "value_error.email"
    }
  ]
}
```
The frontend `apiClient` automatically extracts and displays user-friendly error banners from both formats.
