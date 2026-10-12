/** Inclusive range of production years the prototype covers. */
export const YEAR_MIN = 2010
export const YEAR_MAX = 2026

export const YEARS: ReadonlyArray<number> = Array.from(
  { length: YEAR_MAX - YEAR_MIN + 1 },
  (_, index) => YEAR_MIN + index,
)

/**
 * The prototype ships with a single seeded operator. These exact values are
 * pre-filled into the login form, so the happy path needs no typing.
 */
export const DEFAULT_CREDENTIALS = {
  email: 'admin@example.com',
  password: 'supply-chain',
} as const
