import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { InfoTooltip, LabelWithInfo } from './info-tooltip'

const meta = {
  title: 'Primitives/InfoTooltip',
  component: InfoTooltip,
  parameters: {
    docs: {
      description: {
        component:
          'A real `<button type="button">`, not an icon with a `title`: `title` appears on hover only, so a keyboard or touch reader never sees it. Base UI opens the tooltip on focus as well as hover.',
      },
    },
  },
  args: {
    label: 'Estimated value',
    children: 'Indicative — mock prices, converted at a fixed rate.',
  },
} satisfies Meta<typeof InfoTooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <span className="typo-body-sm inline-flex items-center gap-1.5">
      Estimated value
      <InfoTooltip label="Estimated value">
        Indicative — mock prices, converted at a fixed rate.
      </InfoTooltip>
    </span>
  ),
}

/** The shape used beside a filter label, where the explanation would otherwise
 *  take vertical space on every visit after the first. */
export const AsLabel: Story = {
  render: () => (
    <LabelWithInfo
      label="Start by choosing"
      info="The second list narrows to what actually exists in the first choice."
      className="typo-label"
    />
  ),
}
