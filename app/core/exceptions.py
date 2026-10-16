"""Custom exceptions."""


class LegalSaathiException(Exception):
    """Base exception for LegalSaathi AI."""

    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class ConfigurationError(LegalSaathiException):
    """Configuration error."""

    def __init__(self, message: str):
        super().__init__(message, status_code=500)


class GroqServiceError(LegalSaathiException):
    """Groq service error."""

    def __init__(self, message: str, status_code: int = 503):
        super().__init__(message, status_code=status_code)


class DocumentProcessingError(LegalSaathiException):
    """Document processing error."""

    def __init__(self, message: str):
        super().__init__(message, status_code=400)


class RetrievalError(LegalSaathiException):
    """Retrieval error."""

    def __init__(self, message: str):
        super().__init__(message, status_code=500)


class ValidationError(LegalSaathiException):
    """Validation error."""

    def __init__(self, message: str):
        super().__init__(message, status_code=400)


class UnsupportedTopicError(LegalSaathiException):
    """Unsupported topic error."""

    def __init__(self, message: str):
        super().__init__(message, status_code=400)


class InsufficientEvidenceError(LegalSaathiException):
    """Insufficient evidence error."""

    def __init__(self, message: str):
        super().__init__(message, status_code=200)
