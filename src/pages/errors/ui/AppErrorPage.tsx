import { useRouter } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ApiError } from '@/shared/api'
import { errorDetail, errorMessageKey } from '@/shared/lib/errors'
import { Button } from '@/shared/ui/button'
import { ErrorPage, FullPageError } from '@/shared/ui/error-page'

export interface AppErrorPageProps {
  /** `unknown`, because anything can be thrown — not only an `Error`. */
  error: unknown
  /** Supplied by TanStack Router: clears the boundary so a retry can re-render. */
  reset?: () => void
  /** `false` inside the panel, where the shell already fills the viewport. */
  standalone?: boolean
}

const messageOf = (error: unknown): string =>
  error instanceof Error ? error.message : String(error)

/**
 * A route threw — in its loader or in its render.
 *
 * A loader that failed on a request describes itself through `errorMessageKey`,
 * the same mapping the toasts use, so "that record no longer exists" beats the
 * generic crash copy where the server actually said which. Anything else is a
 * genuine fault and gets the generic wording.
 *
 * "Try again" resets the boundary **and** invalidates the router, so a failure
 * caused by a request that has since recovered actually re-runs rather than
 * re-rendering the same broken state. Reloading is the second offer, for the
 * case where the app's own state is what is wrong.
 *
 * The thrown message is shown only in development. A stack trace on a
 * production screen tells the operator nothing they can act on, and tells
 * everyone else more about the application than they need.
 */
export const AppErrorPage = ({ error, reset, standalone = false }: AppErrorPageProps) => {
  const { t } = useTranslation()
  const router = useRouter()

  const retry = () => {
    reset?.()
    void router.invalidate()
  }

  const description =
    error instanceof ApiError ? t(errorMessageKey(error)) : t('errors.appErrorBody')

  // The server's own sentence when it wrote one; otherwise the thrown message,
  // and only in development. The check is kept literal so Vite replaces it and
  // drops the branch from the production bundle.
  const detail = errorDetail(error) ?? (import.meta.env.DEV ? messageOf(error) : null)

  const Layout = standalone ? FullPageError : ErrorPage

  return (
    <Layout
      code="500"
      title={t('errors.appErrorTitle')}
      description={description}
      detail={
        detail ? (
          <>
            <span className="sr-only">{t('errors.detailsLabel')}: </span>
            {detail}
          </>
        ) : undefined
      }
      actions={
        <>
          <Button onClick={retry}>{t('common.retry')}</Button>
          <Button variant="outline" onClick={() => globalThis.location.reload()}>
            {t('errors.reload')}
          </Button>
        </>
      }
    />
  )
}
