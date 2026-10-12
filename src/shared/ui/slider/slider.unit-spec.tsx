import { act, render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Slider } from './slider'

/**
 * Queried as `input[type="range"]` rather than by role.
 *
 * Base UI puts a real range input behind each thumb — which is what makes the
 * handle focusable and arrow-key operable — but hides it from the accessibility
 * tree, so `getByRole('slider')` finds nothing. The element is the honest
 * handle here; the alternative would be a test id, which says less.
 */
const thumbs = (container: HTMLElement) => [
  ...container.querySelectorAll<HTMLInputElement>('input[type="range"]'),
]

describe('Slider', () => {
  it('renders one input per thumb', async () => {
    const { container } = await act(async () =>
      render(<Slider defaultValue={[50]} min={0} max={100} />),
    )

    expect(thumbs(container)).toHaveLength(1)
  })

  it('renders both ends of a range', async () => {
    const { container } = await act(async () =>
      render(<Slider defaultValue={[2016, 2024]} min={2010} max={2026} />),
    )

    expect(thumbs(container)).toHaveLength(2)
  })

  /** A bare number is not an array, so the control falls back to both bounds. */
  it('spans its bounds when handed a single number', async () => {
    const { container } = await act(async () =>
      render(<Slider defaultValue={50} min={0} max={100} />),
    )

    expect(thumbs(container)).toHaveLength(2)
  })

  it('carries its bounds and its value', async () => {
    const { container } = await act(async () =>
      render(<Slider defaultValue={[50]} min={0} max={100} />),
    )
    const [thumb] = thumbs(container)

    expect(thumb).toHaveAttribute('min', '0')
    expect(thumb).toHaveAttribute('max', '100')
    expect(thumb).toHaveValue('50')
  })

  it('is disabled when told to be', async () => {
    const { container } = await act(async () => render(<Slider defaultValue={[30]} disabled />))

    expect(thumbs(container)[0]).toBeDisabled()
  })
})
