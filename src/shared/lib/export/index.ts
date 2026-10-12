import { writeCsv } from './csv'
import type { ExportFormat, ExportRequest } from './types'
import { writeXls } from './xls'

export type {
  ExportCellValue,
  ExportColumn,
  ExportFormat,
  ExportRequest,
} from './types'
export { EXPORT_FORMATS, timestampedFileName } from './types'

/**
 * Writes the rows exactly as they were handed over — the export is whatever the
 * table is currently showing, same filters, same sort, same order. It never
 * re-queries, because an export that disagrees with the screen is worse than no
 * export at all.
 *
 * One entry point per format keeps the choice at the call site to a single
 * value, and keeps `write-excel-file` out of the bundle path a CSV export takes.
 */
export const exportRows = async <T>(
  format: ExportFormat,
  request: ExportRequest<T>,
): Promise<void> => {
  if (format === 'csv') return writeCsv(request)
  if (format === 'xls') return writeXls(request)
  const { writeXlsx } = await import('./xlsx')
  return writeXlsx(request)
}
