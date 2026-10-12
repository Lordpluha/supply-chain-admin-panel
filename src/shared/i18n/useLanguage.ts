import { useTranslation } from 'react-i18next'
import type { Language } from './config'
import { DEFAULT_LANGUAGE, isLanguage } from './config'

/**
 * The active language, **validated** — never a raw cast of `i18n.language`.
 *
 * A browser can report a tag this app does not ship, and commonly does: a
 * reader in Poland with an English UI sends `en-PL`. i18next resolves that to
 * the `en` bundle for text, but `Intl.NumberFormat('en-PL')` formats numbers
 * the Polish way, so the panel ends up showing English copy beside `2.541.796`.
 *
 * `resolvedLanguage` is what i18next actually loaded; the guard catches
 * anything else.
 */
export const useLanguage = (): Language => {
  const { i18n } = useTranslation()

  if (isLanguage(i18n.resolvedLanguage)) return i18n.resolvedLanguage
  if (isLanguage(i18n.language)) return i18n.language
  return DEFAULT_LANGUAGE
}
