import { describe, expect, it } from 'vitest'
import { flagFor, UNKNOWN_GLYPH } from './flag'

describe('flagFor', () => {
  it('builds the flag from regional indicators', () => {
    expect(flagFor('DE')).toBe('🇩🇪')
    expect(flagFor('CL')).toBe('🇨🇱')
  })

  it('accepts a lower-case code', () => {
    expect(flagFor('de')).toBe('🇩🇪')
  })

  /**
   * A missing or malformed code shows as unknown rather than rendering two
   * stray letter blocks that look like data.
   */
  it.each([undefined, null, '', 'D', 'DEU', '12', 'D1', '  '])(
    'falls back to the unknown glyph for %s',
    input => {
      expect(flagFor(input)).toBe(UNKNOWN_GLYPH)
    },
  )

  it('is two code points, which is what a flag is', () => {
    expect([...flagFor('DE')]).toHaveLength(2)
  })
})
