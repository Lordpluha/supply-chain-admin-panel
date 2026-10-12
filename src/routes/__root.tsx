import { createRootRouteWithContext, HeadContent, Scripts } from '@tanstack/react-router'
import { AppDevtools } from '@/app/devtools'
import { AppProviders } from '@/app/providers'
import type { RouterContext } from '@/app/router/context'
import { THEME_INIT_SCRIPT } from '@/app/theme-script'
import { AppErrorPage, NotFoundPage } from '@/pages/errors'
import { DEFAULT_LANGUAGE } from '@/shared/i18n'
import { APP_NAME } from '@/shared/lib/pageTitle'
import { Toaster } from '@/shared/ui/sonner'
import appCss from '../app/styles/index.css?url'

export const Route = createRootRouteWithContext<RouterContext>()({
  /**
   * Client-only, for the whole tree.
   *
   * The API is Mock Service Worker, which lives in the browser. A server
   * render pass has no worker, so any loader running there reaches the
   * network and gets a 404. `spa.enabled` prerenders the shell; this makes
   * sure nothing below it is rendered server-side too.
   */
  ssr: false,
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'color-scheme', content: 'light dark' },
      { title: APP_NAME },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  // Standalone: a path that matches nothing may well be outside the panel,
  // and a crash here is one the shell itself did not survive.
  notFoundComponent: () => <NotFoundPage standalone />,
  errorComponent: ({ error, reset }) => <AppErrorPage error={error} reset={reset} standalone />,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const { queryClient } = Route.useRouteContext()

  return (
    <html lang={DEFAULT_LANGUAGE} data-theme="light">
      <head>
        <HeadContent />
        {/* Sets the stored theme before first paint — see theme-script.ts. */}
        {/* oxlint-disable-next-line react/no-danger */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <AppProviders queryClient={queryClient}>
          {children}
          <Toaster position="bottom-right" />
        </AppProviders>
        <AppDevtools />
        <Scripts />
      </body>
    </html>
  )
}
