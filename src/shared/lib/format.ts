import type { Currency } from '@/shared/config/currency'
import { convertFromBase } from '@/shared/config/currency'
import type { Language } from '@/shared/i18n'

/**
 * Formatters are cached: constructing an `Intl.NumberFormat` is measurably
 * expensive and a table renders hundreds of cells per page.
 */
const numberCache = new Map<string, Intl.NumberFormat>()
const dateCache = new Map<string, Intl.DateTimeFormat>()

const numberFormatter = (locale: Language, options: Intl.NumberFormatOptions = {}) => {
  const key = `${locale}:${JSON.stringify(options)}`
  let formatter = numberCache.get(key)
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, options)
    numberCache.set(key, formatter)
  }
  return formatter
}

const dateFormatter = (locale: Language, options: Intl.DateTimeFormatOptions) => {
  const key = `${locale}:${JSON.stringify(options)}`
  let formatter = dateCache.get(key)
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, options)
    dateCache.set(key, formatter)
  }
  return formatter
}

export const formatNumber = (value: number, locale: Language): string =>
  numberFormatter(locale, { maximumFractionDigits: 0 }).format(value)

/** Compact form for map tooltips and stat tiles: `1,2 Mio.` in German, `1.2M` in English. */
export const formatCompact = (value: number, locale: Language): string =>
  numberFormatter(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(value)

export const formatPercent = (ratio: number, locale: Language): string =>
  numberFormatter(locale, {
    style: 'percent',
    maximumFractionDigits: 1,
    signDisplay: 'exceptZero',
  }).format(ratio)

/**
 * Takes an amount in the base currency and renders it in the reader's chosen
 * one. Conversion happens here rather than at the call site so the rate is
 * applied exactly once.
 */
export const formatCurrency = (baseAmount: number, locale: Language, currency: Currency): string =>
  numberFormatter(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(convertFromBase(baseAmount, currency))

export const formatCurrencyCompact = (
  baseAmount: number,
  locale: Language,
  currency: Currency,
): string =>
  numberFormatter(locale, {
    style: 'currency',
    currency,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(convertFromBase(baseAmount, currency))

/**
 * Dates always render in the reader's locale and zone. A timestamp shown in
 * the server's zone is a support ticket waiting to happen.
 */
export const formatDateTime = (iso: string, locale: Language, timeZone: string): string =>
  dateFormatter(locale, { dateStyle: 'medium', timeStyle: 'short', timeZone }).format(new Date(iso))

export const formatDate = (iso: string, locale: Language, timeZone: string): string =>
  dateFormatter(locale, { dateStyle: 'medium', timeZone }).format(new Date(iso))

/** Shows the offset, so an operator reading another region's data knows which clock it is. */
export const formatTimeZoneLabel = (timeZone: string, locale: Language): string => {
  const parts = dateFormatter(locale, { timeZone, timeZoneName: 'shortOffset' }).formatToParts(
    new Date(),
  )
  const offset = parts.find(part => part.type === 'timeZoneName')?.value ?? ''
  return offset ? `${timeZone.replace(/_/g, ' ')} (${offset})` : timeZone.replace(/_/g, ' ')
}

/**
 * A quantity and its unit. The unit is a domain string (`t`, `km²`, `M cells`),
 * not something `Intl` knows, so it is appended rather than formatted.
 */
export const formatQuantity = (value: number, unit: string, locale: Language): string =>
  unit ? `${formatNumber(value, locale)} ${unit}` : formatNumber(value, locale)
