import { USER_SEED } from '../seedAccess'

/**
 * Plain-text passwords, kept out of the user collection the API returns. A
 * real backend would never hold these; this one is a mock and says so.
 */
export const passwords = new Map(USER_SEED.map(user => [user.email, user.password]))

const TOKEN_PREFIX = 'tok'

/**
 * The token carries the user id it was issued for.
 *
 * An in-memory token→user map was the obvious first design and it was wrong:
 * the map is rebuilt on every page load while the cookie survives, so every
 * reload logged the operator out with a valid credential in hand. A
 * self-describing token behaves the way a signed one does — minus the
 * signature, which there is no server to verify. See SECURITY.md.
 */
export const issueToken = (userId: string): string =>
  `${TOKEN_PREFIX}.${userId}.${Math.random().toString(36).slice(2, 10)}`

export const userIdFromToken = (token: string | undefined): string | null => {
  if (!token) return null
  const [prefix, userId] = token.split('.')
  return prefix === TOKEN_PREFIX && userId ? userId : null
}
