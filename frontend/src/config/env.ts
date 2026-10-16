/**
 * Centralized, typed environment configuration.
 * Exposes type-safe access to Vite environment variables with sensible defaults.
 * Never store secrets, private API keys, or backend credentials here.
 */

export interface EnvConfig {
  apiBaseUrl: string;
  appName: string;
  appDescription: string;
  isMockEnabled: boolean;
  timeoutMs: number;
  isDev: boolean;
  isProd: boolean;
}

export const env: EnvConfig = {
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:8000/api/v1',
  appName: (import.meta.env.VITE_APP_NAME as string) || 'Pakistan Legal Rights Agent',
  appDescription:
    (import.meta.env.VITE_APP_DESCRIPTION as string) ||
    'AI-Powered Pakistan Legal Information Assistant',
  isMockEnabled:
    import.meta.env.VITE_ENABLE_MOCK_API === undefined
      ? true
      : import.meta.env.VITE_ENABLE_MOCK_API === 'true' || import.meta.env.VITE_ENABLE_MOCK_API === true,
  timeoutMs: Number(import.meta.env.VITE_API_TIMEOUT_MS) || 15000,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
};
