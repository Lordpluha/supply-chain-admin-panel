import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from './input-group'

describe('InputGroup', () => {
  it('groups its parts', () => {
    render(
      <InputGroup data-testid="group">
        <InputGroupInput aria-label="Search" />
      </InputGroup>,
    )

    expect(screen.getByTestId('group')).toHaveAttribute('role', 'group')
  })

  it('keeps the input reachable by its own name', () => {
    render(
      <InputGroup>
        <InputGroupInput aria-label="Capacity" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>t</InputGroupText>
        </InputGroupAddon>
      </InputGroup>,
    )

    expect(screen.getByRole('textbox', { name: 'Capacity' })).toBeInTheDocument()
  })

  it('places an addon on the side it is told to', () => {
    render(
      <InputGroup>
        <InputGroupInput aria-label="Email" />
        <InputGroupAddon align="inline-end" data-testid="addon">
          <InputGroupButton>Invite</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>,
    )

    expect(screen.getByTestId('addon')).toHaveAttribute('data-align', 'inline-end')
  })

  it('renders a button inside an addon as a real button', () => {
    render(
      <InputGroup>
        <InputGroupInput aria-label="Email" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton>Invite</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>,
    )

    expect(screen.getByRole('button', { name: 'Invite' })).toBeInTheDocument()
  })
})
