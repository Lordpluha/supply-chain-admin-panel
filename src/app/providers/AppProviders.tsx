import type { QueryClient } from '@tanstack/react-query'
import { QueryClientProvider } from '@tanstack/react-query'
import { NuqsAdapter } from 'nuqs/adapters/tanstack-router'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { bootstrap } from '@/app/bootstrap'
import { sessionQueries } from '@/entities/session'
import { StartupErrorPage } from '@/pages/errors'
import { setRequestGate, setUnauthorizedHandler } from '@/shared/api'
import { useLanguage } from '@/shared/i18n'
import { applyTheme, useThemeStore } from '@/shared/store/themeStore'
import { TooltipProvider } from '@/shared/ui/tooltip'

// Registered at module load, before any router or query exists: the very first
// request must already be behind the gate.
setRequestGate(bootstrap)

const ThemeEffect = () => {
  const theme = useThemeStore(state => state.theme)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  return null
}

/**
 * Keeps `<html lang>` on the language actually in use. Assistive technology
 * picks its pronunciation from this attribute, so a German page announced as
 * English is a real defect, not cosmetic.
 */
const LanguageEffect = () => {
  const language = useLanguage()

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  return null
}

export interface AppProvidersProps {
  children: ReactNode
  /** Created in `getRouter()` and shared with the route guards. */
  queryClient: QueryClient
}

export const AppProviders = ({ children, queryClient }: AppProvidersProps) => {
  // Children are held back until i18n and the mock API are up. The effect only
  // runs in the browser, which is the point: the service worker cannot be
  // registered from the server shell pass, and a route's `beforeLoad` would
  // have been consumed there. Rendering the routes early means the first query
  // escapes to the network and 404s.
  const [ready, setReady] = useState(false)

  // A rejected bootstrap used to leave the gate shut for good: no i18n, no
  // mock API, and a blank page with nothing on it to act on. Holding the
  // failure lets the one screen that needs no translation explain it.
  const [startupError, setStartupError] = useState<unknown>(null)

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      try {
        await bootstrap()
        if (!cancelled) setReady(true)
      } catch (error) {
        // `?? new Error(...)`: a thrown `null` would otherwise read as "no
        // failure" and leave the blank page this exists to prevent.
        if (!cancelled) setStartupError(error ?? new Error('Startup failed'))
      }
    }

    void run()

    return () => {
      cancelled = true
    }
  }, [])

  // A 401 means the cookie is gone or expired. Dropping the cached session is
  // all that is needed: the route guard sees `null` and redirects.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      queryClient.setQueryData(sessionQueries.keys.current(), null)
    })
  }, [queryClient])

  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        {/* Theme needs no i18n, so it runs immediately. `LanguageEffect` is
            inside the gate: it calls `useTranslation()`, and before
            `initI18n()` resolves there is no instance to read. */}
        <ThemeEffect />
        {startupError === null ? null : <StartupErrorPage error={startupError} />}
        {ready ? (
          <>
            <LanguageEffect />
            {/* Every info button and map affordance opens through this. */}
            <TooltipProvider delay={200}>{children}</TooltipProvider>
          </>
        ) : null}
      </NuqsAdapter>
    </QueryClientProvider>
  )
}
