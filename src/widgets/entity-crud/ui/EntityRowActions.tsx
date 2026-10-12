import { Pencil, Trash2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/button'

export interface EntityRowActionsProps {
  /** The row's human name, so each button says which row it acts on. */
  label: string
  /** The link to the row's own page, already rendered by the screen. */
  detail?: ReactNode
  /** `write` gates both; `delete` is refused for rows that cannot go. */
  can: { write: boolean; delete: boolean }
  onEdit: () => void
  onDelete: () => void
}

/**
 * Opening a row is a read, so the link survives without write access — a viewer
 * still needs somewhere to go from a list.
 */
export const EntityRowActions = ({
  label,
  detail,
  can,
  onEdit,
  onDelete,
}: EntityRowActionsProps) => {
  const { t } = useTranslation()

  return (
    <div className="flex justify-end gap-1">
      {detail}

      {can.write ? (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={onEdit}
            aria-label={`${t('common.edit')} — ${label}`}
          >
            <Pencil aria-hidden="true" />
          </Button>
          {can.delete ? (
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive size-8"
              onClick={onDelete}
              aria-label={`${t('common.delete')} — ${label}`}
            >
              <Trash2 aria-hidden="true" />
            </Button>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
