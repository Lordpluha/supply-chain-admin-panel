import { ApiError } from '@/shared/api'

/**
 * Where an error belongs on screen.
 *
 * - `field`  — a validation failure the form renders beside the offending
 *              input. It never becomes a toast: the operator needs to see
 *              *which* field, and a toast cannot point at one.
 * - `global` — everything else. A toast, because the surface that failed may
 *              no longer be on screen by the time the answer arrives.
 */
export type ErrorPlacement = 'field' | 'global'

export interface FieldErrors {
  [field: string]: string
}

/** A 400 carrying a `fields` map is the server telling a form what to mark. */
export const getFieldErrors = (error: unknown): FieldErrors | null => {
  if (!(error instanceof ApiError)) return null
  if (error.status !== 400) return null

  const fields = error.body?.fields
  return fields && Object.keys(fields).length > 0 ? fields : null
}

export const placementOf = (error: unknown): ErrorPlacement =>
  getFieldErrors(error) ? 'field' : 'global'

/** The keys this module can return, so `t()` stays key-checked at the call site. */
export type ErrorMessageKey =
  | 'errors.generic'
  | 'errors.validation'
  | 'errors.unauthorized'
  | 'errors.forbidden'
  | 'errors.notFound'
  | 'errors.conflict'

/**
 * Maps a failure onto a translation key. Components never parse a response
 * themselves; they read the status through this.
 */
export const errorMessageKey = (error: unknown): ErrorMessageKey => {
  if (!(error instanceof ApiError)) return 'errors.generic'

  switch (error.status) {
    case 400:
      return 'errors.validation'
    case 401:
      return 'errors.unauthorized'
    case 403:
      return 'errors.forbidden'
    case 404:
      return 'errors.notFound'
    case 409:
      return 'errors.conflict'
    default:
      return 'errors.generic'
  }
}

/**
 * A 409 is a refusal with a reason the server wrote for a human — "remove the
 * facilities in this country first". That sentence is more useful than the
 * generic key, so it wins when present.
 */
export const errorDetail = (error: unknown): string | null => {
  if (!(error instanceof ApiError)) return null
  if (error.status !== 409 && error.status !== 403) return null
  return error.body?.message ?? null
}
