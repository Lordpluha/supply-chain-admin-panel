import type { ParseKeys } from 'i18next'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog'
import type { EntityFormProps } from '../model/types'

export interface EntityFormDialogProps<TCreate> {
  open: boolean
  titleKey: ParseKeys
  defaultValues: Partial<TCreate>
  isPending: boolean
  onSubmit: (values: TCreate) => void
  onCancel: () => void
  Form: (props: EntityFormProps<TCreate>) => ReactNode
}

/**
 * Three responsibilities, three owners: the dialog holds open/closed state,
 * the form holds field state, the mutation holds submission. Create and edit
 * share one form — the difference is only the default values.
 */
export const EntityFormDialog = <TCreate,>({
  open,
  titleKey,
  defaultValues,
  isPending,
  onSubmit,
  onCancel,
  Form,
}: EntityFormDialogProps<TCreate>) => {
  const { t } = useTranslation()

  return (
    <Dialog open={open} onOpenChange={next => !next && onCancel()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t(titleKey)}</DialogTitle>
        </DialogHeader>

        {/* Remounted per open so stale values never leak into the next edit. */}
        {open ? (
          <Form
            defaultValues={defaultValues}
            isPending={isPending}
            onSubmit={onSubmit}
            onCancel={onCancel}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
