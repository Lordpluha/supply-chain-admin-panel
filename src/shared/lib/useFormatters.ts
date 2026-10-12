import { useMemo } from 'react'
import type { Currency } from '@/shared/config/currency'
import type { Language } from '@/shared/i18n'
import { useLanguage } from '@/shared/i18n'
import { useEffectiveTimeZone, usePreferencesStore } from '@/shared/store/preferencesStore'
import {
  formatCompact,
  formatCurrency,
  formatCurrencyCompact,
  formatDate,
  formatDateTime,
  formatNumber,
  formatPercent,
  formatQuantity,
} from './format'

export interface Formatters {
  locale: Language
  timeZone: string
  currency: Currency
  number: (value: number) => string
  compact: (value: number) => string
  percent: (ratio: number) => string
  quantity: (value: number, unit: string) => string
  currencyOf: (baseAmount: number) => string
  currencyCompact: (baseAmount: number) => string
  date: (iso: string) => string
  dateTime: (iso: string) => string
}

/**
 * Binds the three things every formatted value depends on — the UI language,
 * the reader's time zone, and their chosen currency — so a component calls
 * `fmt.dateTime(row.createdAt)` instead of threading all three through by hand
 * and getting one of them wrong.
 */
export const useFormatters = (): Formatters => {
  const locale = useLanguage()
  const timeZone = useEffectiveTimeZone()
  const currency = usePreferencesStore(state => state.currency)

  return useMemo(
    () => ({
      locale,
      timeZone,
      currency,
      number: value => formatNumber(value, locale),
      compact: value => formatCompact(value, locale),
      percent: ratio => formatPercent(ratio, locale),
      quantity: (value, unit) => formatQuantity(value, unit, locale),
      currencyOf: baseAmount => formatCurrency(baseAmount, locale, currency),
      currencyCompact: baseAmount => formatCurrencyCompact(baseAmount, locale, currency),
      date: iso => formatDate(iso, locale, timeZone),
      dateTime: iso => formatDateTime(iso, locale, timeZone),
    }),
    [currency, locale, timeZone],
  )
}
