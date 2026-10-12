import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { Skeleton } from './skeleton'

const meta = {
  title: 'Primitives/Skeleton',
  component: Skeleton,
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { className: 'h-5 w-48' } }

/**
 * A container of skeletons carries `aria-busy`, so the state is announced
 * rather than only drawn.
 */
export const Block: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-3" aria-busy="true">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-5 w-2/5" />
    </div>
  ),
}
