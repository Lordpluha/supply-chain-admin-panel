import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'

const renderSelect = (props: { defaultValue?: string; disabled?: boolean } = {}) =>
  render(
    <Select defaultValue={props.defaultValue ?? 'Europe'} disabled={props.disabled}>
      <SelectTrigger aria-label="Region">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Europe">Europe</SelectItem>
        <SelectItem value="Asia">Asia</SelectItem>
      </SelectContent>
    </Select>,
  )

describe('Select', () => {
  it('renders a combobox trigger with the name it is given', () => {
    renderSelect()

    expect(screen.getByRole('combobox', { name: 'Region' })).toBeInTheDocument()
  })

  it('shows the current value on the trigger', () => {
    renderSelect({ defaultValue: 'Asia' })

    expect(screen.getByRole('combobox')).toHaveTextContent('Asia')
  })

  it('keeps the list closed until asked', () => {
    renderSelect()

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false')
  })

  it('is disabled when told to be', () => {
    renderSelect({ disabled: true })

    expect(screen.getByRole('combobox')).toHaveAttribute('data-disabled')
  })
})
