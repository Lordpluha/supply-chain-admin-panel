import { downloadBlob } from './download'
import type { ExportCellValue, ExportRequest } from './types'

/** RFC 4180: quote anything containing a separator, a quote or a newline. */
const escape = (value: ExportCellValue): string => {
  if (value === null) return ''

  const text = value instanceof Date ? value.toISOString().slice(0, 10) : String(value)

  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}

/**
 * Written with a UTF-8 byte order mark.
 *
 * Without it Excel reads a CSV as the system's legacy code page and turns every
 * accented name into mojibake — and this panel exports Chloé Durand, Łódź and
 * Salzgitter, so that is not a theoretical concern.
 */
export const toCsv = <T>({ rows, columns }: Omit<ExportRequest<T>, 'fileName'>): string => {
  const lines = [
    columns.map(column => escape(column.header)).join(','),
    ...rows.map(row => columns.map(column => escape(column.value(row))).join(',')),
  ]

  // Leading BOM and CRLF line endings: both are what Excel expects of a CSV.
  return `﻿${lines.join('\r\n')}\r\n`
}

export const writeCsv = <T>(request: ExportRequest<T>): void => {
  const blob = new Blob([toCsv(request)], { type: 'text/csv;charset=utf-8' })
  downloadBlob(blob, `${request.fileName}.csv`)
}
