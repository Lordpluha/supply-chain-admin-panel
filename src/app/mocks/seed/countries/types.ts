import type { CountryRegion } from '@/entities/country'

export interface CountrySeed {
  iso2: string
  iso3: string
  /** ISO 3166-1 numeric — how `world-atlas` keys its TopoJSON features. */
  isoNumeric: string
  name: string
  region: CountryRegion
  lat: number
  lng: number
}
