"""Regression tests for legal analysis across all categories and languages."""
import pytest

from app.schemas.legal import AnalysisStatus, LegalCategory


class TestUnpaidSalaryCategory:
    """Test unpaid salary and employment disputes category."""

    def test_unpaid_salary_basic_english(self, client):
        """Test basic unpaid salary question in English."""
        response = client.post(
            "/api/v1/legal/analyze",
            json={
                "question": "My employer has not paid my salary for 3 months. What can I do?",
                "category": "unpaid_salary",
                "city": "Karachi",
                "province": "Sindh",
                "country": "Pakistan",
            },
        )

        assert response.status_code == 200
        data = response.json()

        assert data["category"] == "unpaid_salary"
        assert data["jurisdiction"] == "Karachi, Sindh, Pakistan"
        assert data["status"] in ["answered", "needs_clarification"]

        # Verify citations are present
        if data["status"] == "answered":
            assert len(data["citations"]) > 0
            # Check that citations have required fields
            for citation in data["citations"]:
                assert citation["document_title"] is not None
                assert citation["page_number"] is not None
                # Section may be None for some chunks, but should exist for legal text
                assert "provision" in citation

    def test_unpaid_salary_detailed_english(self, client):
        """Test detailed unpaid salary question with context in English."""
        response = client.post(
            "/api/v1/legal/analyze",
            json={
                "question": (
                    "My employer, a private company in Karachi, has not paid my salary "
                    "for 3 months. I have a written employment contract and salary slips "
                    "showing the unpaid amounts. What legal remedies are available to me?"
                ),
                "category": "unpaid_salary",
                "city": "Karachi",
                "province": "Sindh",
                "country": "Pakistan",
                "context": (
                    "I am a formal employee with a written contract. The company has not "
                    "responded to my emails about the unpaid salary."
                ),
            },
        )

        assert response.status_code == 200
        data = response.json()

        assert data["category"] == "unpaid_salary"
        assert data["status"] in ["answered", "needs_clarification"]
        assert data["summary"] is not None
        assert data["legal_information"] is not None

        # Verify response is not truncated
        assert len(data["legal_information"]) > 100
        assert not data["legal_information"].endswith("...")

    def test_unpaid_salary_roman_urdu(self, client):
        """Test unpaid salary question in Roman Urdu."""
        response = client.post(
            "/api/v1/legal/analyze",
            json={
                "question": "Mera malik mujhe teen mahine se tankhwa nahi de raha. Main kya kar sakta hoon?",
                "category": "unpaid_salary",
                "city": "Karachi",
                "province": "Sindh",
                "country": "Pakistan",
            },
        )

        assert response.status_code == 200
        data = response.json()

        assert data["category"] == "unpaid_salary"
        assert data["status"] in ["answered", "needs_clarification"]
        assert len(data["citations"]) > 0

    def test_unpaid_salary_minimum_wage(self, client):
        """Test question about minimum wage requirements."""
        response = client.post(
            "/api/v1/legal/analyze",
            json={
                "question": "What is the minimum wage in Karachi for a factory worker?",
                "category": "unpaid_salary",
                "city": "Karachi",
                "province": "Sindh",
                "country": "Pakistan",
            },
        )

        assert response.status_code == 200
        data = response.json()

        assert data["category"] == "unpaid_salary"
        # Should find information about Sindh Minimum Wages Act
        if data["status"] == "answered":
            assert any("minimum wage" in citation["excerpt"].lower()
                      for citation in data["citations"])


