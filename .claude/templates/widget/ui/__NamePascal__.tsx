import { useTranslation } from 'react-i18next'

export interface __NamePascal__Props {
  className?: string
}

export const __NamePascal__ = ({ className }: __NamePascal__Props) => {
  const { t } = useTranslation()

  return <section className={className}>{t('common.loading')}</section>
}
