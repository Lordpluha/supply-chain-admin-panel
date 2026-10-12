import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { RenderOptions, RenderResult } from '@testing-library/react'
import { render } from '@testing-library/react'
import i18next from 'i18next'
import { NuqsAdapter } from 'nuqs/adapters/react'
import type { ReactElement, ReactNode } from 'react'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import { allResources } from '@/shared/i18n/locales'

/**
 * A separate i18next instance pinned to English: tests assert on copy, and the
 * detector must never pick up the machine's browser language.
 */
const testI18n = i18next.createInstance()

void testI18n.use(initReactI18next).init({
  resources: allResources,
  lng: 'en',
  fallbackLng: 'en',
  returnNull: false,
  interpolation: { escapeValue: false },
})

/** Retries off, so a deliberate error case fails fast instead of after three tries. */
export const createTestQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  })

export interface ProvidersProps {
  children: ReactNode
  queryClient?: QueryClient
}

export const Providers = ({ children, queryClient }: ProvidersProps) => (
  <QueryClientProvider client={queryClient ?? createTestQueryClient()}>
    <I18nextProvider i18n={testI18n}>
      <NuqsAdapter>{children}</NuqsAdapter>
    </I18nextProvider>
  </QueryClientProvider>
)

export interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient
}

/** Every test gets a fresh `QueryClient`; none is ever shared between tests. */
export const renderWithProviders = (
  ui: ReactElement,
  { queryClient, ...options }: RenderWithProvidersOptions = {},
): RenderResult =>
  render(ui, {
    wrapper: ({ children }) => <Providers queryClient={queryClient}>{children}</Providers>,
    ...options,
  })

export { testI18n }
