import { act, render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { Slider } from './slider'

/** Browser-rendered references live directly in this component’s __screenshots__/ directory. */
describe('Slider screenshots', () => {
  it('renders its variants', async () => {
    await act(async () =>
      render(
        <div data-testid="subject" className="flex w-80 flex-col gap-6 p-4">
          <Slider defaultValue={[50]} min={0} max={100} />
          <Slider defaultValue={[2016, 2024]} min={2010} max={2026} />
          <Slider defaultValue={[30]} min={0} max={100} disabled />
        </div>,
      ),
    )

    await expect(page.getByTestId('subject')).toMatchScreenshot()
  })
})
