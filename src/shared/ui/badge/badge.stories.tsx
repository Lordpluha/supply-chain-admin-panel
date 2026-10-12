import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { Badge } from './badge'

const meta = {
  title: 'Primitives/Badge',
  component: Badge,
  args: { children: 'Active' },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="ghost">Ghost</Badge>
    </div>
  ),
}

/**
 * How the panel actually uses it — a status, always with the word, never the
 * colour alone. A reader who cannot distinguish the two tints still reads the
 * state.
 */
export const StatusUsage: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Active</Badge>
      <Badge variant="secondary">Planned</Badge>
      <Badge variant="secondary">Idle</Badge>
    </div>
  ),
}
