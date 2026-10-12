import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Table, TableBody, TableCell, TableRow } from './table'

describe('Table integration', () => {
  it('lets a control inside a cell be reached and pressed', async () => {
    const onOpen = vi.fn()
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Lithium Carbonate</TableCell>
            <TableCell>
              <button type="button" onClick={onOpen}>
                Open — Lithium Carbonate
              </button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    )

    await userEvent.tab()
    expect(screen.getByRole('button', { name: 'Open — Lithium Carbonate' })).toHaveFocus()

    await userEvent.keyboard('{Enter}')
    expect(onOpen).toHaveBeenCalledTimes(1)
  })

  it('announces a reload through aria-busy rather than emptying itself', () => {
    render(
      <Table aria-busy>
        <TableBody>
          <TableRow>
            <TableCell>Still here</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    )

    expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByRole('cell', { name: 'Still here' })).toBeInTheDocument()
  })
})
