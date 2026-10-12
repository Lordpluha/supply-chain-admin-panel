import { redirect } from '@tanstack/react-router'
import type { Permission } from '@/entities/access'
import { hasPermission } from '@/entities/access'
import type { SessionUser } from '@/entities/session'
import { sessionQueries, toPermissionSubject } from '@/entities/session'
import type { RouterContext } from './context'

interface GuardArgs {
  context: RouterContext
  location: { href: string }
}

/**
 * Resolved through the query cache rather than a fresh request: the session is
 * already there after the first load, so a navigation does not pay for a round
 * trip to answer a question it has just asked.
 */
const readSession = async (context: RouterContext): Promise<SessionUser | null> => {
  const session = await context.queryClient.ensureQueryData(sessionQueries.currentOptions())
  return session?.user ?? null
}

/** Not signed in → `/login`, carrying where they meant to go. */
export const requireSession = async ({ context, location }: GuardArgs) => {
  const user = await readSession(context)

  if (!user) {
    throw redirect({ to: '/login', search: { redirect: location.href } })
  }

  return { user }
}

/**
 * Signed in but lacking the permission → the no-access screen, **not** a 404.
 * The page exists; the operator needs to know to ask for access rather than
 * conclude it is gone.
 */
export const requirePermission =
  (permission: Permission) =>
  async ({ context, location }: GuardArgs) => {
    const { user } = await requireSession({ context, location })

    if (!hasPermission({ subject: toPermissionSubject(user), permission })) {
      throw redirect({ to: '/no-access', search: { permission } })
    }

    return { user }
  }

/** For `/login`: someone already signed in has no business on it. */
export const redirectIfSignedIn = async ({ context }: { context: RouterContext }) => {
  const user = await readSession(context)
  if (user) throw redirect({ to: '/' })
}
