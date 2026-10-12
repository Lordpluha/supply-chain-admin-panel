import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { SortDirection } from '@/shared/api'
import { cn } from '@/shared/lib/cn'
import { TableHead } from '@/shared/ui/table'

export interface SortHeaderProps {
  column: string
  label: string
  sortBy: string
  sortDir: SortDirection
  onSort: (column: string) => void
}

/**
 * The `aria-sort` attribute belongs on the `<th>`, not on the control inside
 * it — that is what a screen reader announces when it enters the column.
 */
export const SortHeader = ({ column, label, sortBy, sortDir, onSort }: SortHeaderProps) => {
  const { t } = useTranslation()
  const active = sortBy === column
  const Icon = active ? (sortDir === 'asc' ? ArrowUp : ArrowDown) : ChevronsUpDown

  // Sorting cycles ascending → descending → off, so the name has to say which
  // of the three the next press produces. Naming the current state instead
  // would be the one thing the icon and `aria-sort` already carry.
  const nextAction = !active
    ? t('common.sortAsc')
    : sortDir === 'asc'
      ? t('common.sortDesc')
      : t('common.sortNone')

  return (
    <TableHead aria-sort={active ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}>
      <button
        type="button"
        onClick={() => onSort(column)}
        className={cn(
          'typo-label hover:text-foreground focus-visible:ring-ring -mx-2 flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors focus-visible:ring-2 focus-visible:outline-none',
          active ? 'text-foreground' : 'text-muted-foreground',
        )}
        // The visible label already names the column, so the accessible name
        // only has to add what the click will do.
        aria-label={`${label} — ${nextAction}`}
      >
        {label}
        <Icon className="size-3.5 shrink-0" aria-hidden="true" />
      </button>
    </TableHead>
  )
}
