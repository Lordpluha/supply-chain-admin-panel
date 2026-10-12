import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { OptionSelect } from './option-select'

describe('OptionSelect snapshots', () => {
  it('matches snapshot — nothing chosen', () => {
    const { container } = render(
      <OptionSelect
        value=""
        options={[{ value: 'Europe', label: 'Europe' }]}
        onChange={() => {}}
        aria-label="Region"
        allLabel="All"
      />,
    )

    expect(container.firstChild).toMatchSnapshot()
  })

  it('matches snapshot — with a value', () => {
    const { container } = render(
      <OptionSelect
        value="Europe"
        options={[{ value: 'Europe', label: 'Europe' }]}
        onChange={() => {}}
        aria-label="Region"
        allLabel="All"
      />,
    )

    expect(container.firstChild).toMatchSnapshot()
  })
})
