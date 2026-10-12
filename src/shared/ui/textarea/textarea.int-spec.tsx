import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Textarea } from './textarea'

describe('Textarea integration', () => {
  it('keeps the newlines it is given', async () => {
    render(<Textarea aria-label="Description" />)

    await userEvent.type(screen.getByRole('textbox'), 'First line{Enter}Second line')

    expect(screen.getByRole('textbox')).toHaveValue('First line\nSecond line')
  })

  it('accepts nothing while disabled', async () => {
    render(<Textarea aria-label="Description" disabled />)

    await userEvent.type(screen.getByRole('textbox'), 'Anything')

    expect(screen.getByRole('textbox')).toHaveValue('')
  })
})
