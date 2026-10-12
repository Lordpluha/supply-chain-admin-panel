import { HttpResponse } from 'msw'
import type { Permission } from '@/entities/access'
import { hasPermission } from '@/entities/access'
import type { Role } from '@/entities/role'
import type { User } from '@/entities/user'
import type { ListQuery } from '@/shared/api'
import { SESSION_COOKIE } from '@/shared/config/session'
import { db, userIdFromToken } from '../db'

const RESERVED = new Set(['search', 'page', 'pageSize', 'sortBy', 'sortDir'])

/** Rebuilds the `ListQuery` envelope from the wire format `toSearchParams` produced. */
export const parseListQuery = (url: URL): ListQuery => {
  const params = url.searchParams
  const filters: NonNullable<ListQuery['filters']> = {}

  for (const [key, value] of params.entries()) {
    if (!RESERVED.has(key)) filters[key] = value
  }

  return {
    search: params.get('search') ?? undefined,
    page: params.has('page') ? Number(params.get('page')) : undefined,
    pageSize: params.has('pageSize') ? Number(params.get('pageSize')) : undefined,
    sortBy: params.get('sortBy') ?? undefined,
    sortDir: (params.get('sortDir') as ListQuery['sortDir']) ?? undefined,
    filters,
  }
}

export interface Principal {
  user: User
  role: Role
}

/**
 * What a handler needs to identify the caller. MSW parses the request's
 * cookies for us; reading `document.cookie` here would miss the ones the
 * browser will not expose to script.
 */
export interface RequestContext {
  cookies: Record<string, string>
}

export const authenticate = ({ cookies }: RequestContext): Principal | null => {
  const userId = userIdFromToken(cookies[SESSION_COOKIE])
  if (!userId) return null

  const user = db.users.find(userId)
  if (!user || user.status !== 'active') return null

  const role = db.roles.find(user.roleId)
  if (!role) return null

  return { user, role }
}

export const unauthorized = () =>
  HttpResponse.json({ message: 'Not authenticated' }, { status: 401 })

export const forbidden = (permission: Permission) =>
  HttpResponse.json({ message: `Missing permission: ${permission}` }, { status: 403 })

export const notFound = (what = 'Resource') =>
  HttpResponse.json({ message: `${what} not found` }, { status: 404 })

export const badRequest = (message: string, fields?: Record<string, string>) =>
  HttpResponse.json({ message, fields }, { status: 400 })

/**
 * Re-checks the permission on the server side of the mock, mirroring what a
 * real API does. The client-side `hasPermission` only hides UI; this is what
 * actually refuses the request.
 */
export const authorize = (
  context: RequestContext,
  permission: Permission,
): { principal: Principal } | { response: Response } => {
  const principal = authenticate(context)
  if (!principal) return { response: unauthorized() }

  return principalCan(principal, permission) ? { principal } : { response: forbidden(permission) }
}

/**
 * The same check without the refusal, for a handler that answers either way but
 * says less to a caller holding less — masking a field rather than rejecting
 * the whole request.
 */
export const principalCan = (principal: Principal, permission: Permission): boolean =>
  hasPermission({
    subject: { roleName: principal.role.name, permissions: principal.role.permissions },
    permission,
  })

/** Network feels real enough to exercise loading states without being annoying. */
export const latency = (): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, 120 + Math.random() * 180))
