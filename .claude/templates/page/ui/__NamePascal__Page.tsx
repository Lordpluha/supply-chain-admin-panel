import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/widgets/page-header'

/**
 * Pages compose widgets for one route and hold no business logic of their own.
 */
export const __NamePascal__Page = () => {
  const { t } = useTranslation()

  return (
    <>
      <PageHeader title={t('__NameCamel__.title')} description={t('__NameCamel__.description')} />
    </>
  )
}
