import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Input } from '../input'
import { FilterField } from './filter-field'

describe('FilterField integration', () => {
  it('focuses the bound control when its caption is clicked', async () => {
    render(
      <FilterField label="Search" htmlFor="filter-search">
        <Input id="filter-search" type="search" />
      </FilterField>,
    )

    await userEvent.click(screen.getByText('Search'))

    expect(screen.getByLabelText('Search')).toHaveFocus()
  })

  it('leaves a toolbar of them each named and reachable', async () => {
    render(
      <div>
        <FilterField label="Search" htmlFor="toolbar-search">
          <Input id="toolbar-search" />
        </FilterField>
        <FilterField label="Region" htmlFor="toolbar-region">
          <Input id="toolbar-region" />
        </FilterField>
      </div>,
    )

    await userEvent.tab()
    expect(screen.getByLabelText('Search')).toHaveFocus()

    await userEvent.tab()
    expect(screen.getByLabelText('Region')).toHaveFocus()
  })
})
