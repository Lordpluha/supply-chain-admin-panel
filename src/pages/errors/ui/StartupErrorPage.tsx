import { Button } from '@/shared/ui/button'
import { FullPageError } from '@/shared/ui/error-page'

export interface StartupErrorPageProps {
  /** `unknown`, because anything can be thrown — not only an `Error`. */
  error: unknown
}

/**
 * The app could not start.
 *
 * Reached when `bootstrap()` rejects — i18n failed to initialise, or the mock
 * service worker failed to register. Without this the gate in `AppProviders`
 * simply never opens and the operator gets a permanently blank page with
 * nothing to act on.
 *
 * **This is the one screen in the panel whose copy is not translated**, and
 * deliberately so: `initI18n()` is one of the two things that may have failed,
 * so calling `t()` here would either render raw keys or throw a second error on
 * top of the first. English is the source locale and the honest fallback. It is
 * recorded as an exception in `.claude/rules/i18n.md`.
 *
 * The most likely cause in this prototype is the service worker: it needs a
 * secure context, so `localhost` or HTTPS, and it cannot register from a
 * `file://` URL. That is worth saying rather than leaving to be guessed.
 */
export const StartupErrorPage = ({ error }: StartupErrorPageProps) => (
  <FullPageError
    // `offline` rather than `500`: nothing crashed, the API simply is not
    // there — which is what the unplugged glyph says and a warning triangle
    // does not.
    code="offline"
    title="The panel could not start"
    description="Its mock API runs in a service worker, which needs a secure context — localhost or HTTPS. Reloading often clears a failed registration."
    detail={
      import.meta.env.DEV ? (error instanceof Error ? error.message : String(error)) : undefined
    }
    actions={<Button onClick={() => globalThis.location.reload()}>Reload the page</Button>}
  />
)
