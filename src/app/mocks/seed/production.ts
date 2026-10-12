import type { ProductionRecord } from '@/entities/production-record'
import { YEAR_MAX, YEAR_MIN } from '@/shared/config/constants'
import type { FacilitySeed } from './facilities'

export interface BuildProductionDeps {
  facilities: ReadonlyArray<FacilitySeed>
  hash: (value: string) => number
  mulberry32: (seed: number) => () => number
  slug: (value: string) => string
}

/** Ramp from ~35% of capacity in year one towards ~95% after a decade. */
const rampFactor = (age: number): number => Math.min(0.95, 0.35 + age * 0.07)

/**
 * Generates the fact table. Every value is a pure function of the facility and
 * product ids, so the dataset is byte-identical on every reload.
 */
export const buildProductionRecords = ({
  facilities,
  hash,
  mulberry32,
  slug,
}: BuildProductionDeps): Array<ProductionRecord> => {
  const records: Array<ProductionRecord> = []

  for (const facility of facilities) {
    const facilityId = slug(facility.name)

    for (const sku of facility.skus) {
      const productId = slug(sku)
      const random = mulberry32(hash(`${facilityId}:${productId}`))
      // Nameplate capacity is split across everything the site makes.
      const share = facility.capacity / facility.skus.length

      for (let year = YEAR_MIN; year <= YEAR_MAX; year += 1) {
        if (year < facility.since) continue

        const noise = 0.88 + random() * 0.24
        // An idle site is still on the map, but its last two years collapse.
        const idlePenalty = facility.status === 'idle' && year >= YEAR_MAX - 1 ? 0.25 : 1
        const value = Math.round(share * rampFactor(year - facility.since) * noise * idlePenalty)

        if (value <= 0) continue

        records.push({
          id: `${facilityId}__${productId}__${year}`,
          facilityId,
          productId,
          year,
          value,
        })
      }
    }
  }

  return records
}
