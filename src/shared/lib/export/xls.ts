import { downloadBlob } from './download'
import type { ExportCellValue, ExportRequest } from './types'

const XML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
}

const escapeXml = (text: string): string => text.replaceAll(/[&<>"']/g, char => XML_ESCAPES[char])

const cell = (value: ExportCellValue): string => {
  if (value === null) return '<Cell/>'

  if (value instanceof Date) {
    return `<Cell ss:StyleID="d"><Data ss:Type="DateTime">${value.toISOString().slice(0, 19)}.000</Data></Cell>`
  }

  if (typeof value === 'number') {
    return `<Cell><Data ss:Type="Number">${value}</Data></Cell>`
  }

  return `<Cell><Data ss:Type="String">${escapeXml(String(value))}</Data></Cell>`
}

const row = (cells: ReadonlyArray<string>): string => `<Row>${cells.join('')}</Row>`

/**
 * Writes the SpreadsheetML 2003 dialect and names the file `.xls`.
 *
 * This is **not** the binary BIFF format that `.xls` originally meant. Writing
 * BIFF in the browser needs a heavyweight dependency for a format Microsoft
 * itself has deprecated; SpreadsheetML is Microsoft's own documented XML
 * replacement, Excel 2003 and every version since opens it without complaint,
 * and LibreOffice reads it too. Excel shows a one-off "the file format and
 * extension don't match" prompt on some builds, which is the honest cost of the
 * choice — see `PRODUCT.md`.
 */
export const toXlsXml = <T>({ rows, columns, fileName }: ExportRequest<T>): string => {
  const widths = columns.map(column => `<Column ss:Width="${(column.width ?? 22) * 6}"/>`).join('')

  const header = row(
    columns.map(
      column =>
        `<Cell ss:StyleID="h"><Data ss:Type="String">${escapeXml(column.header)}</Data></Cell>`,
    ),
  )

  const body = rows.map(entry => row(columns.map(column => cell(column.value(entry))))).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
<Styles>
<Style ss:ID="h"><Font ss:Bold="1"/><Interior ss:Color="#F4F4F5" ss:Pattern="Solid"/></Style>
<Style ss:ID="d"><NumberFormat ss:Format="yyyy\\-mm\\-dd"/></Style>
</Styles>
<Worksheet ss:Name="${escapeXml(fileName).slice(0, 31)}">
<Table>${widths}${header}${body}</Table>
</Worksheet>
</Workbook>`

  return xml
}

export const writeXls = <T>(request: ExportRequest<T>): void => {
  const blob = new Blob([toXlsXml(request)], { type: 'application/vnd.ms-excel;charset=utf-8' })
  downloadBlob(blob, `${request.fileName}.xls`)
}
