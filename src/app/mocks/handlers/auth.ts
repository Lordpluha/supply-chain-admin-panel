import { HttpResponse, http } from 'msw'
import { credentialsSchema } from '@/entities/session'
import { env } from '@/shared/config/env'
import { buildExpiredSessionCookie, buildSessionCookie } from '@/shared/config/session'
import { db, issueToken, passwords, recordAudit } from '../db'
import { authenticate, badRequest, latency, unauthorized } from './lib'

const toSessionUser = (userId: string) => {
  const user = db.users.find(userId)
  if (!user) return null
  const role = db.roles.find(user.roleId)
  if (!role) return null

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    roleId: role.id,
    roleName: role.name,
    permissions: role.permissions,
  }
}

export const authHandlers = [
  http.post(`${env.apiBaseUrl}/auth/login`, async ({ request }) => {
    await latency()

    const parsed = credentialsSchema.safeParse(await request.json())
    if (!parsed.success) return badRequest('Enter an email and a password')

    const { email, password } = parsed.data
    const user = db.users.all().find(item => item.email.toLowerCase() === email.toLowerCase())

    if (!user || passwords.get(user.email) !== password) {
      // One message for both cases: saying "no such account" would let anyone
      // enumerate who has access to this panel.
      return HttpResponse.json({ message: 'Invalid email or password' }, { status: 401 })
    }

    if (user.status === 'suspended') {
      return HttpResponse.json({ message: 'This account is suspended' }, { status: 403 })
    }

    const sessionUser = toSessionUser(user.id)
    if (!sessionUser) return HttpResponse.json({ message: 'Role missing' }, { status: 500 })

    const token = issueToken(user.id)
    db.users.update(user.id, { lastActiveAt: new Date().toISOString() })

    recordAudit({
      action: 'login',
      entityType: 'session',
      entityId: null,
      entityLabel: null,
      actorId: user.id,
      actorName: user.name,
    })

    // The token is never in the body: it goes out as a cookie and comes back
    // by itself. Nothing in the client ever holds it.
    return HttpResponse.json(
      { user: sessionUser },
      { headers: { 'Set-Cookie': buildSessionCookie(token) } },
    )
  }),

  http.post(`${env.apiBaseUrl}/auth/logout`, async ({ cookies }) => {
    await latency()
    const principal = authenticate({ cookies })

    if (principal) {
      recordAudit({
        action: 'logout',
        entityType: 'session',
        entityId: null,
        entityLabel: null,
        actorId: principal.user.id,
        actorName: principal.user.name,
      })
    }

    // Cleared server-side whether or not the cookie was still valid.
    return new HttpResponse(null, {
      status: 204,
      headers: { 'Set-Cookie': buildExpiredSessionCookie() },
    })
  }),

  /**
   * The only way the client learns who it is. There is no token in JavaScript
   * to inspect, so "am I signed in" is a question for the API.
   */
  http.get(`${env.apiBaseUrl}/auth/session`, async ({ cookies }) => {
    await latency()
    const principal = authenticate({ cookies })
    if (!principal) return unauthorized()

    return HttpResponse.json({ user: toSessionUser(principal.user.id) })
  }),
]
