import { lazy, Suspense } from 'react'

/**
 * The TanStack devtools panels, in development only.
 *
 * `import.meta.env.DEV` is replaced with a literal `false` by Vite at build
 * time, so in production this collapses to `const Panels = null`, the dynamic
 * `import()` becomes unreachable, and three packages — the devtools shell, the
 * router panel and the query panel — are dropped from the bundle entirely
 * rather than merely tree-shaken down.
 *
 * They were previously imported at the top of the root route and rendered
 * unconditionally, which put the whole of the devtools shell (and its Solid
 * runtime) into the entry chunk of every production build.
 *
 * Keep the check a bare `import.meta.env.DEV`: wrapping it in a variable or a
 * helper defeats the static replacement and the panels ship — the same rule
 * `FormDevtools` carries, for the same reason.
 */
const Panels = import.meta.env.DEV
  ? lazy(async () => {
      const [{ TanStackDevtools }, { ReactQueryDevtoolsPanel }, { TanStackRouterDevtoolsPanel }] =
        await Promise.all([
          import('@tanstack/react-devtools'),
          import('@tanstack/react-query-devtools'),
          import('@tanstack/react-router-devtools'),
        ])

      return {
        default: () => (
          <TanStackDevtools
            config={{ position: 'bottom-right' }}
            plugins={[
              { name: 'TanStack Router', render: <TanStackRouterDevtoolsPanel /> },
              { name: 'TanStack Query', render: <ReactQueryDevtoolsPanel /> },
            ]}
          />
        ),
      }
    })
  : null

export const AppDevtools = () => {
  if (!Panels) return null

  return (
    <Suspense fallback={null}>
      <Panels />
    </Suspense>
  )
}
