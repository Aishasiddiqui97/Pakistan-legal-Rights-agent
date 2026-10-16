"""Legal service - main RAG pipeline."""
import uuid
from typing import Optional

from sqlalchemy.orm import Session

from app.core.exceptions import (
    InsufficientEvidenceError,
    UnsupportedTopicError,
)
from app.core.logging import get_logger
from app.schemas.legal import (
    AnalysisStatus,
    Confidence,
    LegalAnalysisRequest,
    LegalAnalysisResponse,
    LegalCategory,
)
from app.services.citation_service import CitationService
from app.services.groq_service import GroqService
from app.services.language_service import get_language_service
from app.services.retrieval_service import RetrievalService

logger = get_logger(__name__)


class LegalService:
    """Main legal analysis service coordinating the RAG pipeline."""

    def __init__(self, db: Session, groq_service: GroqService):
        """Initialize legal service."""
        self.db = db
        self.groq_service = groq_service
        self.retrieval_service = RetrievalService(db)
        self.citation_service = CitationService()
        self.language_service = get_language_service()

    def analyze(self, request: LegalAnalysisRequest) -> LegalAnalysisResponse:
        """
        Analyze a legal question using the RAG pipeline.

        Args:
            request: Legal analysis request

        Returns:
            Legal analysis response
        """
        request_id = str(uuid.uuid4())

        # Validate jurisdiction
        if not self._is_supported_jurisdiction(request.country, request.city, request.province):
            return self._build_out_of_scope_response(request_id)

        # Determine category - use provided category if available, otherwise classify
        if request.category:
            # User provided explicit category
            category_enum = request.category
            category = category_enum.value
        else:
            # Classify topic using LLM
            category, in_scope = self.groq_service.classify_topic(request.question)

            if not in_scope or category not in ["unpaid_salary", "workplace_harassment", "tenant_landlord"]:
                return self._build_unsupported_topic_response(request_id)

            # Map to enum
            try:
                category_enum = LegalCategory(category)
            except ValueError:
                return self._build_unsupported_topic_response(request_id)

        # Retrieve relevant context
        search_results, formatted_context = self.retrieval_service.get_relevant_context(
            query=request.question,
            category=category,
            top_k=5,
        )

        if not search_results:
            return self._build_insufficient_evidence_response(
                request_id, category_enum, request.question
            )

        # Check if clarification is needed
        needs_clarification, clarifying_questions = self._check_clarification_needed(
            request.question, category, formatted_context, request.context
        )

        # Build citations
        citations = self.citation_service.build_citations(search_results)

        if needs_clarification:
            return self._build_clarification_response(
                request_id, category_enum, clarifying_questions, citations
            )

        # Generate answer
        answer = self._generate_answer(
            question=request.question,
            category=category,
            context=formatted_context,
            user_context=request.context,
        )

        # Build citations
        citations = self.citation_service.build_citations(search_results)

        # Parse answer components
        summary = self._extract_summary(answer)
        legal_info = self._extract_legal_information(answer)
        next_steps = self._extract_next_steps(answer)
        evidence_to_preserve = self._extract_evidence(answer, category)
        limitations = self._extract_limitations(answer)

        # Determine confidence
        confidence = self._assess_confidence(search_results, answer)

        return LegalAnalysisResponse(
            request_id=request_id,
            status=AnalysisStatus.ANSWERED,
            jurisdiction=f"{request.city}, {request.province}, {request.country}",
            category=category_enum,
            summary=summary,
            legal_information=legal_info,
            citations=citations,
            next_steps=next_steps,
            evidence_to_preserve=evidence_to_preserve,
            follow_up_questions=[],
            limitations=limitations,
            confidence=confidence,
        )

    def _is_supported_jurisdiction(self, country: str, city: str, province: str) -> bool:
        """Check if jurisdiction is supported."""
        return (
            country.lower() in ["pakistan", "pk"]
            and city.lower() in ["karachi", "khi"]
            and province.lower() in ["sindh"]
        )

    def _check_clarification_needed(
        self, question: str, category: str, context: str, user_context: Optional[str] = None
    ) -> tuple[bool, list[str]]:
        """Check if clarification questions are needed."""
        user_info = f"\nUser Provided Context / Clarifications: {user_context}" if user_context else ""
        # Build clarification prompt
        prompt = f"""Based on this legal question and any provided context in category '{category}', determine if we need more information or if we can proceed with a legal explanation.

Question: {question}{user_info}

Available legal context: {context[:500]}...

Should we ask clarifying questions? Consider:
- For unpaid_salary: employment type, contract details, dates, evidence
- For workplace_harassment: when/where, employer size, prior complaints, safety
- For tenant_landlord: property type, written agreement, specific dispute, dates

If the user has already provided clarifications or sufficient details, respond with "NO".
Respond with:
"NO" if the question and details are clear enough to answer
OR
"YES" followed by 2-3 specific clarifying questions, one per line starting with "-"
"""

        try:
            messages = [
                {"role": "system", "content": "You are a legal assistant analyzing if clarification is needed."},
                {"role": "user", "content": prompt}
            ]

            response = self.groq_service.generate_completion(messages, temperature=0.2, max_tokens=300)

            if response.strip().upper().startswith("NO"):
                return False, []

            if response.strip().upper().startswith("YES"):
                lines = response.split("\n")
                questions = [line.strip("- ").strip() for line in lines[1:] if line.strip().startswith("-")]
                if questions:
                    return True, questions[:3]

        except Exception as e:
            logger.warning(f"Clarification check failed: {e}")

        return False, []

    def _generate_answer(
        self, question: str, category: str, context: str, user_context: Optional[str]
    ) -> str:
        """Generate answer using Groq."""
        # Detect language
        language = self.language_service.detect_language(question)
        language_suffix = self.language_service.get_system_message_suffix(language)

        system_prompt = f"""You are a legal information assistant for LegalSaathi AI, focused on {category} issues in Karachi, Sindh, Pakistan.

CRITICAL RULES:
1. Base your response ONLY on the provided legal sources
2. NEVER invent laws, sections, deadlines, or procedures not in the sources
3. When citing a law or provision, include the exact section/article number and page number from the sources
4. Clearly distinguish what the sources say vs. general explanation
5. Note when federal law may apply alongside provincial law
6. Be sensitive and respectful, especially for harassment cases
7. Do not blame or pressure the person asking
8. Provide practical next steps when supported by sources
9. Complete your response fully - do not truncate or cut off mid-sentence
10. When mentioning a legal provision, always cite: [Act Name, Section X, Page Y]

Structure your response with:
- Brief summary (2-3 sentences)
- Legal information from sources (with complete citations including section numbers and page numbers)
- Practical next steps
- What evidence to preserve
- Important limitations or caveats{language_suffix}"""

        user_prompt = f"""Question: {question}

{f"User Context: {user_context}" if user_context else ""}

Legal Sources:
{context}

Provide a clear, accurate, and COMPLETE response based on these sources. Include specific section numbers and page numbers in your citations."""

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]

        # Use max_tokens=800 to stay within Groq free-tier OTPM limits (1000)
        return self.groq_service.generate_completion(messages, temperature=0.3, max_tokens=800)

    def _extract_summary(self, answer: str) -> str:
        """Extract summary from answer."""
        lines = answer.split("\n")
        for i, line in enumerate(lines):
            if "summary" in line.lower() and i + 1 < len(lines):
                # Get next few non-empty lines
                summary_lines = []
                for j in range(i + 1, min(i + 5, len(lines))):
                    if lines[j].strip() and not any(
                        keyword in lines[j].lower()
                        for keyword in ["legal", "next step", "evidence", "limitation"]
                    ):
                        summary_lines.append(lines[j].strip())
                if summary_lines:
                    return " ".join(summary_lines)

        # Fallback: use first paragraph
        paragraphs = answer.split("\n\n")
        return paragraphs[0] if paragraphs else answer[:200]

    def _extract_legal_information(self, answer: str) -> str:
        """Extract legal information section."""
        # Return full answer as legal information
        return answer

    def _extract_next_steps(self, answer: str) -> list[str]:
        """Extract next steps from answer."""
        next_steps = []
        lines = answer.split("\n")

        capture = False
        for line in lines:
            if "next step" in line.lower() or "you can" in line.lower() or "should" in line.lower():
                capture = True
                continue

            if capture:
                if line.strip().startswith(("-", "•", "1.", "2.", "3.")):
                    step = line.strip().lstrip("-•123456789. ")
                    if step:
                        next_steps.append(step)
                elif line.strip() and not line[0].isdigit() and ":" in line:
                    capture = False

        return next_steps[:5] if next_steps else ["Consult with a qualified lawyer for specific advice"]

    def _extract_evidence(self, answer: str, category: str) -> list[str]:
        """Extract evidence to preserve."""
        evidence = []

        if category == "unpaid_salary":
            evidence = [
                "Employment contract or appointment letter",
                "Salary slips and bank statements",
                "Written communications about salary",
                "Timesheets or attendance records",
                "Any termination or suspension letters",
            ]
        elif category == "workplace_harassment":
            evidence = [
                "Written record of incidents with dates and times",
                "Any written complaints filed",
                "Relevant emails, messages, or communications",
                "Names of witnesses",
                "Medical records if applicable",
                "Any responses from employer or inquiry committee",
            ]
        elif category == "tenant_landlord":
            evidence = [
                "Rental agreement or lease document",
                "Rent payment receipts",
                "Security deposit receipts",
                "Written notices (sent and received)",
                "Communications with landlord/tenant",
                "Photos of property condition if relevant",
            ]

        return evidence

    def _extract_limitations(self, answer: str) -> list[str]:
        """Extract limitations from answer."""
        limitations = [
            "This information is based on available legal sources and may not reflect recent amendments",
            "Legal procedures and applicable law may depend on specific factual circumstances",
            "Some matters may be governed by federal law in addition to or instead of provincial law",
        ]

        # Check if answer mentions uncertainty
        if any(word in answer.lower() for word in ["may", "might", "unclear", "depends", "uncertain"]):
            limitations.append("Some aspects of your situation require verification of current law and practice")

        return limitations

    def _assess_confidence(self, results: list, answer: str) -> Confidence:
        """Assess confidence level."""
        if len(results) >= 3:
            return Confidence.HIGH
        elif len(results) >= 1:
            return Confidence.MEDIUM
        else:
            return Confidence.LOW

    def _build_unsupported_topic_response(self, request_id: str) -> LegalAnalysisResponse:
        """Build response for unsupported topic."""
        return LegalAnalysisResponse(
            request_id=request_id,
            status=AnalysisStatus.UNSUPPORTED_TOPIC,
            jurisdiction="Karachi, Sindh, Pakistan",
            category=None,
            summary="This question is outside LegalSaathi AI's current scope.",
            legal_information=(
                "LegalSaathi AI currently provides information only about:\n"
                "1. Unpaid salary and employment disputes\n"
                "2. Workplace harassment\n"
                "3. Tenant and landlord disputes\n\n"
                "All within Karachi, Sindh, Pakistan."
            ),
            limitations=[
                "We can only assist with the three supported legal categories in Karachi, Sindh",
                "For other legal matters, please consult a qualified lawyer",
            ],
        )

    def _build_out_of_scope_response(self, request_id: str) -> LegalAnalysisResponse:
        """Build response for out-of-jurisdiction question."""
        return LegalAnalysisResponse(
            request_id=request_id,
            status=AnalysisStatus.OUTSIDE_SUPPORTED_JURISDICTION,
            jurisdiction="Outside supported area",
            category=None,
            summary="This question is outside LegalSaathi AI's geographic scope.",
            legal_information=(
                "LegalSaathi AI provides legal information specifically for Karachi, Sindh, Pakistan. "
                "Legal frameworks, procedures, and protections vary by location. "
                "For matters in other cities or provinces, please consult local legal resources or a qualified lawyer in that jurisdiction."
            ),
            limitations=[
                "Our knowledge base covers Karachi, Sindh, Pakistan only",
                "Laws and procedures differ across provinces and cities",
            ],
        )

    def _build_insufficient_evidence_response(
        self, request_id: str, category: LegalCategory, question: str
    ) -> LegalAnalysisResponse:
        """Build response when evidence is insufficient."""
        return LegalAnalysisResponse(
            request_id=request_id,
            status=AnalysisStatus.INSUFFICIENT_EVIDENCE,
            jurisdiction="Karachi, Sindh, Pakistan",
            category=category,
            summary="We don't have sufficient information in our knowledge base to answer this question comprehensively.",
            legal_information=(
                f"While your question appears to be about {category.value.replace('_', ' ')}, "
                "our current knowledge base does not contain sufficient legal sources to provide a reliable answer. "
                "This may be because:\n"
                "- The specific legal provisions haven't been added yet\n"
                "- The question requires very specific statutory interpretation\n"
                "- Recent legal changes haven't been incorporated\n\n"
                "We recommend consulting with a qualified lawyer who can research the applicable law for your specific situation."
            ),
            next_steps=[
                "Consult with a lawyer specializing in this area",
                "Contact relevant government departments or legal aid organizations",
                "Preserve all relevant documentation",
            ],
            limitations=[
                "Our knowledge base is still being developed",
                "Some legal sources may not yet be available",
                "Specific legal questions may require expert legal research",
            ],
            confidence=Confidence.LOW,
        )

    def _build_clarification_response(
        self,
        request_id: str,
        category: LegalCategory,
        questions: list[str],
        citations: list = None,
    ) -> LegalAnalysisResponse:
        """Build response requesting clarification."""
        return LegalAnalysisResponse(
            request_id=request_id,
            status=AnalysisStatus.NEEDS_CLARIFICATION,
            jurisdiction="Karachi, Sindh, Pakistan",
            category=category,
            summary="We need some additional information to provide accurate guidance.",
            legal_information=(
                f"Your question relates to {category.value.replace('_', ' ')}. "
                "To provide the most accurate and relevant information, we need to understand your situation better."
            ),
            citations=citations or [],
            follow_up_questions=questions,
            limitations=[
                "More details will help us provide more specific guidance",
            ],
        )
