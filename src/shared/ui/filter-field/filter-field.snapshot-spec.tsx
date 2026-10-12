import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Input } from '../input'
import { FilterField } from './filter-field'

describe('FilterField snapshots', () => {
  it('matches snapshot — bound to an input', () => {
    const { container } = render(
      <FilterField label="Search" htmlFor="search">
        <Input id="search" />
      </FilterField>,
    )

    expect(container.firstChild).toMatchSnapshot()
  })

  it('matches snapshot — caption beside a button trigger', () => {
    const { container } = render(
      <FilterField label="Region">
        <button type="button" aria-label="Region">
          All
        </button>
      </FilterField>,
    )

    expect(container.firstChild).toMatchSnapshot()
  })
})
