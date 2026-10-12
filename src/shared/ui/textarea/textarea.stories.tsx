import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { Label } from '../label'
import { Textarea } from './textarea'

const meta = {
  title: 'Primitives/Textarea',
  component: Textarea,
  args: { placeholder: 'Reads everything and the audit trail; changes nothing.' },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Labelled: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-1.5">
      <Label htmlFor="role-description">Description</Label>
      <Textarea id="role-description" rows={3} />
    </div>
  ),
}

export const Invalid: Story = { args: { 'aria-invalid': true } }

export const Disabled: Story = { args: { disabled: true, value: 'Built-in roles are read-only.' } }
