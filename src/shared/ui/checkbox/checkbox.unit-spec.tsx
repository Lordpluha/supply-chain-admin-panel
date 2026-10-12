import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Checkbox } from './checkbox'

describe('Checkbox', () => {
  it('renders a checkbox with the name it is given', () => {
    render(<Checkbox aria-label="Countries — read" />)

    expect(screen.getByRole('checkbox', { name: 'Countries — read' })).toBeInTheDocument()
  })

  it('starts unchecked unless told otherwise', () => {
    render(<Checkbox aria-label="Include planned" />)

    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('honours a default checked state', () => {
    render(<Checkbox defaultChecked aria-label="Include planned" />)

    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  /**
   * Base UI renders a `<button role="checkbox">`, not a native input, so the
   * disabled state is a data attribute rather than the `disabled` property.
   */
  it('is disabled when told to be', () => {
    render(<Checkbox disabled aria-label="Locked" />)

    expect(screen.getByRole('checkbox')).toHaveAttribute('data-disabled')
  })
})
