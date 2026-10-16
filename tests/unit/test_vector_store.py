"""Test vector store."""
import tempfile
from pathlib import Path

import pytest

from app.rag.vector_store import VectorStore


@pytest.fixture
def temp_vector_store():
    """Create temporary vector store."""
    with tempfile.TemporaryDirectory() as tmpdir:
        # Override vector store path for testing
        import app.core.config
        original_path = app.core.config.get_settings().vector_store_path

        settings = app.core.config.get_settings()
        settings.vector_store_path = tmpdir

        store = VectorStore(dimension=128)

        yield store

        settings.vector_store_path = original_path


def test_initialize_vector_store(temp_vector_store):
    """Test vector store initialization."""
    assert temp_vector_store.dimension == 128
    assert temp_vector_store.size == 0


def test_add_vectors(temp_vector_store):
    """Test adding vectors."""
    vectors = [[0.1] * 128, [0.2] * 128, [0.3] * 128]
    metadata = [
        {"vector_id": "v1", "category": "test"},
        {"vector_id": "v2", "category": "test"},
        {"vector_id": "v3", "category": "test"},
    ]

    vector_ids = temp_vector_store.add_vectors(vectors, metadata)

    assert len(vector_ids) == 3
    assert temp_vector_store.size == 3


def test_search_vectors(temp_vector_store):
    """Test searching vectors."""
    vectors = [[0.1] * 128, [0.5] * 128, [0.9] * 128]
    metadata = [
        {"vector_id": "v1", "category": "cat1"},
        {"vector_id": "v2", "category": "cat2"},
        {"vector_id": "v3", "category": "cat1"},
    ]

    temp_vector_store.add_vectors(vectors, metadata)

    # Search for similar vector
    query = [0.15] * 128
    results = temp_vector_store.search(query, top_k=2)

    assert len(results) == 2
    # First result should be closest
    assert results[0][2]["vector_id"] == "v1"


def test_search_with_filter(temp_vector_store):
    """Test searching with metadata filter."""
    vectors = [[0.1] * 128, [0.5] * 128, [0.9] * 128]
    metadata = [
        {"vector_id": "v1", "category": "cat1"},
        {"vector_id": "v2", "category": "cat2"},
        {"vector_id": "v3", "category": "cat1"},
    ]

    temp_vector_store.add_vectors(vectors, metadata)

    # Search with category filter
    query = [0.5] * 128
    results = temp_vector_store.search(
        query, top_k=5, filter_metadata={"category": "cat1"}
    )

    assert len(results) == 2
    for _, _, meta in results:
        assert meta["category"] == "cat1"


def test_empty_search(temp_vector_store):
    """Test searching empty store."""
    query = [0.1] * 128
    results = temp_vector_store.search(query, top_k=5)
    assert results == []
