import { LegalJurisdiction } from './evidence';

export interface User {
  id: string;
  email: string;
  name: string;
  preferredJurisdiction: LegalJurisdiction;
  role?: 'citizen' | 'legal_professional' | 'student';
  createdAt: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  token?: string; // Optional Bearer token if backend uses JWT rather than HttpOnly cookies
  message?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  preferredJurisdiction?: LegalJurisdiction;
  acceptedTerms: boolean;
}

export interface UpdateProfileInput {
  name?: string;
  preferredJurisdiction?: LegalJurisdiction;
}
