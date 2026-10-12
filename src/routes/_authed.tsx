import { createFileRoute, Outlet } from '@tanstack/react-router'
import { requireSession } from '@/app/router/guards'
import { AppErrorPage, NotFoundPage } from '@/pages/errors'
import { AppShell } from '@/widgets/app-shell'

/**
 * Pathless layout: contributes no URL segment, but everything beneath it
 * inherits the session guard and the application chrome. `/login` sits outside.
 */
export const Route = createFileRoute('/_authed')({
  beforeLoad: requireSession,
  component: AuthedLayout,
  /**
   * Handled here as well as at the root so the chrome survives the failure.
   * A signed-in operator who follows a stale link has somewhere to go next;
   * replacing the whole document with an error screen takes that away.
   */
  notFoundComponent: () => (
    <AppShell>
      <NotFoundPage />
    </AppShell>
  ),
  errorComponent: ({ error, reset }) => (
    <AppShell>
      <AppErrorPage error={error} reset={reset} />
    </AppShell>
  ),
})

function AuthedLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}
