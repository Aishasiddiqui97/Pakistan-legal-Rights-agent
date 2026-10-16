"""Test configuration and fixtures."""
import os
import tempfile
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import get_settings
from app.db.models import Base
from app.db.session import get_db_session
from app.main import create_app


@pytest.fixture(scope="session")
def test_db_engine():
    """Create test database engine."""
    import shutil
    # Use temporary file in current directory on D: drive to avoid C: drive space exhaustion
    test_db_path = Path("tests/.test_legalsaathi.db").resolve()
    main_db_path = Path("legalsaathi.db").resolve()

    if main_db_path.exists():
        shutil.copy2(main_db_path, test_db_path)

    database_url = f"sqlite:///{test_db_path.as_posix()}"
    engine = create_engine(database_url, connect_args={"check_same_thread": False})

    Base.metadata.create_all(bind=engine)

    yield engine

    # Cleanup
    engine.dispose()
    if test_db_path.exists():
        try:
            test_db_path.unlink()
        except OSError:
            pass


@pytest.fixture
def test_db_session(test_db_engine):
    """Create test database session."""
    TestingSessionLocal = sessionmaker(
        autocommit=False, autoflush=False, bind=test_db_engine
    )

    session = TestingSessionLocal()

    try:
        yield session
        session.rollback()
    finally:
        session.close()


@pytest.fixture
def client(test_db_session):
    """Create test client."""
    app = create_app()

    # Override database dependency
    def override_get_db():
        try:
            yield test_db_session
        finally:
            pass

    app.dependency_overrides[get_db_session] = override_get_db

    return TestClient(app)


@pytest.fixture
def sample_legal_text():
    """Sample legal text for testing."""
    return """
    THE SINDH SHOPS AND ESTABLISHMENTS ACT, 2015

    Section 5: Wages and Salary

    Every employer shall pay wages to employees on time as agreed in the employment contract.
    Wages shall be paid not later than the seventh day after the end of the wage period.

    Section 10: Working Hours

    No employee shall be required to work for more than 8 hours in a day or 48 hours in a week.

    Section 15: Penalties

    Any employer who fails to pay wages on time shall be liable to a fine or imprisonment.
    """


@pytest.fixture
def sample_pdf_path(tmp_path, sample_legal_text):
    """Create sample PDF for testing."""
    import fitz

    pdf_path = tmp_path / "test_document.pdf"

    # Create a simple PDF
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((72, 72), sample_legal_text)
    doc.save(str(pdf_path))
    doc.close()

    return pdf_path


@pytest.fixture
def sample_txt_path(tmp_path, sample_legal_text):
    """Create sample TXT for testing."""
    txt_path = tmp_path / "test_document.txt"
    txt_path.write_text(sample_legal_text)
    return txt_path
