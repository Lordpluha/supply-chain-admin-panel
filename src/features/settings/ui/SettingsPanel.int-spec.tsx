import { cleanup, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { renderWithProviders, testI18n } from '@/shared/lib/test-utils'
import { usePreferencesStore } from '@/shared/store/preferencesStore'
import { useThemeStore } from '@/shared/store/themeStore'
import { SettingsPanel } from './SettingsPanel'

const choose = async (name: string, option: string | RegExp) => {
  await userEvent.click(screen.getByRole('combobox', { name }))
  await userEvent.click(await screen.findByRole('option', { name: option }))
}

afterEach(async () => {
  // Unsubscribe the panel before resetting shared state, regardless of hook order.
  cleanup()
  useThemeStore.setState({ theme: 'light' })
  usePreferencesStore.setState({ currency: 'EUR', timeZone: null })
  await testI18n.changeLanguage('en')
})

describe('SettingsPanel', () => {
  it('offers every theme the panel ships', async () => {
    renderWithProviders(<SettingsPanel />)

    await userEvent.click(screen.getByRole('combobox', { name: 'Theme' }))

    for (const theme of ['Light', 'Dark', 'Dim']) {
      expect(await screen.findByRole('option', { name: theme })).toBeInTheDocument()
    }
  })

  it('switches the theme', async () => {
    renderWithProviders(<SettingsPanel />)

    await choose('Theme', 'Dim')

    await waitFor(() => expect(useThemeStore.getState().theme).toBe('dim'))
  })

  /** The code leads, uppercase, so the list scans as a set of tags rather than
   *  a paragraph of language names. */
  it('offers all four languages, code first and then the endonym', async () => {
    renderWithProviders(<SettingsPanel />)

    await userEvent.click(screen.getByRole('combobox', { name: 'Language' }))

    for (const language of ['EN · English', 'DE · Deutsch', 'FR · Français', 'PL · Polski']) {
      expect(await screen.findByRole('option', { name: language })).toBeInTheDocument()
    }
  })

  it('switches the language and the copy follows', async () => {
    renderWithProviders(<SettingsPanel />)

    await choose('Language', 'DE · Deutsch')

    await waitFor(() => expect(screen.getByText('Darstellung')).toBeInTheDocument())
  })

  /** The symbol sits beside the code, because `Intl` alone shows an English
   *  reader `PLN` where a Polish one would expect `zł`. */
  it('names a currency by its symbol as well as its code', async () => {
    renderWithProviders(<SettingsPanel />)

    await userEvent.click(screen.getByRole('combobox', { name: 'Currency' }))

    expect(await screen.findByRole('option', { name: 'zł · PLN' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'CHF · CHF' })).toBeInTheDocument()
  })

  it('switches the currency', async () => {
    renderWithProviders(<SettingsPanel />)

    await choose('Currency', 'zł · PLN')

    await waitFor(() => expect(usePreferencesStore.getState().currency).toBe('PLN'))
  })

  /** A select item cannot hold an empty value, so "follow the browser" needs a
   *  sentinel — and it must never be what the reader sees. */
  it('offers to follow the browser without showing its sentinel', async () => {
    renderWithProviders(<SettingsPanel />)

    const trigger = screen.getByRole('combobox', { name: 'Time zone' })

    expect(trigger).not.toHaveTextContent('__auto__')
    expect(trigger).toHaveTextContent(/Follow my browser/)
  })

  it('pins a time zone, and can hand it back to the browser', async () => {
    renderWithProviders(<SettingsPanel />)

    await choose('Time zone', /Berlin/)
    await waitFor(() => expect(usePreferencesStore.getState().timeZone).toBe('Europe/Berlin'))

    await choose('Time zone', /Follow my browser/)
    await waitFor(() => expect(usePreferencesStore.getState().timeZone).toBeNull())
  })
})
