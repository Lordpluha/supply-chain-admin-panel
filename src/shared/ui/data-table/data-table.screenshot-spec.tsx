import { describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { renderWithProviders } from '@/shared/lib/test-utils'
import type { DataColumn } from './model/types'
import { DataTable } from './ui/DataTable'
import { DataTableToolbar } from './ui/DataTableToolbar'

interface Row {
  id: string
  name: string
  category: string
}

const ROWS: ReadonlyArray<Row> = [
  { id: 'li-carb', name: 'Lithium Carbonate', category: 'Raw material' },
  { id: 'nmc-811', name: 'NMC 811 Cathode', category: 'Cathode' },
  { id: 'sep-film', name: 'Separator Film', category: 'Component' },
]

const COLUMNS: ReadonlyArray<DataColumn<Row>> = [
  { id: 'name', header: 'Name', cell: row => row.name, sortable: true },
  { id: 'category', header: 'Category', cell: row => row.category, sortable: true },
]

const STATE = {
  total: ROWS.length,
  page: 1,
  pageSize: 25,
  sortBy: 'name',
  sortDir: 'asc' as const,
  isLoading: false,
  isError: false,
}

const ACTIONS = { onSort: () => {}, onPage: () => {}, onPageSize: () => {} }

/**
 * The whole table — toolbar, sorted header, rows, pagination. The baseline
 * lands in `__screenshots__` on the first run; see DEPLOYMENT.md on why that
 * has never happened on the machine this was built on.
 */
describe('DataTable screenshots', () => {
  it('renders a populated table', async () => {
    renderWithProviders(
      <div data-testid="subject" className="w-[48rem] p-4">
        <DataTable
          columns={COLUMNS}
          rows={ROWS}
          state={STATE}
          actions={ACTIONS}
          slots={{
            toolbar: <DataTableToolbar search="" onSearch={() => {}} onExport={() => {}} />,
          }}
        />
      </div>,
    )

    await expect(page.getByTestId('subject')).toMatchScreenshot()
  })

  it('renders the empty state', async () => {
    renderWithProviders(
      <div data-testid="empty" className="w-[48rem] p-4">
        <DataTable columns={COLUMNS} rows={[]} state={{ ...STATE, total: 0 }} actions={ACTIONS} />
      </div>,
    )

    await expect(page.getByTestId('empty')).toMatchScreenshot()
  })
})
