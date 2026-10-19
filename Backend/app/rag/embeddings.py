"""Embedding generation service."""
from typing import List

from fastembed import TextEmbedding

from app.core.config import get_settings
from app.core.exceptions import RetrievalError
from app.core.logging import get_logger

logger = get_logger(__name__)


class EmbeddingService:
    """Service for generating embeddings."""

    _instance = None
    _model = None

    def __new__(cls):
        """Singleton pattern to avoid loading model multiple times."""
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        """Initialize embedding service."""
        if self._model is None:
            settings = get_settings()
            logger.info(f"Loading embedding model: {settings.embedding_model}")
            try:
                # Assign to the class, not the instance, so the singleton
                # actually shares one loaded model.
                EmbeddingService._model = TextEmbedding(
                    model_name=settings.embedding_model,
                    cache_dir=settings.embedding_cache_dir,
                )
                logger.info("Embedding model loaded successfully")
            except Exception as e:
                logger.error(f"Failed to load embedding model: {e}")
                raise RetrievalError(f"Failed to load embedding model: {e}")

    def embed_text(self, text: str) -> List[float]:
        """
        Generate embedding for a single text.

        Args:
            text: Text to embed

        Returns:
            Embedding vector as list of floats

        Raises:
            RetrievalError: If embedding fails
        """
        try:
            embedding = next(iter(self._model.embed([text])))
            return embedding.tolist()
        except Exception as e:
            logger.error(f"Embedding generation failed: {e}")
            raise RetrievalError(f"Embedding generation failed: {e}")

    def embed_batch(self, texts: List[str], batch_size: int = 32) -> List[List[float]]:
        """
        Generate embeddings for multiple texts.

        Args:
            texts: List of texts to embed
            batch_size: Batch size for processing

        Returns:
            List of embedding vectors

        Raises:
            RetrievalError: If embedding fails
        """
        if not texts:
            return []

        try:
            embeddings = self._model.embed(texts, batch_size=batch_size)
            return [emb.tolist() for emb in embeddings]
        except Exception as e:
            logger.error(f"Batch embedding generation failed: {e}")
            raise RetrievalError(f"Batch embedding generation failed: {e}")

    @property
    def dimension(self) -> int:
        """Get embedding dimension."""
        settings = get_settings()
        return settings.embedding_dimension


def get_embedding_service() -> EmbeddingService:
    """Get embedding service instance."""
    return EmbeddingService()
