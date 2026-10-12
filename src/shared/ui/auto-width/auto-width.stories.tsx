import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { useState } from 'react'
import { Button } from '../button'
import { AutoWidth } from './auto-width'

const LABELS = ['Mine', 'Brine extraction', 'Refinery', 'Gigafactory']

const meta = {
  title: 'Layout/AutoWidth',
  component: AutoWidth,
  parameters: {
    docs: {
      description: {
        component:
          'A hidden copy of the longest label shares one grid cell with the real control. A grid track is as wide as its widest item, so the cell settles on the sizer’s width and the control fills it. The alternative — measuring in an effect — costs a layout pass on every render and still flashes at the old width first.',
      },
    },
  },
  args: { labels: LABELS, children: null },
} satisfies Meta<typeof AutoWidth>

export default meta
type Story = StoryObj<typeof meta>

/** Cycle the label: the control keeps the width of the longest one. */
export const Default: Story = {
  render: () => {
    const [index, setIndex] = useState(0)

    return (
      <AutoWidth labels={LABELS} trailing="pe-3" className="inline-grid w-auto">
        <Button variant="outline" onClick={() => setIndex((index + 1) % LABELS.length)}>
          {LABELS[index]}
        </Button>
      </AutoWidth>
    )
  },
}

/** The same control without the sizer, for comparison — it resizes on every
 *  change and shifts whatever sits beside it. */
export const WithoutIt: Story = {
  render: () => {
    const [index, setIndex] = useState(0)

    return (
      <Button variant="outline" onClick={() => setIndex((index + 1) % LABELS.length)}>
        {LABELS[index]}
      </Button>
    )
  },
}
