import { Link, useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/button'
import { FullPageError } from '@/shared/ui/error-page'

/**
 * Not a 404. The page exists and the operator is signed in — they simply lack
 * the permission, and need to know to ask for it rather than conclude the
 * screen is gone.
 *
 * The permission is named so it can be quoted in that request.
 */
export const NoAccessPage = () => {
  const { t } = useTranslation()
  const search = useSearch({ from: '/no-access' })

  return (
    <FullPageError
      code="403"
      title={t('errors.noAccessTitle')}
      description={t('errors.noAccessBody')}
      detail={search.permission}
      actions={
        <Button render={<Link to="/" />} variant="outline">
          {t('nav.dashboard')}
        </Button>
      }
    />
  )
}
