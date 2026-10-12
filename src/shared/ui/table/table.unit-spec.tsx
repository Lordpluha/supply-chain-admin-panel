import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table'

const renderTable = () =>
  render(
    <Table>
      <TableCaption>Products in the catalogue</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Lithium Carbonate</TableCell>
          <TableCell>Raw material</TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  )

describe('Table', () => {
  /** A real `<table>`: the row and column relationships come from the element. */
  it('is a table to assistive technology', () => {
    renderTable()

    expect(screen.getByRole('table', { name: 'Products in the catalogue' })).toBeInTheDocument()
  })

  it('exposes its columns as headers', () => {
    renderTable()

    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Category' })).toBeInTheDocument()
  })

  it('exposes its cells', () => {
    renderTable()

    expect(screen.getByRole('cell', { name: 'Lithium Carbonate' })).toBeInTheDocument()
  })

  it('counts the header row among its rows', () => {
    renderTable()

    expect(screen.getAllByRole('row')).toHaveLength(2)
  })
})
