import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Input } from '../input'
import { FilterField } from './filter-field'

describe('FilterField', () => {
  it('shows the caption above its control', () => {
    render(
      <FilterField label="Region">
        <Input aria-label="Region" />
      </FilterField>,
    )

    expect(screen.getByText('Region')).toBeInTheDocument()
  })

  /** A real `<label for>` — the search box is an `<input>`, so it can have one. */
  it('binds to a real form control when given its id', () => {
    render(
      <FilterField label="Search" htmlFor="filter-search">
        <Input id="filter-search" />
      </FilterField>,
    )

    expect(screen.getByLabelText('Search')).toHaveAttribute('id', 'filter-search')
  })

  /**
   * A select trigger is a `<button>`, which `<label for>` cannot bind to. The
   * caption is then `aria-hidden` and the control keeps the same string as its
   * own `aria-label` — announced once, not twice.
   */
  it('hides the caption from assistive technology when it cannot bind', () => {
    render(
      <FilterField label="Kind">
        <button type="button" aria-label="Kind">
          All
        </button>
      </FilterField>,
    )

    expect(screen.getByText('Kind')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByRole('button', { name: 'Kind' })).toBeInTheDocument()
  })
})
