import { describe, expect, it } from 'vitest'
import {
  formatCurrency,
  formatDateTime,
  formatNumber,
  formatPercent,
  formatQuantity,
  formatTimeZoneLabel,
} from './format'

// 2026-09-19T21:30:00Z — deliberately late enough in the day that a zone shift
// moves it across midnight.
const ISO = '2026-09-19T21:30:00.000Z'

describe('formatNumber', () => {
  it('uses the separators each locale expects', () => {
    expect(formatNumber(92_000, 'en')).toBe('92,000')
    expect(formatNumber(92_000, 'de')).toBe('92.000')
    expect(formatNumber(92_000, 'pl')).toBe('92 000'.replace(' ', ' '))
  })
})

describe('formatDateTime', () => {
  it('renders the same instant in the reader’s zone', () => {
    const utc = formatDateTime(ISO, 'en', 'UTC')
    const tokyo = formatDateTime(ISO, 'en', 'Asia/Tokyo')

    expect(utc).toContain('Sep 19')
    // +09:00 pushes it past midnight — the date itself changes, which is the
    // whole reason the zone is a setting.
    expect(tokyo).toContain('Sep 20')
    expect(utc).not.toBe(tokyo)
  })

  it('orders the parts the way the locale does', () => {
    // German `medium` is numeric and day-first; English leads with the month.
    expect(formatDateTime(ISO, 'de', 'Europe/Berlin')).toMatch(/^19\.09\.2026/)
    expect(formatDateTime(ISO, 'en', 'Europe/Berlin')).toMatch(/^Sep 19, 2026/)
    // Polish is day-first too, but with a different separator again.
    expect(formatDateTime(ISO, 'pl', 'Europe/Warsaw')).toMatch(/^19 wrz 2026/)
  })
})

describe('formatTimeZoneLabel', () => {
  it('names the zone and its current offset', () => {
    expect(formatTimeZoneLabel('Europe/Warsaw', 'en')).toContain('Europe/Warsaw')
    expect(formatTimeZoneLabel('Europe/Warsaw', 'en')).toMatch(/GMT[+-]\d/)
  })
})

describe('formatCurrency', () => {
  it('converts from the base currency before formatting', () => {
    // 1000 EUR at the fixed 4.32 rate.
    expect(formatCurrency(1000, 'en', 'PLN')).toContain('4,320')
    expect(formatCurrency(1000, 'en', 'EUR')).toContain('1,000')
  })

  it('places the symbol where the locale does', () => {
    expect(formatCurrency(1000, 'en', 'USD').startsWith('$')).toBe(true)
    expect(formatCurrency(1000, 'de', 'EUR').endsWith('€')).toBe(true)
  })
})

describe('formatPercent and formatQuantity', () => {
  it('always signs a change', () => {
    expect(formatPercent(0.124, 'en')).toBe('+12.4%')
    expect(formatPercent(-0.5, 'en')).toBe('-50%')
  })

  it('appends the domain unit untouched', () => {
    expect(formatQuantity(92_000, 't', 'en')).toBe('92,000 t')
    expect(formatQuantity(410, 'km²', 'en')).toBe('410 km²')
    expect(formatQuantity(5, '', 'en')).toBe('5')
  })
})
