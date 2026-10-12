import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AutoWidth } from './auto-width'

const LABELS = ['Mine', 'Brine extraction', 'Gigafactory']

describe('AutoWidth', () => {
  it('renders the control it wraps', () => {
    render(
      <AutoWidth labels={LABELS}>
        <button type="button">Mine</button>
      </AutoWidth>,
    )

    expect(screen.getByRole('button', { name: 'Mine' })).toBeInTheDocument()
  })

  /** The sizer is what makes the cell as wide as the longest option can be. */
  it('sizes itself against the longest label', () => {
    const { container } = render(
      <AutoWidth labels={LABELS}>
        <button type="button">Mine</button>
      </AutoWidth>,
    )

    const sizer = container.querySelector('[aria-hidden="true"]')

    expect(sizer).toHaveTextContent('Brine extraction')
  })

  /** It is a measuring stick, not content: nothing should read it. */
  it('hides the sizer from assistive technology', () => {
    render(
      <AutoWidth labels={LABELS}>
        <button type="button">Mine</button>
      </AutoWidth>,
    )

    expect(screen.getAllByText('Brine extraction')).toHaveLength(1)
    expect(screen.getByText('Brine extraction')).toHaveAttribute('aria-hidden', 'true')
  })

  it('copes with no labels at all', () => {
    render(
      <AutoWidth labels={[]}>
        <button type="button">Empty</button>
      </AutoWidth>,
    )

    expect(screen.getByRole('button', { name: 'Empty' })).toBeInTheDocument()
  })
})
