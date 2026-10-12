import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'

export interface DeleteDialogProps {
  /** The row's human label — never just "this item". */
  label: string | null
  isPending: boolean
  onConfirm: () => void
  onCancel: () => void
}

export const DeleteDialog = ({ label, isPending, onConfirm, onCancel }: DeleteDialogProps) => {
  const { t } = useTranslation()

  return (
    <Dialog open={label !== null} onOpenChange={open => !open && onCancel()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{t('deleteDialog.title')}</DialogTitle>
          <DialogDescription>{t('deleteDialog.body')}</DialogDescription>
        </DialogHeader>

        <p className="typo-body-sm border-border bg-muted rounded-md border px-3 py-2">{label}</p>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={isPending}>
            {t('common.cancel')}
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isPending}>
            {isPending ? t('common.saving') : t('common.delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
