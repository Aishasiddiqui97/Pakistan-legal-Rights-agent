"""Integration tests for authentication endpoints (signup, login, me)."""
import pytest
from fastapi.testclient import TestClient


def test_signup_success(client: TestClient):
    """Test successful user registration endpoint."""
    payload = {
        "email": "newuser@example.com",
        "password": "Password123!",
        "full_name": "New User",
    }
    response = client.post("/api/v1/auth/signup", json=payload)
    assert response.status_code == 201

    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "newuser@example.com"
    assert data["user"]["full_name"] == "New User"
    assert data["user"]["is_active"] is True
    assert "id" in data["user"]


def test_signup_duplicate_email(client: TestClient):
    """Test duplicate registration fails with 400 Bad Request."""
    payload = {
        "email": "existing@example.com",
        "password": "Password123!",
        "full_name": "Existing User",
    }
    first_resp = client.post("/api/v1/auth/signup", json=payload)
    assert first_resp.status_code == 201

    # Second signup with same email
    dup_resp = client.post("/api/v1/auth/signup", json=payload)
    assert dup_resp.status_code == 400
    assert "already exists" in dup_resp.json()["detail"]


def test_login_success(client: TestClient):
    """Test login with valid credentials returns token."""
    signup_payload = {
        "email": "loginuser@example.com",
        "password": "CorrectPassword123",
        "full_name": "Login User",
    }
    client.post("/api/v1/auth/signup", json=signup_payload)

    login_payload = {
        "email": "loginuser@example.com",
        "password": "CorrectPassword123",
    }
    response = client.post("/api/v1/auth/login", json=login_payload)
    assert response.status_code == 200

    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "loginuser@example.com"


def test_login_wrong_password(client: TestClient):
    """Test login with incorrect password returns 401 Unauthorized."""
    signup_payload = {
        "email": "wrongpass@example.com",
        "password": "CorrectPassword123",
        "full_name": "Wrong Pass User",
    }
    client.post("/api/v1/auth/signup", json=signup_payload)

    response = client.post(
        "/api/v1/auth/login",
        json={"email": "wrongpass@example.com", "password": "WrongPassword"},
    )
    assert response.status_code == 401
    assert "Incorrect email or password" in response.json()["detail"]


def test_login_nonexistent_user(client: TestClient):
    """Test login with unregistered email returns 401 Unauthorized."""
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "nonexistent@example.com", "password": "AnyPassword"},
    )
    assert response.status_code == 401


def test_me_endpoint_authenticated(client: TestClient):
    """Test /me endpoint with valid Bearer token."""
    signup_payload = {
        "email": "me_user@example.com",
        "password": "Password123!",
        "full_name": "Me User",
    }
    signup_resp = client.post("/api/v1/auth/signup", json=signup_payload)
    token = signup_resp.json()["access_token"]

    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "me_user@example.com"
    assert data["full_name"] == "Me User"


def test_me_endpoint_unauthenticated(client: TestClient):
    """Test /me endpoint without token returns 401 Unauthorized."""
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401
