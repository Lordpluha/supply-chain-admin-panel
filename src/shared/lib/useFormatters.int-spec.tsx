import { act, cleanup, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { usePreferencesStore } from '@/shared/store/preferencesStore'
import { Providers, testI18n } from './test-utils'
import { useFormatters } from './useFormatters'

const wrapper = ({ children }: { children: ReactNode }) => <Providers>{children}</Providers>

const withPreferences = (currency: 'EUR' | 'PLN' | 'CHF', timeZone = 'UTC') => {
  act(() => usePreferencesStore.setState({ currency, timeZone }))
}

afterEach(async () => {
  cleanup()
  usePreferencesStore.setState({ currency: 'EUR', timeZone: 'UTC' })
  await testI18n.changeLanguage('en')
})

describe('useFormatters', () => {
  it('reports the settings it is formatting against', () => {
    withPreferences('EUR')

    const { result } = renderHook(() => useFormatters(), { wrapper })

    expect(result.current.locale).toBe('en')
    expect(result.current.currency).toBe('EUR')
    expect(result.current.timeZone).toBe('UTC')
  })

  /** Whole units only: the panel deals in tonnes and cells, not fractions. */
  it('groups a number the way the active language does', () => {
    const { result } = renderHook(() => useFormatters(), { wrapper })

    expect(result.current.number(1234.5)).toBe('1,235')
    expect(result.current.number(411_326)).toBe('411,326')
  })

  /**
   * A German reader expects `1.234,5`. Hand-formatting would give every reader
   * the same string, which is wrong for most of them.
   */
  it('follows the language when it changes', async () => {
    const { result } = renderHook(() => useFormatters(), { wrapper })

    await act(async () => {
      await testI18n.changeLanguage('de')
    })

    expect(result.current.locale).toBe('de')
    expect(result.current.number(411_326)).toBe('411.326')
  })

  it('writes a quantity with its unit', () => {
    const { result } = renderHook(() => useFormatters(), { wrapper })

    expect(result.current.quantity(22000, 't')).toContain('t')
    expect(result.current.quantity(22000, 't')).toContain('22,000')
  })

  it('signs a percentage, because the direction is the point', () => {
    const { result } = renderHook(() => useFormatters(), { wrapper })

    expect(result.current.percent(0.42)).toContain('42')
  })

  /**
   * Converted once, here, rather than at each call site — and rendered by
   * `Intl` in the reader's own locale, so an English reader sees `PLN` and a
   * Polish one `zł`. The explicit symbol table is a label for the *setting*,
   * not for the amount; see `shared/config/currency.ts`.
   */
  it('converts into the chosen currency and names it', () => {
    const { result } = renderHook(() => useFormatters(), { wrapper })

    expect(result.current.currencyOf(1000)).toContain('€')
    expect(result.current.currencyOf(1000)).toContain('1,000')

    withPreferences('PLN')

    expect(result.current.currency).toBe('PLN')
    expect(result.current.currencyOf(1000)).toContain('PLN')
    // Converted at the fixed rate, so it is no longer the base amount.
    expect(result.current.currencyOf(1000)).not.toContain('1,000')
  })

  it('renders a timestamp in the chosen zone', () => {
    withPreferences('EUR', 'UTC')

    const { result } = renderHook(() => useFormatters(), { wrapper })

    expect(result.current.date('2026-09-19T12:00:00.000Z')).toContain('2026')
  })

  it('keeps the same object while nothing it depends on changes', () => {
    const { result, rerender } = renderHook(() => useFormatters(), { wrapper })
    const first = result.current

    rerender()

    expect(result.current).toBe(first)
  })
})
