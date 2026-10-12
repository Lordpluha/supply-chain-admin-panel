import type { FacilityKind, FacilityStatus } from '@/entities/facility'

export interface FacilitySeed {
  name: string
  iso2: string
  lat: number
  lng: number
  /** Nameplate capacity per year, in the unit of what the site makes. */
  capacity: number
  status: FacilityStatus
  /** What kind of site it is — mine, refinery, plant, and so on. */
  kind: FacilityKind
  /** First year the site reported output — what makes the year filter meaningful. */
  since: number
  skus: ReadonlyArray<string>
}
