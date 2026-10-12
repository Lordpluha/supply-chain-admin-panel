import { useTranslation } from 'react-i18next'
import { Button } from '../button'

export interface FormActionsProps {
  isPending: boolean
  onCancel: () => void
}

/** The same two buttons every entity dialog ends with. */
export const FormActions = ({ isPending, onCancel }: FormActionsProps) => {
  const { t } = useTranslation()

  return (
    <div className="flex justify-end gap-2 pt-2">
      <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
        {t('common.cancel')}
      </Button>
      <Button type="submit" disabled={isPending}>
        {isPending ? t('common.saving') : t('common.save')}
      </Button>
    </div>
  )
}
