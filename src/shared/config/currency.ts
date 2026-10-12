export const CURRENCIES = ['EUR', 'USD', 'PLN', 'CHF'] as const

export type Currency = (typeof CURRENCIES)[number]

export const BASE_CURRENCY: Currency = 'EUR'

/**
 * Fixed rates against the base currency.
 *
 * These are **mock** values, frozen so the dataset stays deterministic. A real
 * deployment would take them from a rates service and stamp each figure with
 * the date it was converted on; the UI labels every converted number as
 * indicative so nobody mistakes one for a settled amount.
 */
export const FX_RATES: Readonly<Record<Currency, number>> = {
  EUR: 1,
  USD: 1.09,
  PLN: 4.32,
  CHF: 0.95,
}

export const convertFromBase = (amount: number, currency: Currency): number =>
  amount * FX_RATES[currency]

/**
 * The symbol shown beside a currency in the settings list.
 *
 * Deliberately a table rather than `Intl.NumberFormat(...).formatToParts()`:
 * that returns whatever the *reader's* locale uses, so an English reader is
 * shown `PLN` and only a Polish one sees `zł`. The symbol here is a label for
 * the currency itself and should not move with the interface language.
 *
 * `CHF` has no symbol in common use — the code is the symbol.
 */
export const CURRENCY_SYMBOLS: Readonly<Record<Currency, string>> = {
  EUR: '€',
  USD: '$',
  PLN: 'zł',
  CHF: 'CHF',
}
