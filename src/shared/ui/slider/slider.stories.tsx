import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { Slider } from './slider'

const meta = {
  title: 'Primitives/Slider',
  component: Slider,
  parameters: {
    docs: {
      description: {
        component:
          'Base UI renders a real `<input type="range">` inside each thumb, so every handle is focusable and moves with the arrow keys. The panel itself no longer uses a range slider — its filters are joined selects, which commit one value at a time instead of only while a thumb is held.',
      },
    },
  },
} satisfies Meta<typeof Slider>

export default meta

// `aria-label` on the root never reaches the `<input type="range">` inside each
// thumb, which is what a screen reader focuses. `aria-labelledby` does: Base UI
// forwards the root's to every thumb.
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-3">
      <span id="slider-intensity" className="typo-label">
        Intensity
      </span>
      <Slider defaultValue={50} min={0} max={100} aria-labelledby="slider-intensity" />
    </div>
  ),
}

export const Range: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-3">
      <span id="slider-years" className="typo-label">
        Years
      </span>
      <Slider defaultValue={[2016, 2024]} min={2010} max={2026} aria-labelledby="slider-years" />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-3">
      <span id="slider-disabled" className="typo-label">
        Intensity
      </span>
      <Slider defaultValue={30} disabled aria-labelledby="slider-disabled" />
    </div>
  ),
}
