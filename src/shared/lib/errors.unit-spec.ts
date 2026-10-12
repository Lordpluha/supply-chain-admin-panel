import { describe, expect, it } from 'vitest'
import { ApiError } from '@/shared/api'
import { errorDetail, errorMessageKey, getFieldErrors, placementOf } from './errors'

describe('getFieldErrors', () => {
  it('reads the map a 400 carries', () => {
    const error = new ApiError(400, 'Validation failed', {
      message: 'Validation failed',
      fields: { name: 'Too short' },
    })

    expect(getFieldErrors(error)).toEqual({ name: 'Too short' })
  })

  /** Only a 400 speaks about fields; a 409 refuses the whole operation. */
  it('ignores a fields map on any other status', () => {
    const error = new ApiError(409, 'Conflict', {
      message: 'Validation failed',
      fields: { name: 'Too short' },
    })

    expect(getFieldErrors(error)).toBeNull()
  })

  it('returns null for an empty map, so a caller does not report nothing', () => {
    expect(
      getFieldErrors(
        new ApiError(400, 'Validation failed', { message: 'Validation failed', fields: {} }),
      ),
    ).toBeNull()
  })

  it('returns null for anything that is not an ApiError', () => {
    expect(getFieldErrors(new Error('boom'))).toBeNull()
    expect(getFieldErrors('boom')).toBeNull()
  })
})

describe('placementOf', () => {
  /**
   * The decision the module exists to make once: a message that names a field
   * goes beside that field, and everything else becomes a toast.
   */
  it('sends a field-level failure to the field', () => {
    const error = new ApiError(400, 'Validation failed', {
      message: 'Validation failed',
      fields: { name: 'Too short' },
    })

    expect(placementOf(error)).toBe('field')
  })

  it.each([401, 403, 404, 409, 500])('sends a %i to the toast', status => {
    expect(placementOf(new ApiError(status, 'Failed'))).toBe('global')
  })

  it('sends a thrown Error to the toast', () => {
    expect(placementOf(new Error('boom'))).toBe('global')
  })
})

describe('errorMessageKey', () => {
  it.each([
    [400, 'errors.validation'],
    [401, 'errors.unauthorized'],
    [403, 'errors.forbidden'],
    [404, 'errors.notFound'],
    [409, 'errors.conflict'],
    [500, 'errors.generic'],
    [418, 'errors.generic'],
  ] as const)('maps %i onto %s', (status, key) => {
    expect(errorMessageKey(new ApiError(status, 'Failed'))).toBe(key)
  })

  it('falls back to the generic key for anything else', () => {
    expect(errorMessageKey(new Error('boom'))).toBe('errors.generic')
    expect(errorMessageKey(undefined)).toBe('errors.generic')
  })
})

describe('errorDetail', () => {
  /**
   * A 409 or 403 is a refusal with a reason the server wrote for a human, and
   * that sentence is more useful than the generic key.
   */
  it.each([403, 409])('returns the sentence a %i carries', status => {
    const error = new ApiError(status, 'Refused', {
      message: 'Remove the facilities in this country first',
    })

    expect(errorDetail(error)).toBe('Remove the facilities in this country first')
  })

  it('returns nothing for a status that carries no reason', () => {
    expect(errorDetail(new ApiError(500, 'Failed', { message: 'Internal' }))).toBeNull()
  })

  it('returns nothing when the body has no message', () => {
    expect(errorDetail(new ApiError(409, 'Conflict'))).toBeNull()
  })

  it('returns nothing for anything that is not an ApiError', () => {
    expect(errorDetail(new Error('boom'))).toBeNull()
  })
})
