import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from './input-group'

describe('InputGroup integration', () => {
  it('types into the input and presses the button beside it', async () => {
    const onInvite = vi.fn()
    render(
      <InputGroup>
        <InputGroupInput aria-label="Email" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton onClick={onInvite}>Invite</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>,
    )

    await userEvent.type(screen.getByRole('textbox'), 'operator@example.com')
    await userEvent.click(screen.getByRole('button', { name: 'Invite' }))

    expect(screen.getByRole('textbox')).toHaveValue('operator@example.com')
    expect(onInvite).toHaveBeenCalledTimes(1)
  })

  it('reaches the input and then its button by tabbing', async () => {
    render(
      <InputGroup>
        <InputGroupInput aria-label="Email" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton>Invite</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>,
    )

    await userEvent.tab()
    expect(screen.getByRole('textbox')).toHaveFocus()

    await userEvent.tab()
    expect(screen.getByRole('button', { name: 'Invite' })).toHaveFocus()
  })
})
