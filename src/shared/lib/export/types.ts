export const EXPORT_FORMATS = ['xlsx', 'xls', 'csv'] as const

export type ExportFormat = (typeof EXPORT_FORMATS)[number]

export type ExportCellValue = string | number | boolean | Date | null

export interface ExportColumn<T> {
  header: string
  value: (row: T) => ExportCellValue
  /** Column width in characters. Defaults to something readable. */
  width?: number
}

export interface ExportRequest<T> {
  rows: ReadonlyArray<T>
  columns: ReadonlyArray<ExportColumn<T>>
  /** Without an extension — each writer appends its own. */
  fileName: string
}

/** `production-2026-09-19` — stable, sortable, and obvious in a downloads folder. */
export const timestampedFileName = (base: string): string =>
  `${base}-${new Date().toISOString().slice(0, 10)}`
