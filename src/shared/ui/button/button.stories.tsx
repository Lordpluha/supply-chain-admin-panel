import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { Download, Plus, Trash2 } from 'lucide-react'
import { Button } from './button'

const meta = {
  title: 'Primitives/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component:
          'Every variant is built from semantic tokens, so all three themes follow without a `dark:` override at the call site.',
      },
    },
  },
  args: { children: 'Save' },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button>Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button>
        <Plus aria-hidden="true" />
        Create
      </Button>
      <Button variant="outline">
        <Download aria-hidden="true" />
        Export
      </Button>
    </div>
  ),
}

/**
 * An icon-only button carries `aria-label`, always. Without one it is a control
 * a screen reader announces as "button" and nothing else.
 */
export const IconOnly: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Button size="icon" variant="ghost" aria-label="Add a row">
        <Plus aria-hidden="true" />
      </Button>
      <Button size="icon" variant="ghost" className="text-destructive" aria-label="Delete this row">
        <Trash2 aria-hidden="true" />
      </Button>
    </div>
  ),
}

export const Disabled: Story = { args: { disabled: true } }
