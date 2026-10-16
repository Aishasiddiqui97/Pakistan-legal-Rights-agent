/**
 * Centralized API endpoint constants for FastAPI backend integration.
 * Matches the agreed integration contract documented in docs/API_CONTRACT.md.
 */

export const API_ENDPOINTS = {
  // Authentication & Session
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },

  // User Profile
  USER: {
    PROFILE: '/users/me',
    UPDATE: '/users/me',
  },

  // Legal Conversations & History
  CONVERSATIONS: {
    LIST: '/conversations',
    CREATE: '/conversations',
    DETAIL: (id: string) => `/conversations/${id}`,
    DELETE: (id: string) => `/conversations/${id}`,
    MESSAGES: (id: string) => `/conversations/${id}/messages`,
  },

  // Direct AI Legal Query (Optional standalone endpoint if no persistent conversation requested)
  ASSISTANT: {
    QUERY: '/assistant/query',
    CITATIONS: '/assistant/citations',
  },
} as const;
