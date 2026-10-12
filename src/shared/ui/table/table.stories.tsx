import type { Meta, StoryObj } from '@storybook/tanstack-react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table'

const meta = {
  title: 'Primitives/Table',
  component: Table,
  parameters: {
    docs: {
      description: {
        component:
          'The raw element. Screens use `DataTable`, which adds sorting, the toolbar, pagination and the loading and empty states.',
      },
    },
  },
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption className="sr-only">Products in the catalogue</TableCaption>
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
          { name: 'Separator Film', category: 'Component', price: '€780,000' },
        ].map(row => (
          <TableRow key={row.name}>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.category}</TableCell>
            <TableCell className="text-end tabular-nums">{row.price}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}
