import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/shared/lib/test-utils'
import type { DataColumn } from './model/types'
import { DataTable } from './ui/DataTable'
import { DataTableToolbar } from './ui/DataTableToolbar'

interface Row {
  id: string
  name: string
}

const ROWS: ReadonlyArray<Row> = [{ id: 'li-carb', name: 'Lithium Carbonate' }]

const COLUMNS: ReadonlyArray<DataColumn<Row>> = [
  { id: 'name', header: 'Name', cell: row => row.name, sortable: true },
]

const STATE = {
  total: 1,
  page: 1,
  pageSize: 25,
  sortBy: '',
  sortDir: 'asc' as const,
  isLoading: false,
  isError: false,
}

describe('DataTable integration', () => {
  it('asks for a sort when a header is pressed', async () => {
    const onSort = vi.fn()
    renderWithProviders(
      <DataTable
        columns={COLUMNS}
        rows={ROWS}
        state={STATE}
        actions={{ onSort, onPage: () => {}, onPageSize: () => {} }}
      />,
    )

    await userEvent.click(screen.getByRole('button', { name: /^Name/ }))

    expect(onSort).toHaveBeenCalledWith('name')
  })

  /**
   * Three states, so the header has to say which one the next press produces —
   * the icon and `aria-sort` already carry the current one.
   */
  it('names the next sort state rather than the current one', () => {
    const { rerender } = renderWithProviders(
      <DataTable
        columns={COLUMNS}
        rows={ROWS}
        state={STATE}
        actions={{ onSort: () => {}, onPage: () => {}, onPageSize: () => {} }}
      />,
    )

    expect(screen.getByRole('button', { name: 'Name — Sort ascending' })).toBeInTheDocument()

    rerender(
      <DataTable
        columns={COLUMNS}
        rows={ROWS}
        state={{ ...STATE, sortBy: 'name', sortDir: 'desc' }}
        actions={{ onSort: () => {}, onPage: () => {}, onPageSize: () => {} }}
      />,
    )

    expect(screen.getByRole('button', { name: 'Name — Remove sorting' })).toBeInTheDocument()
  })

  it('runs a row action', async () => {
    const onOpen = vi.fn()
    renderWithProviders(
      <DataTable
        columns={COLUMNS}
        rows={ROWS}
        state={STATE}
        actions={{ onSort: () => {}, onPage: () => {}, onPageSize: () => {} }}
        slots={{
          rowActions: row => (
            <button type="button" onClick={onOpen}>
              Open — {row.name}
            </button>
          ),
        }}
      />,
    )

    await userEvent.click(screen.getByRole('button', { name: 'Open — Lithium Carbonate' }))

    expect(onOpen).toHaveBeenCalledTimes(1)
  })

  it('reports what is typed into its search box', async () => {
    const onSearch = vi.fn()
    renderWithProviders(
      <DataTable
        columns={COLUMNS}
        rows={ROWS}
        state={STATE}
        actions={{ onSort: () => {}, onPage: () => {}, onPageSize: () => {} }}
        slots={{ toolbar: <DataTableToolbar search="" onSearch={onSearch} /> }}
      />,
    )

    await userEvent.type(screen.getByLabelText('Search'), 'li')

    expect(onSearch).toHaveBeenCalled()
  })

  it('offers the export only when there is something to export', () => {
    const { rerender } = renderWithProviders(<DataTableToolbar search="" onSearch={() => {}} />)

    expect(screen.queryByRole('button', { name: 'Export' })).not.toBeInTheDocument()

    rerender(<DataTableToolbar search="" onSearch={() => {}} onExport={() => {}} />)

    expect(screen.getByRole('button', { name: 'Export' })).toBeInTheDocument()
  })
})
