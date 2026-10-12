import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import type { Language } from './config'
import {
  baseResources,
  DEFAULT_LANGUAGE,
  isLanguage,
  LANGUAGE_QUERY_KEY,
  LANGUAGE_STORAGE_KEY,
  LANGUAGES,
  LOCALE_LOADERS,
} from './config'

export type { Language } from './config'
export {
  DEFAULT_LANGUAGE,
  isLanguage,
  LANGUAGE_QUERY_KEY,
  LANGUAGE_STORAGE_KEY,
  LANGUAGES,
} from './config'
export type { Translation } from './locales/en'
export { useLanguage } from './useLanguage'

/**
 * Initialised before the first render so no component ever sees a raw key.
 * Detection order puts the URL first: a pasted link must open in the language
 * it was shared in, whatever the reader's browser prefers.
 */
export const initI18n = async (): Promise<typeof i18next> => {
  if (i18next.isInitialized) return i18next

  await i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: baseResources,
      // English is bundled; the rest are fetched, so i18next must not treat a
      // language it has no bundle for as a missing language.
      partialBundledLanguages: true,
      fallbackLng: DEFAULT_LANGUAGE,
      supportedLngs: [...LANGUAGES],
      // Every locale is complete and type-checked, so a partial match like
      // `de-AT` should resolve to `de` rather than falling back to English.
      load: 'languageOnly',
      nonExplicitSupportedLngs: true,
      returnNull: false,
      interpolation: {
        // React escapes for us; escaping twice mangles apostrophes in French.
        escapeValue: false,
      },
      detection: {
        order: ['querystring', 'localStorage', 'navigator'],
        lookupQuerystring: LANGUAGE_QUERY_KEY,
        lookupLocalStorage: LANGUAGE_STORAGE_KEY,
        caches: ['localStorage'],
      },
    })

  // Whatever the detector settled on has to be there before the first render,
  // or the panel paints in English and corrects itself a frame later.
  await loadLanguage(i18next, i18next.language)

  return i18next
}

/**
 * Fetches a language's dictionary into an instance if it is not already there.
 *
 * Takes the instance rather than reaching for the singleton: tests and
 * Storybook run their own, pre-loaded with every locale, and this has to be a
 * no-op for them rather than quietly operating on a different i18next.
 *
 * Idempotent, and a no-op for English and for anything unrecognised — a
 * `de-AT` resolves to `de`, matching `load: 'languageOnly'` above.
 */
export const loadLanguage = async (instance: typeof i18next, language: string): Promise<void> => {
  const code = language.split('-')[0]

  // Narrowed to the fetchable three: English is bundled, so it has no loader.
  if (!isLanguage(code) || code === DEFAULT_LANGUAGE) return
  if (instance.hasResourceBundle(code, 'translation')) return

  const { translation } = await LOCALE_LOADERS[code as Exclude<Language, 'en'>]()
  instance.addResourceBundle(code, 'translation', translation, true, true)
}

/**
 * Switches language, dictionary first.
 *
 * Calling `changeLanguage` on its own would switch to a language the instance
 * has no bundle for and render every key in English until the fetch lands.
 */
export const changeLanguage = async (instance: typeof i18next, language: string): Promise<void> => {
  await loadLanguage(instance, language)
  await instance.changeLanguage(language)
}

export { default as i18n } from 'i18next'
