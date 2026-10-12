import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Label } from './label'

describe('Label', () => {
  it('renders its text', () => {
    render(<Label>Name</Label>)

    expect(screen.getByText('Name')).toBeInTheDocument()
  })

  it('binds to the control it names', () => {
    render(
      <>
        <Label htmlFor="country-name">Name</Label>
        <input id="country-name" />
      </>,
    )

    expect(screen.getByLabelText('Name')).toBe(document.querySelector('#country-name'))
  })

  it('carries its slot', () => {
    render(<Label>Name</Label>)

    expect(screen.getByText('Name')).toHaveAttribute('data-slot', 'label')
  })
})
