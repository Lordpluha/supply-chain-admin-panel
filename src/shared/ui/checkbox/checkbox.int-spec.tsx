import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Label } from '../label'
import { Checkbox } from './checkbox'

describe('Checkbox integration', () => {
  it('toggles on click and reports the new state', async () => {
    const onCheckedChange = vi.fn()
    render(<Checkbox aria-label="Countries — read" onCheckedChange={onCheckedChange} />)

    await userEvent.click(screen.getByRole('checkbox'))

    expect(screen.getByRole('checkbox')).toBeChecked()
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything())
  })

  it('toggles on Space, so the keyboard reaches it', async () => {
    render(<Checkbox aria-label="Countries — read" />)

    screen.getByRole('checkbox').focus()
    await userEvent.keyboard(' ')

    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('is toggled by its own label', async () => {
    render(
      <div className="flex items-center gap-2">
        <Checkbox id="include-planned" />
        <Label htmlFor="include-planned">Include planned sites</Label>
      </div>,
    )

    await userEvent.click(screen.getByText('Include planned sites'))

    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('does not toggle while disabled', async () => {
    render(<Checkbox disabled aria-label="Locked" />)

    await userEvent.click(screen.getByRole('checkbox'))

    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })
})
