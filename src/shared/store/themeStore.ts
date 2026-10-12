import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const THEMES = ['light', 'dark', 'dim'] as const

export type Theme = (typeof THEMES)[number]

export const THEME_STORAGE_KEY = 'supply-chain.theme'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

/** Light is the default: the panel must look right before any script runs. */
export const DEFAULT_THEME: Theme = 'light'

export const useThemeStore = create<ThemeState>()(
  persist(
    set => ({
      theme: DEFAULT_THEME,
      setTheme: theme => set({ theme }),
    }),
    { name: THEME_STORAGE_KEY },
  ),
)

/** Writes the theme onto `<html>`, where the CSS token blocks key off it. */
export const applyTheme = (theme: Theme): void => {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.theme = theme
}
