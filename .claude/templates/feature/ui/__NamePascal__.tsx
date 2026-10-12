import { useTranslation } from 'react-i18next'
import type { __NamePascal__Props } from '../model/__NameCamel__.types'

export const __NamePascal__ = ({}: __NamePascal__Props) => {
  const { t } = useTranslation()

  return <div>{t('common.loading')}</div>
}