class TestWorkplaceHarassmentCategory:
    """Test workplace harassment category."""

    def test_harassment_basic_english(self, client):
        """Test basic harassment question in English."""
        response = client.post(
            "/api/v1/legal/analyze",
            json={
                "question": "I am facing harassment at my workplace. What should I do?",
                "category": "workplace_harassment",
                "city": "Karachi",
                "province": "Sindh",
                "country": "Pakistan",
            },
        )

        assert response.status_code == 200
        data = response.json()

        assert data["category"] == "workplace_harassment"
        assert data["status"] in ["answered", "needs_clarification"]
        assert len(data["citations"]) > 0

    def test_harassment_detailed_procedure(self, client):
        """Test question about harassment complaint procedure."""
        response = client.post(
            "/api/v1/legal/analyze",
            json={
                "question": (
                    "A female colleague is facing harassment from her supervisor. "
                    "What is the procedure to file a formal complaint under the law?"
                ),
                "category": "workplace_harassment",
                "city": "Karachi",
                "province": "Sindh",
                "country": "Pakistan",
                "context": "The company has more than 50 employees.",
            },
        )

        assert response.status_code == 200
        data = response.json()

        assert data["category"] == "workplace_harassment"

        # Should provide next steps
        if data["status"] == "answered":
            assert len(data["next_steps"]) > 0
            assert len(data["evidence_to_preserve"]) > 0

    def test_harassment_roman_urdu(self, client):
        """Test harassment question in Roman Urdu."""
        response = client.post(
            "/api/v1/legal/analyze",
            json={
                "question": "Meri colleague ko office mein bohot zulm ho raha hai. Woh kya kar sakti hai?",
                "category": "workplace_harassment",
                "city": "Karachi",
                "province": "Sindh",
                "country": "Pakistan",
            },
        )

        assert response.status_code == 200
        data = response.json()

        assert data["category"] == "workplace_harassment"
        assert data["status"] in ["answered", "needs_clarification"]

    def test_harassment_inquiry_committee(self, client):
        """Test question about inquiry committee."""
        response = client.post(
            "/api/v1/legal/analyze",
            json={
                "question": "What is an inquiry committee and how does it work in harassment cases?",
                "category": "workplace_harassment",
                "city": "Karachi",
                "province": "Sindh",
                "country": "Pakistan",
            },
        )

        assert response.status_code == 200
        data = response.json()

        assert data["category"] == "workplace_harassment"
        # Should retrieve information about inquiry committee from Protection Against Harassment Act
        if data["status"] == "answered":
            assert any("inquiry" in citation["excerpt"].lower() or "committee" in citation["excerpt"].lower()
                      for citation in data["citations"])


class TestTenantLandlordCategory:
    """Test tenant and landlord disputes category."""

    def test_tenant_basic_english(self, client):
        """Test basic tenant question in English."""
        response = client.post(
            "/api/v1/legal/analyze",
            json={
                "question": "My landlord wants to evict me. What are my rights?",
                "category": "tenant_landlord",
                "city": "Karachi",
                "province": "Sindh",
                "country": "Pakistan",
            },
        )

        assert response.status_code == 200
        data = response.json()

        assert data["category"] == "tenant_landlord"
        assert data["status"] in ["answered", "needs_clarification"]
        assert len(data["citations"]) > 0

    def test_tenant_rent_increase(self, client):
        """Test question about rent increase."""
        response = client.post(
            "/api/v1/legal/analyze",
            json={
                "question": (
                    "My landlord suddenly increased the rent by 50% without notice. "
                    "Is this legal?"
                ),
                "category": "tenant_landlord",
                "city": "Karachi",
                "province": "Sindh",
                "country": "Pakistan",
            },
        )

        assert response.status_code == 200
        data = response.json()

        assert data["category"] == "tenant_landlord"
        # Should find relevant information from Sindh Rented Premises Ordinance
        if data["status"] == "answered":
            assert len(data["citations"]) > 0

    def test_tenant_roman_urdu(self, client):
        """Test tenant question in Roman Urdu."""
        response = client.post(
            "/api/v1/legal/analyze",
            json={
                "question": "Mera makaan malik mujhe ghar se nikalna chahta hai. Mera kya haq hai?",
                "category": "tenant_landlord",
                "city": "Karachi",
                "province": "Sindh",
                "country": "Pakistan",
            },
        )

        assert response.status_code == 200
        data = response.json()

        assert data["category"] == "tenant_landlord"
        assert data["status"] in ["answered", "needs_clarification"]

    def test_tenant_eviction_procedure(self, client):
        """Test question about eviction procedure."""
        response = client.post(
            "/api/v1/legal/analyze",
            json={
                "question": "What is the legal procedure for eviction in Karachi?",
                "category": "tenant_landlord",
                "city": "Karachi",
                "province": "Sindh",
                "country": "Pakistan",
            },
        )

        assert response.status_code == 200
        data = response.json()

        assert data["category"] == "tenant_landlord"
        if data["status"] == "answered":
            assert data["legal_information"] is not None
            assert len(data["legal_information"]) > 100


