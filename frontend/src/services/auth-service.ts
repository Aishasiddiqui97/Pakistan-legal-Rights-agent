import { env } from '@/config/env';
import { apiClient, setAuthToken } from './api-client';
import { API_ENDPOINTS } from './endpoints';
import {
  User,
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  UpdateProfileInput,
} from '@/types/auth';

export interface IAuthService {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  register(credentials: RegisterCredentials): Promise<AuthResponse>;
  getCurrentUser(): Promise<User>;
  updateProfile(data: UpdateProfileInput): Promise<User>;
  logout(): Promise<void>;
}

// In-memory or session storage mock user for development
const MOCK_STORAGE_KEY = 'plr_mock_user';

function getStoredMockUser(): User | null {
  try {
    const raw = sessionStorage.getItem(MOCK_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setStoredMockUser(user: User | null) {
  try {
    if (user) {
      sessionStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(user));
    } else {
      sessionStorage.removeItem(MOCK_STORAGE_KEY);
    }
  } catch {}
}

/**
 * Mock Auth Service: Provides high-fidelity authentication for standalone dev and demo mode.
 */
class MockAuthService implements IAuthService {
  private defaultUser: User = {
    id: 'user-sindh-001',
    name: 'Aisha Siddiqui',
    email: 'aisha@example.com',
    preferredJurisdiction: 'sindh',
    role: 'citizen',
    createdAt: '2026-01-15T10:00:00.000Z',
  };

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Artificial small delay for realism
    await new Promise((r) => setTimeout(r, 400));

    // Allow mock sign in with valid format
    const user: User = {
      id: 'user-sindh-' + Math.floor(Math.random() * 1000),
      name: credentials.email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      email: credentials.email,
      preferredJurisdiction: 'sindh',
      role: 'citizen',
      createdAt: new Date().toISOString(),
    };

    setStoredMockUser(user);
    setAuthToken('mock-jwt-token-sindh-law');

    return {
      user,
      token: 'mock-jwt-token-sindh-law',
      message: 'Successfully signed in (Dev Mock Mode)',
    };
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    await new Promise((r) => setTimeout(r, 500));

    const user: User = {
      id: 'user-sindh-' + Math.floor(Math.random() * 1000),
      name: credentials.name,
      email: credentials.email,
      preferredJurisdiction: credentials.preferredJurisdiction || 'sindh',
      role: 'citizen',
      createdAt: new Date().toISOString(),
    };

    setStoredMockUser(user);
    setAuthToken('mock-jwt-token-sindh-law');

    return {
      user,
      token: 'mock-jwt-token-sindh-law',
      message: 'Account created successfully (Dev Mock Mode)',
    };
  }

  async getCurrentUser(): Promise<User> {
    const stored = getStoredMockUser();
    if (stored) return stored;
    throw new Error('No active authenticated session');
  }

  async updateProfile(data: UpdateProfileInput): Promise<User> {
    const current = await this.getCurrentUser();
    const updated: User = {
      ...current,
      ...(data.name ? { name: data.name } : {}),
      ...(data.preferredJurisdiction ? { preferredJurisdiction: data.preferredJurisdiction } : {}),
      updatedAt: new Date().toISOString(),
    };
    setStoredMockUser(updated);
    return updated;
  }

  async logout(): Promise<void> {
    setStoredMockUser(null);
    setAuthToken(null);
  }
}

/**
 * Real API Auth Service: Communicates with FastAPI backend endpoints.
 */
class RealAuthService implements IAuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const res = await apiClient<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (res.token) {
      setAuthToken(res.token);
    }
    return res;
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const res = await apiClient<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (res.token) {
      setAuthToken(res.token);
    }
    return res;
  }

  async getCurrentUser(): Promise<User> {
    return apiClient<User>(API_ENDPOINTS.AUTH.ME, {
      method: 'GET',
    });
  }

  async updateProfile(data: UpdateProfileInput): Promise<User> {
    return apiClient<User>(API_ENDPOINTS.USER.UPDATE, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<void> {
    try {
      await apiClient<void>(API_ENDPOINTS.AUTH.LOGOUT, {
        method: 'POST',
      });
    } finally {
      setAuthToken(null);
    }
  }
}

// Export singleton instance based on configuration
export const authService: IAuthService = env.isMockEnabled
  ? new MockAuthService()
  : new RealAuthService();
