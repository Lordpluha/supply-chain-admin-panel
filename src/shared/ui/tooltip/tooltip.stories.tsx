import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { Button } from '../button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'

const meta = {
  title: 'Overlays/Tooltip',
  component: Tooltip,
  parameters: {
    docs: {
      description: {
        component:
          'Opens on focus as well as hover, so a keyboard reader gets the same explanation a pointer does. A tooltip never carries information that exists nowhere else.',
      },
    },
  },
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline">Estimated value</Button>} />
        <TooltipContent>Indicative — mock prices, converted at a fixed rate.</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
}

export const Sides: Story = {
  render: () => (
    <TooltipProvider>
      <div className="flex items-center gap-3">
        {(['top', 'right', 'bottom', 'left'] as const).map(side => (
          <Tooltip key={side}>
            <TooltipTrigger render={<Button variant="outline">{side}</Button>} />
            <TooltipContent side={side}>Anchored {side}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  ),
}
