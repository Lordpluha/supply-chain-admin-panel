import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { Label } from '../label'
import { Input } from './input'

const meta = {
  title: 'Primitives/Input',
  component: Input,
  args: { placeholder: 'Salzgitter Cathode Lab' },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/**
 * A placeholder is not a label. It disappears the moment someone types, and a
 * screen reader may never announce it at all.
 */
export const Labelled: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-1.5">
      <Label htmlFor="facility-name">Name</Label>
      <Input id="facility-name" placeholder="Salzgitter Cathode Lab" />
    </div>
  ),
}

export const Invalid: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-1.5">
      <Label htmlFor="facility-name-invalid">Name</Label>
      <Input id="facility-name-invalid" aria-invalid defaultValue="S" />
      <span className="typo-caption text-destructive">At least 2 characters</span>
    </div>
  ),
}

export const Disabled: Story = { args: { disabled: true, value: 'Read only' } }

export const Types: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-2">
      <Input type="search" placeholder="Search" />
      <Input type="number" placeholder="22000" />
      <Input type="email" placeholder="operator@example.com" />
    </div>
  ),
}
