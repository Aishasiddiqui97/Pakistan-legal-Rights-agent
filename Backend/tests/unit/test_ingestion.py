"""Test document ingestion."""
import pytest

from app.core.exceptions import DocumentProcessingError
from app.db.models import LegalDocument
from app.services.ingestion_service import IngestionService


def test_ingest_txt_document(test_db_session, sample_txt_path):
    """Test ingesting a TXT document."""
    service = IngestionService(test_db_session)

    document = service.ingest_document(
        file_path=sample_txt_path,
        title="Test Legal Document",
        category="unpaid_salary",
        jurisdiction="Karachi, Sindh, Pakistan",
    )

    assert document.id is not None
    assert document.title == "Test Legal Document"
    assert document.category == "unpaid_salary"
    assert document.document_type == "txt"
    assert document.ingestion_status == "completed"
    assert document.total_chunks > 0


def test_ingest_pdf_document(test_db_session, sample_pdf_path):
    """Test ingesting a PDF document."""
    service = IngestionService(test_db_session)

    document = service.ingest_document(
        file_path=sample_pdf_path,
        title="Test PDF Document",
        category="workplace_harassment",
        jurisdiction="Karachi, Sindh, Pakistan",
    )

    assert document.id is not None
    assert document.title == "Test PDF Document"
    assert document.document_type == "pdf"
    assert document.ingestion_status == "completed"
    assert document.total_chunks > 0
    assert document.total_pages == 1


def test_ingest_duplicate_document(test_db_session, sample_txt_path):
    """Test ingesting duplicate document."""
    service = IngestionService(test_db_session)

    # Ingest once
    doc1 = service.ingest_document(
        file_path=sample_txt_path,
        title="Test Document",
        category="unpaid_salary",
    )

    # Try to ingest again
    doc2 = service.ingest_document(
        file_path=sample_txt_path,
        title="Test Document Again",
        category="unpaid_salary",
    )

    # Should return the same document
    assert doc1.id == doc2.id


def test_ingest_nonexistent_file(test_db_session, tmp_path):
    """Test ingesting non-existent file."""
    service = IngestionService(test_db_session)

    with pytest.raises(DocumentProcessingError):
        service.ingest_document(
            file_path=tmp_path / "nonexistent.pdf",
            title="Test",
            category="unpaid_salary",
        )


def test_ingest_empty_file(test_db_session, tmp_path):
    """Test ingesting empty file."""
    empty_file = tmp_path / "empty.txt"
    empty_file.touch()

    service = IngestionService(test_db_session)

    with pytest.raises(DocumentProcessingError, match="empty"):
        service.ingest_document(
            file_path=empty_file,
            title="Empty Document",
            category="unpaid_salary",
        )


def test_ingest_unsupported_format(test_db_session, tmp_path):
    """Test ingesting unsupported file format."""
    unsupported_file = tmp_path / "document.docx"
    unsupported_file.write_text("test content")

    service = IngestionService(test_db_session)

    with pytest.raises(DocumentProcessingError, match="Unsupported file type"):
        service.ingest_document(
            file_path=unsupported_file,
            title="Unsupported Document",
            category="unpaid_salary",
        )
