import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table'

/** Browser-rendered references live directly in this component’s __screenshots__/ directory. */
describe('Table screenshots', () => {
  it('renders its variants', async () => {
    render(
      <div data-testid="subject" className="w-[32rem] p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-end">Unit price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { name: 'Lithium Carbonate', category: 'Raw material', price: '€12,400' },
              { name: 'NMC 811 Cathode', category: 'Cathode', price: '€28,200' },
            ].map(row => (
              <TableRow key={row.name}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell className="text-end">{row.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>,
    )

    await expect(page.getByTestId('subject')).toMatchScreenshot()
  })
})
