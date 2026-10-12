import { act, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Slider } from './slider'

/** See the unit spec: the accessible handle is the hidden range input. */
const thumbs = (container: HTMLElement) => [
  ...container.querySelectorAll<HTMLInputElement>('input[type="range"]'),
]

describe('Slider integration', () => {
  it('moves with the arrow keys', async () => {
    const onValueChange = vi.fn()
    const { container } = render(
      <Slider defaultValue={[50]} min={0} max={100} onValueChange={onValueChange} />,
    )

    act(() => thumbs(container)[0].focus())
    await userEvent.keyboard('{ArrowRight}')

    expect(onValueChange).toHaveBeenCalled()
    expect(thumbs(container)[0]).toHaveValue('51')
  })

  it('jumps to the ends with Home and End', async () => {
    const { container } = render(<Slider defaultValue={[50]} min={0} max={100} />)

    act(() => thumbs(container)[0].focus())
    await userEvent.keyboard('{Home}')
    expect(thumbs(container)[0]).toHaveValue('0')

    await userEvent.keyboard('{End}')
    expect(thumbs(container)[0]).toHaveValue('100')
  })

  /**
   * Both ends are separately focusable and separately movable, which is what
   * makes it a range rather than a bar with a decorative second handle.
   *
   * Asserted by focusing each directly: the inputs are visually hidden, and
   * user-event's tab skips anything jsdom reports as invisible — a jsdom
   * limitation, not the component's. The browser reaches them by Tab.
   */
  it('moves each end of a range independently', async () => {
    const { container } = render(<Slider defaultValue={[2016, 2024]} min={2010} max={2026} />)
    const [from, to] = thumbs(container)

    act(() => from.focus())
    expect(from).toHaveFocus()
    await userEvent.keyboard('{ArrowRight}')
    expect(thumbs(container)[0]).toHaveValue('2017')
    expect(thumbs(container)[1]).toHaveValue('2024')

    act(() => to.focus())
    expect(to).toHaveFocus()
    await userEvent.keyboard('{ArrowLeft}')
    expect(thumbs(container)[1]).toHaveValue('2023')
  })

  it('does not move while disabled', async () => {
    const { container } = render(<Slider defaultValue={[50]} min={0} max={100} disabled />)

    act(() => thumbs(container)[0].focus())
    await userEvent.keyboard('{ArrowRight}')

    expect(thumbs(container)[0]).toHaveValue('50')
  })
})
