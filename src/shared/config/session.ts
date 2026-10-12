/**
 * The session cookie.
 *
 * Every attribute below is one a browser will actually enforce on a cookie
 * created client-side. `HttpOnly` is **absent on purpose** — see
 * `SECURITY.md`: it can only be set by a real server over the network, and
 * this prototype has none. Claiming it in the attribute string would be a lie
 * the browser silently drops.
 */
export const SESSION_COOKIE = 'supply_chain_session'

/** Eight hours: one working shift, then re-authenticate. */
export const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60

/**
 * `Secure` is conditional because the browser rejects it outright on
 * `http://localhost`, which would leave the developer unable to sign in at all.
 * Anywhere that is not plain-http localhost, it is set.
 */
export const isSecureContext = (): boolean =>
  typeof location === 'undefined' || location.protocol === 'https:'

export const buildSessionCookie = (token: string): string =>
  [
    `${SESSION_COOKIE}=${token}`,
    'Path=/',
    // Strict, not Lax: this panel is never linked to from anywhere else, so
    // there is no cross-site navigation that legitimately needs the session.
    'SameSite=Strict',
    `Max-Age=${SESSION_MAX_AGE_SECONDS}`,
    isSecureContext() ? 'Secure' : null,
  ]
    .filter(Boolean)
    .join('; ')

export const buildExpiredSessionCookie = (): string =>
  [
    `${SESSION_COOKIE}=`,
    'Path=/',
    'SameSite=Strict',
    'Max-Age=0',
    isSecureContext() ? 'Secure' : null,
  ]
    .filter(Boolean)
    .join('; ')
