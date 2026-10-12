import { admin } from './admin'
import { auth } from './auth'
import { catalogue } from './catalogue'
import { dashboard } from './dashboard'
import { ui } from './ui'

const dictionary = {
  ...ui,
  ...auth,
  ...dashboard,
  ...catalogue,
  ...admin,
}

/**
 * The key structure comes from English; the value types are widened to `string`.
 *
 * Without the widening, `typeof dictionary` would carry each English sentence as
 * a literal type and `const de: Translation` would demand the English wording.
 * With it, a missing key, a typo, or an extra key in any other locale is a
 * compile error — which is the whole point of deriving the type from one file.
 */
type LocaleShape<T> = {
  -readonly [K in keyof T]: T[K] extends string ? string : LocaleShape<T[K]>
}

export type Translation = LocaleShape<typeof dictionary>

export const en: Translation = dictionary
