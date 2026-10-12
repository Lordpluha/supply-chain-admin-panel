import { Download, Search, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/button'
import { FilterField } from '@/shared/ui/filter-field'
import { Input } from '@/shared/ui/input'

export interface DataTableToolbarProps {
  search: string
  onSearch: (value: string) => void
  /** Entity-specific selects. Rendered between the search box and the actions. */
  filters?: ReactNode
  onReset?: () => void
  /** Omitted while an export is not possible — no rows, or no permission.
   *  Opens the format dialog rather than writing a file directly. */
  onExport?: () => void
  isExporting?: boolean
  isFiltered?: boolean
}

export const DataTableToolbar = ({
  search,
  onSearch,
  filters,
  onReset,
  onExport,
  isExporting = false,
  isFiltered = false,
}: DataTableToolbarProps) => {
  const { t } = useTranslation()
  // A real `<label for>` — the search box is an `<input>`, so it can have one.
  const searchId = useId()

  return (
    <div className="flex flex-col gap-3 py-3 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex flex-1 flex-wrap items-end gap-2">
        <FilterField label={t('common.search')} htmlFor={searchId} className="w-full sm:max-w-64">
          <div className="relative">
            <Search
              className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2"
              aria-hidden="true"
            />
            <Input
              id={searchId}
              type="search"
              value={search}
              onChange={event => onSearch(event.target.value)}
              placeholder={t('common.search')}
              className="pl-8"
            />
          </div>
        </FilterField>

        {filters}

        {isFiltered && onReset ? (
          <Button variant="ghost" size="sm" onClick={onReset}>
            <X aria-hidden="true" />
            {t('common.reset')}
          </Button>
        ) : null}
      </div>

      {onExport ? (
        <Button variant="outline" size="sm" onClick={onExport} disabled={isExporting}>
          <Download aria-hidden="true" />
          {isExporting ? t('common.exporting') : t('common.export')}
        </Button>
      ) : null}
    </div>
  )
}
