import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { Label } from '../label'
import { Checkbox } from './checkbox'

const meta = {
  title: 'Primitives/Checkbox',
  component: Checkbox,
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { 'aria-label': 'Include planned sites' } }

export const Checked: Story = { args: { defaultChecked: true, 'aria-label': 'Countries — read' } }

export const Labelled: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="include-planned" />
      <Label htmlFor="include-planned">Include planned sites</Label>
    </div>
  ),
}

/**
 * The shape the roles screen uses — one checkbox per action, each with a name
 * that says which area it belongs to.
 */
export const PermissionRow: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <span className="typo-body-sm w-24">Countries</span>
      <Checkbox defaultChecked aria-label="Countries — read" />
      <Checkbox aria-label="Countries — write" />
    </div>
  ),
}

export const Disabled: Story = { args: { disabled: true, 'aria-label': 'Locked' } }
