"""FastAPI authentication and request dependencies."""
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.security import decode_access_token
from app.db.models import User
from app.db.session import get_db_session
from app.services.auth_service import AuthService

settings = get_settings()

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.api_v1_prefix}/auth/token",
    auto_error=False,
)


def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db_session),
) -> User:
    """
    Extract and validate current authenticated user from Bearer token.

    Raises:
        HTTPException: 401 if missing, invalid, or user not found
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials. Please log in again.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if not token:
        raise credentials_exception

    payload = decode_access_token(token)
    if not payload:
        raise credentials_exception

    sub = payload.get("sub")
    if not sub:
        raise credentials_exception

    # Try resolving by user id first, fallback to email
    user = None
    try:
        user_id = int(sub)
        user = AuthService.get_user_by_id(db, user_id)
    except (ValueError, TypeError):
        pass

    if not user:
        user = AuthService.get_user_by_email(db, str(sub))

    if not user:
        raise credentials_exception

    return user


def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """Ensure that the authenticated user account is active."""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive.",
        )
    return current_user


def get_optional_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db_session),
) -> Optional[User]:
    """Return user if token is provided and valid, otherwise return None."""
    if not token:
        return None
    try:
        return get_current_user(token=token, db=db)
    except HTTPException:
        return None
