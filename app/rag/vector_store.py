"""FAISS vector store."""
import json
import pickle
from pathlib import Path
from typing import List, Optional, Tuple

import faiss
import numpy as np

from app.core.config import get_settings
from app.core.exceptions import RetrievalError
from app.core.logging import get_logger

logger = get_logger(__name__)


class VectorStore:
    """FAISS-based vector store."""

    def __init__(self, dimension: int = None):
        """
        Initialize vector store.

        Args:
            dimension: Embedding dimension
        """
        settings = get_settings()
        self.dimension = dimension or settings.embedding_dimension
        self.store_path = Path(settings.vector_store_path)
        self.store_path.mkdir(parents=True, exist_ok=True)

        self.index_path = self.store_path / "faiss.index"
        self.metadata_path = self.store_path / "metadata.pkl"

        self.index: Optional[faiss.Index] = None
        self.metadata: List[dict] = []

        # Try to load existing index
        if self.index_path.exists():
            self.load()
        else:
            self._initialize_index()

    def _initialize_index(self) -> None:
        """Initialize a new FAISS index."""
        # Use flat L2 index for simplicity and accuracy
        self.index = faiss.IndexFlatL2(self.dimension)
        self.metadata = []
        logger.info(f"Initialized new FAISS index with dimension {self.dimension}")

    def add_vectors(
        self,
        vectors: List[List[float]],
        metadata: List[dict]
    ) -> List[int]:
        """
        Add vectors to the index.

        Args:
            vectors: List of embedding vectors
            metadata: List of metadata dicts for each vector

        Returns:
            List of vector IDs (indices)

        Raises:
            RetrievalError: If adding vectors fails
        """
        if len(vectors) != len(metadata):
            raise RetrievalError("Vectors and metadata lists must have same length")

        if not vectors:
            return []

        try:
            # Convert to numpy array
            vectors_array = np.array(vectors, dtype=np.float32)

            if vectors_array.shape[1] != self.dimension:
                raise RetrievalError(
                    f"Vector dimension {vectors_array.shape[1]} does not match index dimension {self.dimension}"
                )

            # Get starting index
            start_idx = self.index.ntotal

            # Add to FAISS index
            self.index.add(vectors_array)

            # Store metadata
            self.metadata.extend(metadata)

            # Return vector IDs
            vector_ids = list(range(start_idx, start_idx + len(vectors)))

            logger.info(f"Added {len(vectors)} vectors to index")

            return vector_ids

        except Exception as e:
            logger.error(f"Failed to add vectors: {e}")
            raise RetrievalError(f"Failed to add vectors: {e}")

    def search(
        self,
        query_vector: List[float],
        top_k: int = 5,
        filter_metadata: Optional[dict] = None
    ) -> List[Tuple[int, float, dict]]:
        """
        Search for similar vectors.

        Args:
            query_vector: Query embedding vector
            top_k: Number of results to return
            filter_metadata: Optional metadata filters (e.g., {"category": "unpaid_salary"})

        Returns:
            List of (vector_id, distance, metadata) tuples

        Raises:
            RetrievalError: If search fails
        """
        if self.index.ntotal == 0:
            logger.warning("Vector store is empty")
            return []

        try:
            # Convert query to numpy array
            query_array = np.array([query_vector], dtype=np.float32)

            if query_array.shape[1] != self.dimension:
                raise RetrievalError(
                    f"Query dimension {query_array.shape[1]} does not match index dimension {self.dimension}"
                )

            # Search more if we need to filter (search sufficient candidates to find filtered matches)
            search_k = min(self.index.ntotal, max(top_k * 20, 100)) if filter_metadata else top_k

            # Perform search
            distances, indices = self.index.search(query_array, min(search_k, self.index.ntotal))

            # Collect results
            results = []
            for dist, idx in zip(distances[0], indices[0]):
                if idx == -1:  # FAISS returns -1 for empty slots
                    continue

                idx = int(idx)
                if idx >= len(self.metadata):
                    logger.warning(f"Index {idx} out of range for metadata")
                    continue

                meta = self.metadata[idx]

                # Apply filters
                if filter_metadata:
                    if not all(meta.get(k) == v for k, v in filter_metadata.items()):
                        continue

                results.append((idx, float(dist), meta))

                if len(results) >= top_k:
                    break

            return results

        except Exception as e:
            logger.error(f"Vector search failed: {e}")
            raise RetrievalError(f"Vector search failed: {e}")

    def save(self) -> None:
        """Save index and metadata to disk."""
        try:
            # Save FAISS index
            faiss.write_index(self.index, str(self.index_path))

            # Save metadata
            with open(self.metadata_path, 'wb') as f:
                pickle.dump(self.metadata, f)

            logger.info(f"Saved vector store with {self.index.ntotal} vectors")

        except Exception as e:
            logger.error(f"Failed to save vector store: {e}")
            raise RetrievalError(f"Failed to save vector store: {e}")

    def load(self) -> None:
        """Load index and metadata from disk."""
        try:
            if not self.index_path.exists():
                logger.warning("No existing index found, initializing new one")
                self._initialize_index()
                return

            # Load FAISS index
            self.index = faiss.read_index(str(self.index_path))

            # Load metadata
            if self.metadata_path.exists():
                with open(self.metadata_path, 'rb') as f:
                    self.metadata = pickle.load(f)
            else:
                self.metadata = []

            logger.info(f"Loaded vector store with {self.index.ntotal} vectors")

        except Exception as e:
            logger.error(f"Failed to load vector store: {e}")
            logger.warning("Initializing new index")
            self._initialize_index()

    def clear(self) -> None:
        """Clear the vector store."""
        self._initialize_index()
        logger.info("Cleared vector store")

    def rebuild(self, vectors: List[List[float]], metadata: List[dict]) -> None:
        """
        Rebuild the entire index.

        Args:
            vectors: All vectors
            metadata: All metadata
        """
        self.clear()
        self.add_vectors(vectors, metadata)
        self.save()
        logger.info(f"Rebuilt vector store with {len(vectors)} vectors")

    @property
    def size(self) -> int:
        """Get number of vectors in the index."""
        return self.index.ntotal if self.index else 0
