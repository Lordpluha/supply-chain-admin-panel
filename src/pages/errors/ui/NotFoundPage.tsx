import { Link, useRouterState } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/button'
import { ErrorPage, FullPageError } from '@/shared/ui/error-page'

export interface NotFoundPageProps {
  /** `false` inside the panel, where the shell already fills the viewport. */
  standalone?: boolean
}

/**
 * No route matched.
 *
 * The path that missed is shown, because the usual cause is a stale link
 * someone was sent — and being able to quote it is the difference between
 * "it's broken" and a fixable report.
 */
export const NotFoundPage = ({ standalone = false }: NotFoundPageProps) => {
  const { t } = useTranslation()
  const path = useRouterState({ select: state => state.location.pathname })

  const Layout = standalone ? FullPageError : ErrorPage

  return (
    <Layout
      code="404"
      title={t('errors.pageNotFoundTitle')}
      description={t('errors.pageNotFoundBody')}
      detail={
        <>
          <span className="sr-only">{t('errors.pathLabel')}: </span>
          {path}
        </>
      }
      actions={
        <Button render={<Link to="/" />} variant="outline">
          {t('nav.dashboard')}
        </Button>
      }
    />
  )
}
