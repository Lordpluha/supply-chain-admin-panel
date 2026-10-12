import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { createQueryClient } from '@/app/providers'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  // One client for the whole app, shared by the React tree and by the route
  // guards — a guard asking "who is signed in" must hit the same cache the
  // components read, not a second one.
  const queryClient = createQueryClient()

  const router = createTanStackRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
