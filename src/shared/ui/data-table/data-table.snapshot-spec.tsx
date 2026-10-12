import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/shared/lib/test-utils'
import type { DataColumn } from './model/types'
import { DataTable } from './ui/DataTable'

interface Row {
  id: string
  name: string
}

const COLUMNS: ReadonlyArray<DataColumn<Row>> = [
  { id: 'name', header: 'Name', cell: row => row.name, sortable: true },
]

const STATE = {
  total: 1,
  page: 1,
  pageSize: 25,
  sortBy: 'name',
  sortDir: 'asc' as const,
  isLoading: false,
  isError: false,
}

const ACTIONS = { onSort: () => {}, onPage: () => {}, onPageSize: () => {} }

describe('DataTable snapshots', () => {
  it('matches snapshot — with rows', () => {
    const { container } = renderWithProviders(
      <DataTable
        columns={COLUMNS}
        rows={[{ id: 'li-carb', name: 'Lithium Carbonate' }]}
        state={STATE}
        actions={ACTIONS}
      />,
    )

    expect(container.firstChild).toMatchSnapshot()
  })

  it('matches snapshot — empty', () => {
    const { container } = renderWithProviders(
      <DataTable columns={COLUMNS} rows={[]} state={{ ...STATE, total: 0 }} actions={ACTIONS} />,
    )

    expect(container.firstChild).toMatchSnapshot()
  })
})
