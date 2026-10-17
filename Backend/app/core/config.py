"""Application configuration."""
from functools import lru_cache
from typing import List

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )

    # Application
    app_env: str = Field(default="development")
    app_name: str = Field(default="LegalSaathi AI")
    api_v1_prefix: str = Field(default="/api/v1")
    host: str = Field(default="0.0.0.0")
    port: int = Field(default=8001)

    # Groq
    groq_api_key: str = Field(default="")
    groq_model: str = Field(default="llama-3.3-70b-versatile")
    groq_timeout: int = Field(default=30)
    groq_max_retries: int = Field(default=2)

    # Database
    database_url: str = Field(default="sqlite:///./legalsaathi.db")

    # CORS
    cors_origins: str = Field(default="http://localhost:3000")

    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins into list."""
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    # File Upload
    max_upload_size_mb: int = Field(default=15)

    @property
    def max_upload_size_bytes(self) -> int:
        """Convert MB to bytes."""
        return self.max_upload_size_mb * 1024 * 1024

    # Logging
    log_level: str = Field(default="INFO")

    # Embedding Model
    embedding_model: str = Field(default="sentence-transformers/paraphrase-multilingual-mpnet-base-v2")
    embedding_dimension: int = Field(default=768)

    # Vector Store
    vector_store_path: str = Field(default="./data/vector_store")

    # Chunking
    chunk_size: int = Field(default=1000)
    chunk_overlap: int = Field(default=200)

    # Retrieval
    retrieval_top_k: int = Field(default=5)
    max_retrieval_top_k: int = Field(default=10)

    # Authentication & JWT
    jwt_secret_key: str = Field(default="legalsaathi-secure-jwt-secret-key-change-in-production")
    jwt_algorithm: str = Field(default="HS256")
    jwt_access_token_expire_minutes: int = Field(default=1440)


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
