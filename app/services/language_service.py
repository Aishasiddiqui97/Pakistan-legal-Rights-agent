"""Language detection and handling service."""
import re
from typing import Literal

from app.core.logging import get_logger

logger = get_logger(__name__)

LanguageCode = Literal["en", "roman_urdu"]


class LanguageService:
    """Service for language detection and handling."""

    # Common Roman Urdu words and patterns
    ROMAN_URDU_PATTERNS = [
        # Common Urdu words in Roman script
        r'\b(mera|meri|mere|hai|hain|ka|ki|ke|ko|ne|se|main|aap|tum|ye|wo|kya|kaise|kyun|jab|tab)\b',
        # Question words
        r'\b(kya|kahan|kab|kaise|kyun|kaun|kitna|kitni|kitne)\b',
        # Common verbs
        r'\b(kar|karna|karte|karti|kiya|kiye|ho|hoga|hogi|hoega|tha|thi|the)\b',
        # Common phrases
        r'\b(nahi|nahin|bilkul|bohot|bahut|thoda|zyada|kam|sab|kuch)\b',
        # Employment/legal terms in Roman Urdu
        r'\b(tankhwa|tankhwah|mulazim|mulazmat|malik|kiraya|makaan|gherao)\b',
    ]

    # Compile patterns for efficiency
    ROMAN_URDU_REGEX = re.compile('|'.join(ROMAN_URDU_PATTERNS), re.IGNORECASE)

    def detect_language(self, text: str) -> LanguageCode:
        """
        Detect if text is in Roman Urdu or English.

        Args:
            text: Text to analyze

        Returns:
            Language code: 'en' or 'roman_urdu'
        """
        if not text or not text.strip():
            return "en"

        # Normalize text for checking
        text_lower = text.lower()

        # Count Roman Urdu word matches
        matches = self.ROMAN_URDU_REGEX.findall(text_lower)

        # If we find multiple Roman Urdu words, classify as Roman Urdu
        if len(matches) >= 3:
            logger.info(f"Detected Roman Urdu (found {len(matches)} markers)")
            return "roman_urdu"

        # Check for common Roman Urdu phrases
        roman_urdu_phrases = [
            'mera employer',
            'tankhwa nahi',
            'mulazmat se',
            'malik ne',
            'kiraya de',
            'kya kar',
        ]

        for phrase in roman_urdu_phrases:
            if phrase in text_lower:
                logger.info(f"Detected Roman Urdu (found phrase: {phrase})")
                return "roman_urdu"

        return "en"

    def get_system_message_suffix(self, language: LanguageCode) -> str:
        """
        Get system message suffix for language-specific instructions.

        Args:
            language: Detected language code

        Returns:
            Additional system instructions
        """
        if language == "roman_urdu":
            return (
                "\n\nIMPORTANT: The user has asked their question in Roman Urdu (Urdu written in English script). "
                "You should respond in a mix of English and Roman Urdu to make the legal information accessible. "
                "Use simple Roman Urdu words where appropriate, especially for common legal terms and explanations. "
                "Keep legal citations and statutory references in English for clarity.\n"
                "Example style: 'Aap ke sawal ka jawab ye hai ke according to Sindh Payment of Wages Act, 2015...'"
            )
        return ""

    def translate_category_name(self, category: str, language: LanguageCode) -> str:
        """
        Translate category name to appropriate language.

        Args:
            category: Category identifier
            language: Target language

        Returns:
            Translated category name
        """
        if language == "en":
            translations = {
                "unpaid_salary": "unpaid salary and employment disputes",
                "workplace_harassment": "workplace harassment",
                "tenant_landlord": "tenant and landlord disputes",
            }
        else:  # roman_urdu
            translations = {
                "unpaid_salary": "tankhwa na milna aur mulazmat ke masail",
                "workplace_harassment": "workplace harassment (daftar mein zulm)",
                "tenant_landlord": "kiraya aur makaan ke masail",
            }

        return translations.get(category, category)


def get_language_service() -> LanguageService:
    """Get language service instance."""
    return LanguageService()
