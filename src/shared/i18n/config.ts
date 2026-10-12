import type { Translation } from './locales/en'
import { en } from './locales/en'

export const LANGUAGES = ['en', 'de', 'fr', 'pl'] as const

export type Language = (typeof LANGUAGES)[number]

export const DEFAULT_LANGUAGE: Language = 'en'

/** The query parameter that carries the language, so a shared link keeps it. */
export const LANGUAGE_QUERY_KEY = 'lang'

export const LANGUAGE_STORAGE_KEY = 'supply-chain.language'

/**
 * Only English is bundled.
 *
 * It is the fallback, so it is needed whatever the reader's language — and
 * shipping the other three alongside it put four dictionaries in the entry
 * chunk to render one. The rest arrive through `LOCALE_LOADERS`, on demand.
 */
export const baseResources = {
  en: { translation: en },
} satisfies Record<'en', { translation: Translation }>

/**
 * One dynamic import per language, so each becomes its own chunk and none is
 * fetched until somebody actually reads in it.
 */
export const LOCALE_LOADERS: Record<
  Exclude<Language, 'en'>,
  () => Promise<{ translation: Translation }>
> = {
  de: async () => ({ translation: (await import('./locales/de')).de }),
  fr: async () => ({ translation: (await import('./locales/fr')).fr }),
  pl: async () => ({ translation: (await import('./locales/pl')).pl }),
}

export const isLanguage = (value: unknown): value is Language =>
  typeof value === 'string' && (LANGUAGES as ReadonlyArray<string>).includes(value)
