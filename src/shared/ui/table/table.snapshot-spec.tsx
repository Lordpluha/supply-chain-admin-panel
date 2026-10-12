import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table'

describe('Table snapshots', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Lithium Carbonate</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    )

    expect(container.firstChild).toMatchSnapshot()
  })
})
