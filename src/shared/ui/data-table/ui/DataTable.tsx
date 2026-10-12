import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { Identifiable } from '@/shared/api'
import { cn } from '@/shared/lib/cn'
import { Skeleton } from '@/shared/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table'
import type { DataColumn, DataTableActions, DataTableState } from '../model/types'
import { DataTablePagination } from './DataTablePagination'
import { SortHeader } from './SortHeader'

export interface DataTableProps<T extends Identifiable> {
  columns: ReadonlyArray<DataColumn<T>>
  rows: ReadonlyArray<T>
  state: DataTableState
  actions: DataTableActions
  /** Toolbar and row-action column, supplied by the screen. */
  slots?: { toolbar?: ReactNode; rowActions?: (row: T) => ReactNode }
}

const SKELETON_ROWS = 6

export const DataTable = <T extends Identifiable>({
  columns,
  rows,
  state,
  actions,
  slots,
}: DataTableProps<T>) => {
  const { t } = useTranslation()
  const columnCount = columns.length + (slots?.rowActions ? 1 : 0)

  return (
    <div className="flex flex-col">
      {slots?.toolbar}

      {/* Scrolls inside its own container rather than widening the page. */}
      <div className="border-border overflow-x-auto rounded-lg border">
        <Table aria-busy={state.isLoading}>
          <TableHeader>
            <TableRow>
              {columns.map(column =>
                column.sortable ? (
                  <SortHeader
                    key={column.id}
                    column={column.id}
                    label={column.header}
                    sortBy={state.sortBy}
                    sortDir={state.sortDir}
                    onSort={actions.onSort}
                  />
                ) : (
                  <TableHead
                    key={column.id}
                    className={cn(
                      column.align === 'end' && 'text-end',
                      column.secondary && 'hidden md:table-cell',
                    )}
                  >
                    {column.header}
                  </TableHead>
                ),
              )}
              {slots?.rowActions ? (
                <TableHead className="w-12">
                  <span className="sr-only">{t('common.actions')}</span>
                </TableHead>
              ) : null}
            </TableRow>
          </TableHeader>

          <TableBody>
            {state.isLoading
              ? Array.from({ length: SKELETON_ROWS }, (_, index) => (
                  // Placeholder rows have no identity; the index is the key.
                  // biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows are positional
                  <TableRow key={`skeleton-${index}`}>
                    {Array.from({ length: columnCount }, (__, cell) => (
                      <TableCell key={`skeleton-${index}-${cell}`}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : rows.map(row => (
                  <TableRow key={row.id}>
                    {columns.map(column => (
                      <TableCell
                        key={column.id}
                        className={cn(
                          column.align === 'end' && 'text-end tabular-nums',
                          column.secondary && 'hidden md:table-cell',
                        )}
                      >
                        {column.cell(row)}
                      </TableCell>
                    ))}
                    {slots?.rowActions ? (
                      <TableCell className="text-end">{slots.rowActions(row)}</TableCell>
                    ) : null}
                  </TableRow>
                ))}

            {!state.isLoading && rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columnCount} className="h-28 text-center">
                  <span className="typo-body-sm text-muted-foreground">
                    {state.isError ? t('errors.generic') : t('common.noResults')}
                  </span>
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination
        total={state.total}
        page={state.page}
        pageSize={state.pageSize}
        onPage={actions.onPage}
        onPageSize={actions.onPageSize}
      />
    </div>
  )
}
