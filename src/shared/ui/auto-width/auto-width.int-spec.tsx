import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { AutoWidth } from './auto-width'

const LABELS = ['Mine', 'Brine extraction', 'Gigafactory']

const Cycling = () => {
  const [index, setIndex] = useState(0)

  return (
    <AutoWidth labels={LABELS}>
      <button type="button" onClick={() => setIndex((index + 1) % LABELS.length)}>
        {LABELS[index]}
      </button>
    </AutoWidth>
  )
}

describe('AutoWidth integration', () => {
  /**
   * The point of the sizer: the measuring stick does not change as the
   * selection does, so the control cannot shrink and shift what sits beside it.
   */
  it('keeps the same sizer whatever the control now shows', async () => {
    const { container } = render(<Cycling />)
    const sizer = () => container.querySelector('[aria-hidden="true"]')

    expect(sizer()).toHaveTextContent('Brine extraction')

    await userEvent.click(screen.getByRole('button'))

    expect(screen.getByRole('button')).toHaveTextContent('Brine extraction')
    expect(sizer()).toHaveTextContent('Brine extraction')
  })
})
