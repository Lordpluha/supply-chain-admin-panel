import type { Column } from 'write-excel-file/browser'
import writeXlsxFile from 'write-excel-file/browser'
import type { ExportCellValue, ExportRequest } from './types'

const HEADER_STYLE = {
  fontWeight: 'bold',
  backgroundColor: '#F4F4F5',
  align: 'left',
} as const

const typeOf = (value: ExportCellValue) => {
  if (value === null) return undefined
  if (value instanceof Date) return Date
  if (typeof value === 'number') return Number
  if (typeof value === 'boolean') return Boolean
  return String
}

/** The real thing: a zipped OOXML workbook, written by `write-excel-file`. */
export const writeXlsx = async <T>({
  rows,
  columns,
  fileName,
}: ExportRequest<T>): Promise<void> => {
  const schema: Array<Column<T>> = columns.map(column => ({
    header: { value: column.header, ...HEADER_STYLE },
    width: column.width ?? 22,
    cell: (row: T) => {
      const value = column.value(row)
      return { value: value ?? undefined, type: typeOf(value) }
    },
  }))

  await writeXlsxFile<T>([...rows], { columns: schema }).toFile(`${fileName}.xlsx`)
}
