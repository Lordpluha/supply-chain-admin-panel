import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { Input } from '../input'
import { Label } from './label'

const meta = {
  title: 'Primitives/Label',
  component: Label,
  args: { children: 'Name' },
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const BoundToAControl: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-1.5">
      <Label htmlFor="country-name">Name</Label>
      <Input id="country-name" defaultValue="Germany" />
    </div>
  ),
}
