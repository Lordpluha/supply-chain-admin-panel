import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Radio, RadioGroup } from './radio-group'

const OPTIONS = ['xlsx', 'xls', 'csv']

const renderGroup = (onValueChange = vi.fn()) => {
  render(
    <RadioGroup defaultValue="xlsx" aria-label="File format" onValueChange={onValueChange}>
      {OPTIONS.map(option => (
        <Radio key={option} value={option} aria-label={option} />
      ))}
    </RadioGroup>,
  )

  return onValueChange
}

describe('RadioGroup integration', () => {
  it('moves the selection on click, and only one stays chosen', async () => {
    const onValueChange = renderGroup()

    await userEvent.click(screen.getByRole('radio', { name: 'csv' }))

    expect(screen.getByRole('radio', { name: 'csv' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'xlsx' })).not.toBeChecked()
    expect(onValueChange).toHaveBeenCalledWith('csv', expect.anything())
  })

  /** Arrow keys, not Tab, move within a radio group — that is the ARIA pattern. */
  it('moves with the arrow keys', async () => {
    renderGroup()

    screen.getByRole('radio', { name: 'xlsx' }).focus()
    await userEvent.keyboard('{ArrowDown}')

    expect(screen.getByRole('radio', { name: 'xls' })).toBeChecked()
  })

  it('takes one tab stop for the whole group', async () => {
    render(
      <>
        <button type="button">Before</button>
        <RadioGroup defaultValue="xlsx" aria-label="File format">
          {OPTIONS.map(option => (
            <Radio key={option} value={option} aria-label={option} />
          ))}
        </RadioGroup>
        <button type="button">After</button>
      </>,
    )

    await userEvent.tab()
    await userEvent.tab()
    expect(screen.getByRole('radio', { name: 'xlsx' })).toHaveFocus()

    await userEvent.tab()
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus()
  })
})