class TestCitationQuality:
    """Test citation quality and accuracy."""

    def test_citations_have_page_numbers(self, client):
        """Test that citations include page numbers."""
        response = client.post(
            "/api/v1/legal/analyze",
            json={
                "question": "What are the penalties for not paying wages on time?",
                "category": "unpaid_salary",
                "city": "Karachi",
                "province": "Sindh",
                "country": "Pakistan",
            },
        )

        assert response.status_code == 200
        data = response.json()

        if data["status"] == "answered" and len(data["citations"]) > 0:
            for citation in data["citations"]:
                assert citation["page_number"] is not None
                assert isinstance(citation["page_number"], int)
                assert citation["page_number"] > 0

    def test_citations_have_document_titles(self, client):
        """Test that citations include document titles."""
        response = client.post(
            "/api/v1/legal/analyze",
            json={
                "question": "What are my rights regarding workplace harassment?",
                "category": "workplace_harassment",
                "city": "Karachi",
                "province": "Sindh",
                "country": "Pakistan",
            },
        )

        assert response.status_code == 200
        data = response.json()

        if data["status"] == "answered" and len(data["citations"]) > 0:
            for citation in data["citations"]:
                assert citation["document_title"] is not None
                assert len(citation["document_title"]) > 0
                # Should be actual legal document names
                assert any(keyword in citation["document_title"].lower()
                          for keyword in ["act", "ordinance", "law", "sindh"])

    def test_citations_include_excerpts(self, client):
        """Test that citations include text excerpts."""
        response = client.post(
            "/api/v1/legal/analyze",
            json={
                "question": "Can my landlord evict me without notice?",
                "category": "tenant_landlord",
                "city": "Karachi",
                "province": "Sindh",
                "country": "Pakistan",
            },
        )

        assert response.status_code == 200
        data = response.json()

        if data["status"] == "answered" and len(data["citations"]) > 0:
            for citation in data["citations"]:
                assert citation["excerpt"] is not None
                assert len(citation["excerpt"]) > 0


class TestResponseCompleteness:
    """Test that responses are complete and not truncated."""

    def test_response_not_truncated(self, client):
        """Test that responses are complete."""
        response = client.post(
            "/api/v1/legal/analyze",
            json={
                "question": (
                    "Please explain in detail the complete procedure for filing a harassment "
                    "complaint, what happens during the inquiry, what are the timelines, "
                    "and what remedies are available."
                ),
                "category": "workplace_harassment",
                "city": "Karachi",
                "province": "Sindh",
                "country": "Pakistan",
            },
        )

        assert response.status_code == 200
        data = response.json()

        if data["status"] == "answered":
            # Response should be substantial
            assert len(data["legal_information"]) > 500
            # Should not end with ellipsis or incomplete sentence
            assert not data["legal_information"].endswith("...")
            assert not data["legal_information"].endswith(" and")
            assert not data["legal_information"].endswith(" or")


class TestJurisdictionValidation:
    """Test jurisdiction validation."""

    def test_outside_karachi_rejected(self, client):
        """Test that questions outside Karachi are rejected."""
        response = client.post(
            "/api/v1/legal/analyze",
            json={
                "question": "What are my tenant rights?",
                "category": "tenant_landlord",
                "city": "Lahore",
                "province": "Punjab",
                "country": "Pakistan",
            },
        )

        assert response.status_code == 200
        data = response.json()

        assert data["status"] == "outside_supported_jurisdiction"

    def test_outside_pakistan_rejected(self, client):
        """Test that questions outside Pakistan are rejected."""
        response = client.post(
            "/api/v1/legal/analyze",
            json={
                "question": "What are my employee rights?",
                "category": "unpaid_salary",
                "city": "Dubai",
                "province": "Dubai",
                "country": "UAE",
            },
        )

        assert response.status_code == 200
        data = response.json()

        assert data["status"] == "outside_supported_jurisdiction"
