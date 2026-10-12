import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { useState } from 'react'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { FilterField } from '@/shared/ui/filter-field'
import { OptionSelect } from '@/shared/ui/option-select'
import type { DataColumn } from './model/types'
import { DataTable } from './ui/DataTable'
import { DataTableToolbar } from './ui/DataTableToolbar'

interface Row {
  id: string
  name: string
  category: string
  unit: string
}

const ROWS: ReadonlyArray<Row> = [
  { id: 'li-carb', name: 'Lithium Carbonate', category: 'Raw material', unit: 't' },
  { id: 'co-sulf', name: 'Cobalt Sulfate', category: 'Raw material', unit: 't' },
  { id: 'nmc-811', name: 'NMC 811 Cathode', category: 'Cathode', unit: 't' },
  { id: 'sep-film', name: 'Separator Film', category: 'Component', unit: 'km²' },
  { id: 'cell-21700', name: 'Cylindrical Cell 21700', category: 'Cell', unit: 'M cells' },
]

const COLUMNS: ReadonlyArray<DataColumn<Row>> = [
  { id: 'name', header: 'Name', cell: row => row.name, sortable: true },
  {
    id: 'category',
    header: 'Category',
    cell: row => <Badge variant="secondary">{row.category}</Badge>,
    sortable: true,
  },
  { id: 'unit', header: 'Unit', cell: row => row.unit, align: 'end', secondary: true },
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

const meta = {
  title: 'Data/DataTable',
  component: DataTable,
  parameters: {
    docs: {
      description: {
        component:
          'The table scrolls inside its own container rather than widening the page, so 360px stays usable. `secondary` columns are context rather than identity and drop below `md`.',
      },
    },
  },
  args: { columns: COLUMNS, rows: ROWS, state: STATE, actions: ACTIONS },
} satisfies Meta<typeof DataTable<Row>>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithToolbar: Story = {
  render: () => {
    const [search, setSearch] = useState('')

    return (
      <DataTable
        columns={COLUMNS}
        rows={ROWS}
        state={STATE}
        actions={ACTIONS}
        slots={{
          toolbar: (
            <DataTableToolbar
              search={search}
              onSearch={setSearch}
              isFiltered={search.length > 0}
              onReset={() => setSearch('')}
              onExport={() => {}}
              filters={
                <FilterField label="Category">
                  <OptionSelect
                    value=""
                    onChange={() => {}}
                    aria-label="Category"
                    allLabel="All"
                    options={[
                      { value: 'Raw material', label: 'Raw material' },
                      { value: 'Cathode', label: 'Cathode' },
                    ]}
                  />
                </FilterField>
              }
            />
          ),
          rowActions: row => (
            <Button size="sm" variant="ghost" aria-label={`Open — ${row.name}`}>
              Open
            </Button>
          ),
        }}
      />
    )
  },
}

export const Loading: Story = { args: { state: { ...STATE, isLoading: true }, rows: [] } }

/** The failure renders in the surface that owns it. A toast would say it twice. */
export const Failed: Story = { args: { state: { ...STATE, isError: true }, rows: [] } }

export const Empty: Story = { args: { rows: [], state: { ...STATE, total: 0 } } }
