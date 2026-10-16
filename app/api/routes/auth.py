"""Authentication routes: Sign up, Sign in (Login), and User Profile."""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api.deps import get_current_active_user
from app.core.logging import get_logger
from app.core.security import create_access_token
from app.db.models import User
from app.db.session import get_db_session
from app.schemas.auth import Token, UserCreate, UserLogin, UserResponse
from app.services.auth_service import AuthService

logger = get_logger(__name__)
router = APIRouter()


@router.post(
    "/signup",
    response_model=Token,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user account",
)
def signup(
    user_in: UserCreate,
    db: Session = Depends(get_db_session),
):
    """
    Register a new user account and return an access token.

    - **email**: Unique, valid email address
    - **full_name**: User's full name (at least 2 chars)
    - **password**: Secure password (at least 6 chars)
    """
    user = AuthService.register_user(db, user_in)
    access_token = create_access_token(subject=user.id)

    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user),
    )


@router.post(
    "/login",
    response_model=Token,
    summary="User sign in / login",
)
def login(
    credentials: UserLogin,
    db: Session = Depends(get_db_session),
):
    """
    Authenticate with email and password and return an access token.

    - **email**: User's registered email
    - **password**: Account password
    """
    user = AuthService.authenticate_user(db, credentials.email, credentials.password)
    if not user:
        logger.warning(f"Failed login attempt for email: {credentials.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive. Please contact support.",
        )

    access_token = create_access_token(subject=user.id)

    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user),
    )


@router.post(
    "/token",
    summary="OAuth2 compatible token endpoint for Swagger UI",
)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db_session),
):
    """
    OAuth2 compatible token login for FastAPI Docs / Swagger UI authorization.
    """
    user = AuthService.authenticate_user(db, form_data.username, form_data.password)
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(subject=user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current logged-in user profile",
)
def get_me(
    current_user: User = Depends(get_current_active_user),
):
    """
    Get profile information of the currently authenticated user.
    Requires Bearer token in Authorization header.
    """
    return UserResponse.model_validate(current_user)
