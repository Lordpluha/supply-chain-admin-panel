import { act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/shared/lib/test-utils'
import { SettingsDialog } from './SettingsDialog'

describe('SettingsDialog', () => {
  it('loads the panel on opening and restores focus after closing and reopening', async () => {
    const user = userEvent.setup()
    renderWithProviders(<SettingsDialog />)
    const trigger = screen.getByRole('button', { name: /settings/i })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await user.click(trigger)
    await act(async () => {
      await vi.dynamicImportSettled()
    })

    const dialog = await screen.findByRole('dialog')
    expect(screen.getByRole('combobox', { name: 'Theme' })).toBeInTheDocument()
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true))

    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    await waitFor(() => expect(trigger).toHaveFocus())

    await user.click(trigger)
    expect(await screen.findByRole('combobox', { name: 'Theme' })).toBeInTheDocument()
  })
})
