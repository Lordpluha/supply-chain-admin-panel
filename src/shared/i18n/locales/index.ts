import { de } from './de'
import type { Translation } from './en'
import { en } from './en'
import { fr } from './fr'
import { pl } from './pl'

/**
 * Every locale, eagerly.
 *
 * **Not for the application.** The app loads one dictionary and fetches the
 * others on a language change — four bundles in the entry chunk is four times
 * the copy a reader will ever see. This exists for tests and for Storybook,
 * where switching language has to be synchronous and the cost is nobody's.
 */
export const allResources = {
  en: { translation: en },
  de: { translation: de },
  fr: { translation: fr },
  pl: { translation: pl },
} satisfies Record<string, { translation: Translation }>
