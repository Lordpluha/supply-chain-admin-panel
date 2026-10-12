import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'

const renderSelect = (onValueChange = vi.fn()) => {
  render(
    <Select defaultValue="Europe" onValueChange={onValueChange}>
      <SelectTrigger aria-label="Region">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Europe">Europe</SelectItem>
        <SelectItem value="Asia">Asia</SelectItem>
        <SelectItem value="Africa">Africa</SelectItem>
      </SelectContent>
    </Select>,
  )

  return onValueChange
}

describe('Select integration', () => {
  it('opens on click and offers every item', async () => {
    renderSelect()

    await userEvent.click(screen.getByRole('combobox'))

    await waitFor(() => expect(screen.getByRole('listbox')).toBeInTheDocument())
    expect(screen.getAllByRole('option')).toHaveLength(3)
  })

  it('reports the chosen value and shows it on the trigger', async () => {
    const onValueChange = renderSelect()

    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.click(await screen.findByRole('option', { name: 'Asia' }))

    expect(onValueChange).toHaveBeenCalledWith('Asia', expect.anything())
    await waitFor(() => expect(screen.getByRole('combobox')).toHaveTextContent('Asia'))
  })

  // jsdom has no layout, so the position itself is covered in a real browser;
  // this pins the setting that decides it. With a value chosen, the vendored
  // default laid the list over the trigger, and it jumped between opens.
  it('drops the list below the trigger even when a value is already chosen', async () => {
    renderSelect()

    await userEvent.click(screen.getByRole('combobox'))

    const listbox = await screen.findByRole('listbox')
    expect(listbox.closest('[data-slot="select-content"]')).toHaveAttribute(
      'data-align-trigger',
      'false',
    )
  })

  it('opens from the keyboard', async () => {
    renderSelect()

    screen.getByRole('combobox').focus()
    await userEvent.keyboard('{Enter}')

    await waitFor(() => expect(screen.getByRole('listbox')).toBeInTheDocument())
  })

  it('closes on Escape without changing anything', async () => {
    const onValueChange = renderSelect()

    await userEvent.click(screen.getByRole('combobox'))
    await waitFor(() => expect(screen.getByRole('listbox')).toBeInTheDocument())

    await userEvent.keyboard('{Escape}')

    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument())
    expect(onValueChange).not.toHaveBeenCalled()
  })
})
