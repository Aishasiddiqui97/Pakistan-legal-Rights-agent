"""Authentication and User schemas."""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserBase(BaseModel):
    """Base user properties."""

    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=150)


class UserCreate(UserBase):
    """User registration schema."""

    password: str = Field(..., min_length=6, max_length=100, description="Password must be at least 6 characters")


class UserLogin(BaseModel):
    """User login request schema."""

    email: EmailStr
    password: str = Field(..., min_length=1)


class UserResponse(BaseModel):
    """Public user response schema."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    full_name: str
    is_active: bool
    is_superuser: bool
    created_at: datetime


class Token(BaseModel):
    """JWT response schema."""

    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenPayload(BaseModel):
    """JWT decoded payload."""

    sub: Optional[str] = None
    exp: Optional[int] = None
