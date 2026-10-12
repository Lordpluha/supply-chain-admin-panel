import type { HttpClient } from '@/shared/api'
import { httpClient } from '@/shared/api'
import type { Credentials, Session } from '../model/session.schema'

export interface AuthService {
  login: (credentials: Credentials) => Promise<Session>
  logout: () => Promise<void>
  /** Who the cookie currently identifies. Throws `401` when nobody. */
  me: () => Promise<Session>
}

/**
 * None of these return or accept a token. The credential lives in a cookie the
 * API sets and the browser replays; the client's only job is to ask who it is.
 */
export const createAuthService = (http: HttpClient = httpClient): AuthService => ({
  login: credentials => http<Session>('/auth/login', { method: 'POST', body: credentials }),
  logout: async () => {
    await http<void>('/auth/logout', { method: 'POST' })
  },
  me: () => http<Session>('/auth/session'),
})

export const authService = createAuthService()
