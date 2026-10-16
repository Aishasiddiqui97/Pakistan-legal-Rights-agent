"""Groq service for LLM inference."""
import time
from typing import Optional

from groq import Groq, APIError, RateLimitError, APITimeoutError

from app.core.config import get_settings
from app.core.exceptions import ConfigurationError, GroqServiceError
from app.core.logging import get_logger

logger = get_logger(__name__)


class GroqService:
    """Service for interacting with Groq API."""

    def __init__(self):
        """Initialize Groq service."""
        settings = get_settings()

        if not settings.groq_api_key:
            raise ConfigurationError("GROQ_API_KEY is not configured")

        self.client = Groq(api_key=settings.groq_api_key)
        self.model = settings.groq_model
        self.timeout = settings.groq_timeout
        self.max_retries = settings.groq_max_retries

    def generate_completion(
        self,
        messages: list[dict],
        temperature: float = 0.3,
        max_tokens: int = 2000,
    ) -> str:
        """
        Generate completion from Groq.

        Args:
            messages: List of message dictionaries with 'role' and 'content'
            temperature: Sampling temperature
            max_tokens: Maximum tokens to generate

        Returns:
            Generated text

        Raises:
            GroqServiceError: If generation fails
        """
        for attempt in range(self.max_retries + 1):
            try:
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=messages,
                    temperature=temperature,
                    max_tokens=max_tokens,
                    timeout=self.timeout,
                )

                content = response.choices[0].message.content
                if not content:
                    raise GroqServiceError("Empty response from Groq")

                return content.strip()

            except RateLimitError as e:
                if attempt < self.max_retries:
                    wait_time = 2 ** attempt
                    logger.warning(f"Rate limit hit, retrying in {wait_time}s: {e}")
                    time.sleep(wait_time)
                    continue
                raise GroqServiceError(f"Rate limit exceeded: {e}", status_code=429)

            except APITimeoutError as e:
                if attempt < self.max_retries:
                    logger.warning(f"Timeout, retrying: {e}")
                    continue
                raise GroqServiceError(f"Request timeout: {e}", status_code=504)

            except APIError as e:
                logger.error(f"Groq API error: {e}")
                raise GroqServiceError(f"API error: {e}", status_code=503)

            except Exception as e:
                logger.error(f"Unexpected error in Groq service: {e}")
                raise GroqServiceError(f"Unexpected error: {e}")

    def classify_topic(self, question: str) -> tuple[Optional[str], bool]:
        """
        Classify if question is about supported topics and jurisdiction.

        Returns:
            Tuple of (category, is_in_scope)
        """
        prompt = f"""Analyze this legal question and determine:
1. Is it about one of these topics: unpaid salary/employment disputes, workplace harassment, OR tenant/landlord disputes?
2. Is it about Karachi, Sindh, Pakistan (or Pakistan in general)?

Question: {question}

Respond ONLY with one of these exact formats:
- "unpaid_salary|yes" if about employment/salary and in scope
- "workplace_harassment|yes" if about harassment and in scope
- "tenant_landlord|yes" if about tenant/landlord and in scope
- "unsupported|no" if about other topics or other locations

Be strict - only classify as supported if it clearly fits one category."""

        try:
            messages = [
                {"role": "system", "content": "You are a legal topic classifier. Respond only in the specified format."},
                {"role": "user", "content": prompt}
            ]

            response = self.generate_completion(messages, temperature=0.1, max_tokens=200)

            parts = response.strip().lower().split("|")
            if len(parts) == 2:
                category = parts[0].strip()
                in_scope = parts[1].strip() == "yes"

                if category in ["unpaid_salary", "workplace_harassment", "tenant_landlord"]:
                    return category if in_scope else None, in_scope

            return None, False

        except Exception as e:
            logger.error(f"Topic classification failed: {e}")
            return None, True  # Fail open, let retrieval determine


def get_groq_service() -> Optional[GroqService]:
    """Get Groq service instance, or None if not configured."""
    try:
        return GroqService()
    except ConfigurationError:
        return None
