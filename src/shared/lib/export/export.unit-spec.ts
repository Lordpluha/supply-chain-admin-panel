import { describe, expect, it } from 'vitest'
import { toCsv } from './csv'
import type { ExportColumn } from './types'
import { timestampedFileName } from './types'
import { toXlsXml } from './xls'

interface Row {
  name: string
  output: number
  note: string | null
}

const columns: ReadonlyArray<ExportColumn<Row>> = [
  { header: 'Name', value: row => row.name },
  { header: 'Output', value: row => row.output },
  { header: 'Note', value: row => row.note },
]

const rows: ReadonlyArray<Row> = [
  { name: 'Salzgitter Cathode Lab', output: 22_000, note: null },
  // Every RFC 4180 hazard in one row: a comma, a quote and a newline.
  { name: 'Yichun, Jiangxi', output: 90_000, note: 'said "ramping"\nsince 2024' },
]

describe('toCsv', () => {
  it('leads with a BOM so Excel reads it as UTF-8', () => {
    expect(toCsv({ rows, columns }).startsWith('﻿')).toBe(true)
  })

  it('quotes and doubles what would otherwise break the row', () => {
    const csv = toCsv({ rows, columns })

    expect(csv).toContain('"Yichun, Jiangxi"')
    expect(csv).toContain('"said ""ramping""\nsince 2024"')
  })

  it('writes an empty cell for null rather than the word', () => {
    const [, first] = toCsv({ rows, columns }).split('\r\n')

    expect(first).toBe('Salzgitter Cathode Lab,22000,')
    expect(first).not.toContain('null')
  })
})

describe('toXlsXml', () => {
  const xml = toXlsXml({ rows, columns, fileName: 'facilities' })

  it('announces itself to Excel', () => {
    expect(xml).toContain('<?mso-application progid="Excel.Sheet"?>')
    expect(xml).toContain('urn:schemas-microsoft-com:office:spreadsheet')
  })

  it('types numbers as numbers, so the sheet can add them up', () => {
    expect(xml).toContain('<Data ss:Type="Number">22000</Data>')
  })

  it('escapes the markup characters a name can contain', () => {
    const escaped = toXlsXml({
      rows: [{ name: 'A & B <Ltd>', output: 1, note: null }],
      columns,
      fileName: 'x',
    })

    expect(escaped).toContain('A &amp; B &lt;Ltd&gt;')
    expect(escaped).not.toContain('<Ltd>')
  })

  it('leaves a null cell empty rather than writing a typed blank', () => {
    expect(xml).toContain('<Cell/>')
  })
})

describe('timestampedFileName', () => {
  it('appends an ISO date, which sorts in a downloads folder', () => {
    expect(timestampedFileName('production')).toMatch(/^production-\d{4}-\d{2}-\d{2}$/)
  })
})
