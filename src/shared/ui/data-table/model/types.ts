import type { ReactNode } from 'react'
import type { SortDirection } from '@/shared/api'
import type { ExportCellValue } from '@/shared/lib/export'

export interface DataColumn<T> {
  /** Matches the field name the API sorts by. */
  id: string
  header: string
  cell: (row: T) => ReactNode
  sortable?: boolean
  align?: 'start' | 'end'
  /** Omit to leave the column out of the Excel export. */
  exportValue?: (row: T) => ExportCellValue
  /** Hidden below `md`, for columns that are context rather than identity. */
  secondary?: boolean
}

export interface DataTableState {
  total: number
  page: number
  pageSize: number
  sortBy: string
  sortDir: SortDirection
  isLoading: boolean
  isError: boolean
}

export interface DataTableActions {
  onSort: (column: string) => void
  onPage: (page: number) => void
  onPageSize: (size: number) => void
}
