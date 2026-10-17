"""Document schemas."""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class DocumentMetadata(BaseModel):
    """Document metadata for ingestion."""
    title: str = Field(description="Document title")
    source_url: Optional[str] = Field(default=None, description="Source URL")
    issuing_authority: Optional[str] = Field(default=None, description="Issuing authority")
    jurisdiction: str = Field(default="Karachi, Sindh, Pakistan", description="Jurisdiction")
    category: str = Field(description="Legal category")
    publication_date: Optional[str] = Field(default=None, description="Publication date (YYYY-MM-DD)")
    version: Optional[str] = Field(default=None, description="Document version")


class DocumentIngestionResponse(BaseModel):
    """Document ingestion response."""
    document_id: int
    title: str
    status: str
    total_chunks: int
    message: str


class DocumentInfo(BaseModel):
    """Document information."""
    id: int
    title: str
    source_url: Optional[str]
    jurisdiction: str
    category: str
    document_type: str
    ingestion_status: str
    total_pages: Optional[int]
    total_chunks: int
    created_at: datetime
