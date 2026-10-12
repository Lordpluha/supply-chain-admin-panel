import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Currency } from '@/shared/config/currency'
import { BASE_CURRENCY } from '@/shared/config/currency'

/**
 * The reader's own zone, resolved from the browser. This is the default so
 * every timestamp reads in local time without anyone configuring anything —
 * the setting exists for the operator who is watching a region they do not
 * live in.
 */
export const resolveBrowserTimeZone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  } catch {
    return 'UTC'
  }
}

interface PreferencesState {
  /** IANA zone id, e.g. `Europe/Warsaw`. `null` means follow the browser. */
  timeZone: string | null
  currency: Currency
  setTimeZone: (timeZone: string | null) => void
  setCurrency: (currency: Currency) => void
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    set => ({
      timeZone: null,
      currency: BASE_CURRENCY,
      setTimeZone: timeZone => set({ timeZone }),
      setCurrency: currency => set({ currency }),
    }),
    { name: 'supply-chain.preferences' },
  ),
)

/** The zone actually in force: the override if set, the browser's otherwise. */
export const useEffectiveTimeZone = (): string => {
  const timeZone = usePreferencesStore(state => state.timeZone)
  return timeZone ?? resolveBrowserTimeZone()
}
