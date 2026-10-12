import { env } from '@/shared/config/env'

/**
 * Starts the mock API. Awaited before the app renders so the very first query
 * already has an interceptor in place, which otherwise races on a cold load.
 */
export const enableMocking = async (): Promise<void> => {
  if (!env.enableMocks || typeof window === 'undefined') return

  const { worker } = await import('./browser')

  await worker.start({
    // The app owns every request it makes; anything else is Vite's own traffic.
    onUnhandledRequest: 'bypass',
    serviceWorker: { url: '/mockServiceWorker.js' },
    quiet: true,
  })
}
