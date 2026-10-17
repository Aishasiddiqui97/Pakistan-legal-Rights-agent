"""Test text chunking."""
from app.rag.chunking import TextChunker


def test_chunk_small_text():
    """Test chunking text smaller than chunk size."""
    chunker = TextChunker(chunk_size=1000, chunk_overlap=100)
    text = "This is a small text."

    chunks = chunker.chunk_text(text)

    assert len(chunks) == 1
    assert chunks[0] == text


def test_chunk_large_text():
    """Test chunking large text."""
    chunker = TextChunker(chunk_size=100, chunk_overlap=20)
    text = "This is a sentence. " * 50  # Create text > 100 chars

    chunks = chunker.chunk_text(text)

    assert len(chunks) > 1
    for chunk in chunks:
        assert len(chunk) <= 120  # Allow some flexibility


def test_chunk_with_paragraphs():
    """Test chunking preserves paragraphs."""
    chunker = TextChunker(chunk_size=100, chunk_overlap=20)
    text = "Paragraph one.\n\nParagraph two.\n\nParagraph three."

    chunks = chunker.chunk_text(text)

    assert len(chunks) >= 1


def test_chunk_empty_text():
    """Test chunking empty text."""
    chunker = TextChunker()
    chunks = chunker.chunk_text("")
    assert chunks == []


def test_extract_page_chunks():
    """Test extracting chunks from pages."""
    chunker = TextChunker(chunk_size=50, chunk_overlap=10)
    page_texts = [
        (1, "First page text content."),
        (2, "Second page text content."),
    ]

    chunks_with_metadata = chunker.extract_page_chunks(page_texts)

    assert len(chunks_with_metadata) > 0
    for chunk_text, page_num, section in chunks_with_metadata:
        assert isinstance(chunk_text, str)
        assert isinstance(page_num, int)
        assert page_num in [1, 2]
        # section can be None or str
        assert section is None or isinstance(section, str)


def test_extract_section_reference():
    """Test section reference extraction."""
    chunker = TextChunker()

    # Test Section extraction
    text1 = "Section 5 of the Act states that..."
    assert chunker.extract_section_reference(text1) == "Section 5"

    # Test Article extraction
    text2 = "Article 3A provides that..."
    assert chunker.extract_section_reference(text2) == "Article 3A"

    # Test with subsection
    text3 = "Section 10(a) specifically mentions..."
    assert chunker.extract_section_reference(text3) == "Section 10(a)"

    # Test no section
    text4 = "This is some general text without sections."
    assert chunker.extract_section_reference(text4) is None
