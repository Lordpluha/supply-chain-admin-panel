import type { Translation } from './locales/en'

/**
 * Makes `t()` key-safe. Every key is derived from the English dictionary, so
 * `t('common.svae')` is a compile error and editors autocomplete the real keys.
 */
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: {
      translation: Translation
    }
    /** `t()` returns `string`, never `string | null`. */
    returnNull: false
  }
}
