import { AFRICA_OCEANIA_COUNTRIES } from './africaOceania'
import { AMERICAS_COUNTRIES } from './americas'
import { ASIA_COUNTRIES } from './asia'
import { EUROPE_COUNTRIES } from './europe'
import type { CountrySeed } from './types'

export type { CountrySeed } from './types'

export const COUNTRY_SEED: ReadonlyArray<CountrySeed> = [
  ...ASIA_COUNTRIES,
  ...AMERICAS_COUNTRIES,
  ...EUROPE_COUNTRIES,
  ...AFRICA_OCEANIA_COUNTRIES,
]
