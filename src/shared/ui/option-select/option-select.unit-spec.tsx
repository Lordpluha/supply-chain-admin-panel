import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { OptionSelect } from './option-select'

const REGIONS = [
  { value: 'Europe', label: 'Europe' },
  { value: 'Asia', label: 'Asia' },
]

describe('OptionSelect', () => {
  it('renders a trigger named by its label', () => {
    render(
      <OptionSelect
        value=""
        options={REGIONS}
        onChange={() => {}}
        aria-label="Region"
        allLabel="All"
      />,
    )

    expect(screen.getByRole('combobox', { name: 'Region' })).toBeInTheDocument()
  })

  /**
   * A Base UI item cannot carry an empty string, so "any" needs a sentinel —
   * and `SelectValue` needs an explicit function child, or the entry renders as
   * the literal `__all__`.
   */
  it('shows the clear entry by its label, never by its sentinel', () => {
    render(
      <OptionSelect
        value=""
        options={REGIONS}
        onChange={() => {}}
        aria-label="Region"
        allLabel="Any region"
      />,
    )

    expect(screen.getByRole('combobox')).toHaveTextContent('Any region')
    expect(screen.getByRole('combobox')).not.toHaveTextContent('__all__')
  })

  it('shows the label of the current value, not its id', () => {
    render(
      <OptionSelect
        value="de"
        options={[{ value: 'de', label: 'Germany' }]}
        onChange={() => {}}
        aria-label="Country"
      />,
    )

    expect(screen.getByRole('combobox')).toHaveTextContent('Germany')
  })

  /** The trigger is sized to the longest option so picking a short one does not
   *  shrink the control and shift everything beside it. */
  it('sizes itself against the longest label it could show', () => {
    const { container } = render(
      <OptionSelect
        value=""
        options={[
          { value: 'a', label: 'Asia' },
          { value: 'b', label: 'South America' },
        ]}
        onChange={() => {}}
        aria-label="Region"
      />,
    )

    expect(container.querySelector('[aria-hidden="true"]')).toHaveTextContent('South America')
  })
})
