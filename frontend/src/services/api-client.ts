import { env } from '@/config/env';

export class ApiError extends Error {
  public statusCode: number;
  public details: any;

  constructor(message: string, statusCode: number, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

// In-memory token storage to avoid insecure localStorage defaults
let inMemoryAuthToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  inMemoryAuthToken = token;
  if (token) {
    sessionStorage.setItem('plr_session_active', '1');
  } else {
    sessionStorage.removeItem('plr_session_active');
  }
};

export const getAuthToken = (): string | null => {
  return inMemoryAuthToken;
};

interface RequestOptions extends RequestInit {
  timeoutMs?: number;
}

/**
 * Robust typed HTTP client for FastAPI backend.
 */
export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { timeoutMs = env.timeoutMs, headers, ...customConfig } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const url = endpoint.startsWith('http')
    ? endpoint
    : `${env.apiBaseUrl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

  const requestHeaders = new Headers(headers);

  // Set default Content-Type for JSON payloads if not already present
  if (!requestHeaders.has('Content-Type') && !(customConfig.body instanceof FormData)) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  // Attach Bearer token if available in memory
  if (inMemoryAuthToken && !requestHeaders.has('Authorization')) {
    requestHeaders.set('Authorization', `Bearer ${inMemoryAuthToken}`);
  }

  // Include credentials for HttpOnly cookies
  const config: RequestInit = {
    ...customConfig,
    headers: requestHeaders,
    signal: controller.signal,
    credentials: 'include',
  };

  try {
    const response = await fetch(url, config);
    clearTimeout(timeoutId);

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const errorMessage =
        (typeof data === 'object' && (data.detail || data.message)) ||
        response.statusText ||
        'Server request failed';

      throw new ApiError(
        typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage),
        response.status,
        data
      );
    }

    return data as T;
  } catch (err: any) {
    clearTimeout(timeoutId);

    if (err.name === 'AbortError') {
      throw new ApiError(
        'Request timed out. The legal reasoning server took too long to respond.',
        408
      );
    }

    if (err instanceof ApiError) {
      throw err;
    }

    throw new ApiError(
      err.message || 'Unable to connect to legal service backend',
      0,
      err
    );
  }
}
