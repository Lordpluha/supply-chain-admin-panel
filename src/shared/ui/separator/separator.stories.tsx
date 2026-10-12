import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { Separator } from './separator'

const meta = {
  title: 'Primitives/Separator',
  component: Separator,
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-3">
      <span className="typo-body-sm">Production</span>
      <Separator />
      <span className="typo-body-sm">Reference data</span>
    </div>
  ),
}

/** In the app header it runs the full height of the bar: a short centred dash
 *  beside 36px buttons reads as a stray mark rather than a division. */
export const Vertical: Story = {
  render: () => (
    <div className="flex h-14 items-center gap-2">
      <span className="typo-caption text-muted-foreground">Ada Marchetti · ADMIN</span>
      <Separator orientation="vertical" className="mx-2 h-full" />
      <span className="typo-caption text-muted-foreground">Settings</span>
    </div>
  ),
}
