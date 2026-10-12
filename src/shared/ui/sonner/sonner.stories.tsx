import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { toast } from 'sonner'
import { Button } from '../button'
import { Toaster } from './sonner'

const meta = {
  title: 'Feedback/Toaster',
  component: Toaster,
  parameters: {
    docs: {
      description: {
        component:
          'Mounted once, and wired once in the `MutationCache`. **No component calls `toast.error` for an API failure** — if you find yourself writing one, the mutation is missing its wiring. A validation failure never appears here: it belongs beside its field.',
      },
    },
  },
} satisfies Meta<typeof Toaster>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <>
      <Toaster />
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => toast.success('Saved')}>Success</Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.error('That change conflicts with existing data.', {
              description: 'Remove the facilities in this country first.',
            })
          }
        >
          Conflict
        </Button>
        <Button variant="outline" onClick={() => toast('Export ready')}>
          Neutral
        </Button>
      </div>
    </>
  ),
}
