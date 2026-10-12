export const env = {
  apiBaseUrl: import.meta.env.VITE_API_URL ?? '/api',
  /** Mocks stay on unless a real backend URL is wired in. */
  enableMocks: import.meta.env.VITE_ENABLE_MOCKS !== 'false',
} as const
