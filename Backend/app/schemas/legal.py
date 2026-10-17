"""Legal analysis schemas."""
from typing import List, Optional
from enum import Enum

from pydantic import BaseModel, Field, field_validator


class LegalCategory(str, Enum):
    """Supported legal categories."""
    UNPAID_SALARY = "unpaid_salary"
    WORKPLACE_HARASSMENT = "workplace_harassment"
    TENANT_LANDLORD = "tenant_landlord"


class AnalysisStatus(str, Enum):
    """Analysis response status."""
    ANSWERED = "answered"
    NEEDS_CLARIFICATION = "needs_clarification"
    INSUFFICIENT_EVIDENCE = "insufficient_evidence"
    UNSUPPORTED_TOPIC = "unsupported_topic"
    OUTSIDE_SUPPORTED_JURISDICTION = "outside_supported_jurisdiction"
    ERROR = "error"


class Confidence(str, Enum):
    """Confidence levels."""
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class Citation(BaseModel):
    """Legal citation."""
    document_title: str = Field(description="Document title")
    provision: Optional[str] = Field(default=None, description="Provision or section")
    page_number: Optional[int] = Field(default=None, description="Page number")
    source_url: Optional[str] = Field(default=None, description="Source URL")
    excerpt: str = Field(description="Supporting excerpt from the document")


class LegalAnalysisRequest(BaseModel):
    """Legal analysis request."""
    question: str = Field(
        min_length=2,
        max_length=2000,
        description="User's legal question"
    )
    category: Optional[LegalCategory] = Field(
        default=None,
        description="Optional category hint from frontend"
    )
    country: str = Field(default="Pakistan", description="Country")
    city: str = Field(default="Karachi", description="City")
    province: str = Field(default="Sindh", description="Province")
    language: str = Field(
        default="en",
        pattern="^(en|ur)$",
        description="Response language (en or ur)"
    )
    context: Optional[str] = Field(
        default=None,
        max_length=5000,
        description="Additional context"
    )

    @field_validator("question")
    @classmethod
    def validate_question(cls, v: str) -> str:
        """Validate question is not empty."""
        if not v or not v.strip():
            raise ValueError("Question cannot be empty")
        return v.strip()


class LegalAnalysisResponse(BaseModel):
    """Legal analysis response."""
    request_id: str = Field(description="Unique request identifier")
    status: AnalysisStatus = Field(description="Response status")
    jurisdiction: str = Field(description="Jurisdiction (e.g., 'Karachi, Sindh, Pakistan')")
    category: Optional[LegalCategory] = Field(default=None, description="Identified category")
    summary: str = Field(description="Brief summary of the response")
    legal_information: Optional[str] = Field(
        default=None,
        description="Detailed legal information"
    )
    citations: List[Citation] = Field(
        default_factory=list,
        description="Legal citations and sources"
    )
    next_steps: List[str] = Field(
        default_factory=list,
        description="Suggested next steps"
    )
    evidence_to_preserve: List[str] = Field(
        default_factory=list,
        description="Evidence to preserve"
    )
    follow_up_questions: List[str] = Field(
        default_factory=list,
        description="Clarifying questions"
    )
    limitations: List[str] = Field(
        default_factory=list,
        description="Limitations and caveats"
    )
    confidence: Optional[Confidence] = Field(
        default=None,
        description="Confidence level"
    )
    disclaimer: str = Field(
        default="This information is for educational purposes only and does not constitute legal advice. "
                "Consult a qualified lawyer for advice specific to your situation.",
        description="Legal disclaimer"
    )


class SearchRequest(BaseModel):
    """Legal search request."""
    query: str = Field(
        min_length=3,
        max_length=500,
        description="Search query"
    )
    category: Optional[LegalCategory] = Field(
        default=None,
        description="Filter by category"
    )
    top_k: int = Field(
        default=5,
        ge=1,
        le=10,
        description="Number of results"
    )


class SearchResult(BaseModel):
    """Search result item."""
    document_title: str
    content: str
    page_number: Optional[int] = None
    section: Optional[str] = None
    source_url: Optional[str] = None
    category: str
    jurisdiction: str
    score: Optional[float] = None


class SearchResponse(BaseModel):
    """Search response."""
    query: str
    results: List[SearchResult]
    total: int
