import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Label } from './label'

describe('Label integration', () => {
  /** The whole point of a bound label: its hit area belongs to the control. */
  it('focuses its control when clicked', async () => {
    render(
      <>
        <Label htmlFor="iso2">ISO-2</Label>
        <input id="iso2" />
      </>,
    )

    await userEvent.click(screen.getByText('ISO-2'))

    expect(screen.getByLabelText('ISO-2')).toHaveFocus()
  })
})
