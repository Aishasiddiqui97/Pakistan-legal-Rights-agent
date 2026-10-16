"""Unit tests for authentication security, hashing, and AuthService."""
import pytest
from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.security import (
    create_access_token,
    decode_access_token,
    get_password_hash,
    verify_password,
)
from app.db.models import Base, User
from app.schemas.auth import UserCreate
from app.services.auth_service import AuthService


# Uses test_db_session fixture defined in tests/conftest.py


def test_password_hashing():
    """Test that password hashing works and verifies correctly."""
    raw_password = "SecurePassword123!"
    hashed = get_password_hash(raw_password)

    assert hashed != raw_password
    assert hashed.startswith("$2b$")
    assert verify_password(raw_password, hashed) is True
    assert verify_password("WrongPassword", hashed) is False


def test_jwt_token_creation_and_decoding():
    """Test JWT creation and payload decoding."""
    token = create_access_token(subject=42, extra_claims={"role": "tester"})
    assert isinstance(token, str)

    payload = decode_access_token(token)
    assert payload is not None
    assert payload.get("sub") == "42"
    assert payload.get("role") == "tester"
    assert "exp" in payload


def test_jwt_invalid_token():
    """Test decoding an invalid token returns None."""
    payload = decode_access_token("not.a.valid.jwt.token")
    assert payload is None


def test_auth_service_register_user(test_db_session):
    """Test successful user registration."""
    user_in = UserCreate(
        email="testuser@example.com",
        password="MyPassword123",
        full_name="Test User",
    )
    user = AuthService.register_user(test_db_session, user_in)

    assert user.id is not None
    assert user.email == "testuser@example.com"
    assert user.full_name == "Test User"
    assert user.is_active is True
    assert verify_password("MyPassword123", user.hashed_password) is True


def test_auth_service_duplicate_email(test_db_session):
    """Test that registering duplicate email raises HTTPException."""
    user_in = UserCreate(
        email="duplicate@example.com",
        password="Password123",
        full_name="First User",
    )
    AuthService.register_user(test_db_session, user_in)

    # Attempt duplicate registration
    with pytest.raises(HTTPException) as exc_info:
        AuthService.register_user(test_db_session, user_in)

    assert exc_info.value.status_code == 400
    assert "already exists" in exc_info.value.detail


def test_auth_service_authenticate(test_db_session):
    """Test authentication with valid and invalid credentials."""
    user_in = UserCreate(
        email="login@example.com",
        password="ValidPassword456",
        full_name="Login User",
    )
    AuthService.register_user(test_db_session, user_in)

    # Correct credentials
    auth_user = AuthService.authenticate_user(test_db_session, "login@example.com", "ValidPassword456")
    assert auth_user is not None
    assert auth_user.email == "login@example.com"

    # Incorrect password
    wrong_pass = AuthService.authenticate_user(test_db_session, "login@example.com", "WrongPassword")
    assert wrong_pass is None

    # Non-existent email
    no_user = AuthService.authenticate_user(test_db_session, "nobody@example.com", "ValidPassword456")
    assert no_user is None
