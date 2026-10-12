import { initI18n } from '@/shared/i18n'
import { enableMocking } from './mocks'

let started: Promise<void> | null = null

/**
 * Everything that must finish before the first route renders or the first
 * query fires:
 *
 * - **i18n**, or a component calling `useTranslation()` has no instance and
 *   renders raw keys;
 * - **the mock API**, or the first request escapes the service worker and hits
 *   the network, where nothing is listening.
 *
 * Memoised, so a re-render never starts a second worker.
 *
 * Deliberately **not** wired into a route's `beforeLoad`: that runs during the
 * server shell pass, where `enableMocking` correctly no-ops for want of a
 * `window` — and the client then never re-runs it, so the worker never
 * registers and every request escapes to the network. `AppProviders` gates on
 * this instead, from an effect, which only ever runs in the browser.
 */
export const bootstrap = (): Promise<void> => {
  started ??= (async () => {
    await initI18n()
    await enableMocking()
  })()

  return started
}
