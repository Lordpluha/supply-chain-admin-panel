import type { Decorator, Preview } from '@storybook/tanstack-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import i18next from 'i18next'
import { NuqsAdapter } from 'nuqs/adapters/react'
import { useEffect } from 'react'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import { LANGUAGES } from '../src/shared/i18n'
import { allResources } from '../src/shared/i18n/locales'
import { THEMES } from '../src/shared/store/themeStore'
import '../src/app/styles/index.css'

const storybookI18n = i18next.createInstance()

void storybookI18n.use(initReactI18next).init({
  resources: allResources,
  lng: 'en',
  fallbackLng: 'en',
  returnNull: false,
  interpolation: { escapeValue: false },
})

/**
 * Writes the selected theme onto `<html>`, exactly as the app does, so a story
 * exercises the real token cascade rather than a Storybook-only approximation.
 */
const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme as string

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return <Story />
}

const withI18n: Decorator = (Story, context) => {
  const locale = context.globals.locale as string

  useEffect(() => {
    void storybookI18n.changeLanguage(locale)
    document.documentElement.lang = locale
  }, [locale])

  return (
    <I18nextProvider i18n={storybookI18n}>
      <Story />
    </I18nextProvider>
  )
}

const withProviders: Decorator = Story => {
  // One client per story render: no cache leaks between stories.
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Number.POSITIVE_INFINITY } },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <Story />
      </NuqsAdapter>
    </QueryClientProvider>
  )
}

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Colour theme',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: THEMES.map(theme => ({
          value: theme,
          title: theme[0].toUpperCase() + theme.slice(1),
        })),
        dynamicTitle: true,
      },
    },
    locale: {
      description: 'Language',
      toolbar: {
        title: 'Language',
        icon: 'globe',
        items: LANGUAGES.map(value => ({ value, title: value.toUpperCase() })),
        dynamicTitle: true,
      },
    },
  },

  initialGlobals: {
    // Light is the product default; a story must look right in it first.
    theme: 'light',
    locale: 'en',
  },

  decorators: [withProviders, withI18n, withTheme],

  parameters: {
    /**
     * Every story is mounted inside a router, because several components hold
     * a `<Link>` — the back link on a record page, the row action on a table.
     *
     * Without a path to resolve against, the framework hands `interpolatePath`
     * an `undefined` and every story in the suite fails on
     * `path.endsWith is not a function` before it renders a single element.
     */
    tanstack: { router: { path: '/' } },

    // The themes own the page background — a Storybook background would sit
    // on top of the token and lie about the result.
    backgrounds: { disable: true },
    layout: 'centered',
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    a11y: {
      // Accessibility is a requirement here, not a suggestion: a violation
      // fails the story test rather than sitting in a panel.
      test: 'error',
    },
    options: {
      storySort: {
        order: ['Overview', 'Foundations', ['Colours', 'Typography'], 'Components', '*'],
      },
    },
  },
}

export default preview
