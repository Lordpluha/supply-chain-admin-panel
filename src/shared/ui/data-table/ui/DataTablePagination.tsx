import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/shared/i18n'
import { formatNumber } from '@/shared/lib/format'
import { PAGE_SIZES } from '@/shared/lib/listQuery'
import { Button } from '@/shared/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'

export interface DataTablePaginationProps {
  total: number
  page: number
  pageSize: number
  onPage: (page: number) => void
  onPageSize: (size: number) => void
}

export const DataTablePagination = ({
  total,
  page,
  pageSize,
  onPage,
  onPageSize,
}: DataTablePaginationProps) => {
  const { t } = useTranslation()
  const locale = useLanguage()

  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <div className="flex flex-col items-center justify-between gap-3 px-1 py-3 sm:flex-row">
      <p className="typo-caption text-muted-foreground" aria-live="polite">
        {t('common.showing', {
          from: formatNumber(from, locale),
          to: formatNumber(to, locale),
          total: formatNumber(total, locale),
        })}
      </p>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="typo-caption text-muted-foreground" htmlFor="data-table-page-size">
            {t('common.rowsPerPage')}
          </label>
          <Select value={String(pageSize)} onValueChange={value => onPageSize(Number(value))}>
            <SelectTrigger id="data-table-page-size" className="h-8 w-20" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map(size => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1">
          <span className="typo-caption text-muted-foreground tabular-nums">
            {t('common.page')} {page} {t('common.of')} {pageCount}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            disabled={page <= 1}
            onClick={() => onPage(page - 1)}
            aria-label={t('common.previous')}
          >
            <ChevronLeft aria-hidden="true" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            disabled={page >= pageCount}
            onClick={() => onPage(page + 1)}
            aria-label={t('common.next')}
          >
            <ChevronRight aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  )
}
