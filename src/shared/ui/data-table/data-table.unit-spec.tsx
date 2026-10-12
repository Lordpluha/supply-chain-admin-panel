import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/shared/lib/test-utils'
import type { DataColumn } from './model/types'
import { DataTable } from './ui/DataTable'

interface Row {
  id: string
  name: string
  category: string
}

const ROWS: ReadonlyArray<Row> = [
  { id: 'li-carb', name: 'Lithium Carbonate', category: 'Raw material' },
  { id: 'nmc-811', name: 'NMC 811 Cathode', category: 'Cathode' },
]

const COLUMNS: ReadonlyArray<DataColumn<Row>> = [
  { id: 'name', header: 'Name', cell: row => row.name, sortable: true },
  { id: 'category', header: 'Category', cell: row => row.category, secondary: true },
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

describe('DataTable', () => {
  it('renders a row per record', () => {
    renderWithProviders(<DataTable columns={COLUMNS} rows={ROWS} state={STATE} actions={ACTIONS} />)

    expect(screen.getByRole('cell', { name: 'Lithium Carbonate' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: 'NMC 811 Cathode' })).toBeInTheDocument()
  })

  it('makes a sortable column a button and leaves the rest alone', () => {
    renderWithProviders(<DataTable columns={COLUMNS} rows={ROWS} state={STATE} actions={ACTIONS} />)

    expect(screen.getByRole('button', { name: /^Name/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^Category/ })).not.toBeInTheDocument()
  })

  /** The `<th>` carries `aria-sort`, which is what a reader hears on entry. */
  it('announces which column is sorted, and which way', () => {
    renderWithProviders(<DataTable columns={COLUMNS} rows={ROWS} state={STATE} actions={ACTIONS} />)

    expect(screen.getByRole('columnheader', { name: /^Name/ })).toHaveAttribute(
      'aria-sort',
      'ascending',
    )
  })

  it('announces a reload rather than emptying itself', () => {
    renderWithProviders(
      <DataTable
        columns={COLUMNS}
        rows={ROWS}
        state={{ ...STATE, isLoading: true }}
        actions={ACTIONS}
      />,
    )

    expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true')
  })

  it('says so when the filters match nothing', () => {
    renderWithProviders(
      <DataTable columns={COLUMNS} rows={[]} state={{ ...STATE, total: 0 }} actions={ACTIONS} />,
    )

    expect(screen.getByText('Nothing matches these filters')).toBeInTheDocument()
  })

  /** The failure renders where it happened; a toast would say it twice. */
  it('renders its own failure', () => {
    renderWithProviders(
      <DataTable
        columns={COLUMNS}
        rows={[]}
        state={{ ...STATE, isError: true, total: 0 }}
        actions={ACTIONS}
      />,
    )

    expect(screen.getByText('Something went wrong. Please try again.')).toBeInTheDocument()
  })
})
