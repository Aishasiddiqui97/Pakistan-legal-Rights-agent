"""Authentication service for managing user registration, verification, and retrieval."""
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.logging import get_logger
from app.core.security import get_password_hash, verify_password
from app.db.models import User
from app.schemas.auth import UserCreate

logger = get_logger(__name__)


class AuthService:
    """Service handling user authentication logic."""

    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[User]:
        """Fetch a user by email address."""
        normalized_email = email.strip().lower()
        statement = select(User).where(User.email == normalized_email)
        return db.execute(statement).scalar_one_or_none()

    @staticmethod
    def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
        """Fetch a user by ID."""
        statement = select(User).where(User.id == user_id)
        return db.execute(statement).scalar_one_or_none()

    @staticmethod
    def register_user(db: Session, user_in: UserCreate) -> User:
        """
        Register a new user.

        Raises:
            HTTPException: 400 Bad Request if email already exists
        """
        normalized_email = user_in.email.strip().lower()
        existing_user = AuthService.get_user_by_email(db, normalized_email)
        if existing_user:
            logger.warning(f"Registration failed: Email {normalized_email} already registered")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A user with this email address already exists.",
            )

        hashed_pw = get_password_hash(user_in.password)
        db_user = User(
            full_name=user_in.full_name.strip(),
            email=normalized_email,
            hashed_password=hashed_pw,
            is_active=True,
            is_superuser=False,
        )

        db.add(db_user)
        db.commit()
        db.refresh(db_user)

        logger.info(f"User registered successfully: id={db_user.id}, email={db_user.email}")
        return db_user

    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
        """
        Authenticate user with email and password.

        Returns:
            User instance if credentials are valid, None otherwise
        """
        user = AuthService.get_user_by_email(db, email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user
