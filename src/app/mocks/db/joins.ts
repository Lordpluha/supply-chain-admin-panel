import type { Facility } from '@/entities/facility'
import type { ProductionRecord } from '@/entities/production-record'

/**
 * The joins behind mutual filtering: asking for the countries that produce a
 * product, or the products a country produces, walks
 * `records → facilities → countries`.
 *
 * These take the rows explicitly rather than reaching for the `db` singleton,
 * which keeps them pure, testable, and free of an import cycle with the
 * collections that call them.
 */

export const facilityIdsForProduct = (
  records: ReadonlyArray<ProductionRecord>,
  productId: string,
): Set<string> => {
  const ids = new Set<string>()
  for (const record of records) {
    if (record.productId === productId) ids.add(record.facilityId)
  }
  return ids
}

export const facilityIdsInCountry = (
  facilities: ReadonlyArray<Facility>,
  countryId: string,
): Set<string> => {
  const ids = new Set<string>()
  for (const facility of facilities) {
    if (facility.countryId === countryId) ids.add(facility.id)
  }
  return ids
}

export const countryIdsForProduct = (
  records: ReadonlyArray<ProductionRecord>,
  facilities: ReadonlyArray<Facility>,
  productId: string,
): Set<string> => {
  const facilityIds = facilityIdsForProduct(records, productId)
  const ids = new Set<string>()
  for (const facility of facilities) {
    if (facilityIds.has(facility.id)) ids.add(facility.countryId)
  }
  return ids
}

export const productIdsForCountry = (
  records: ReadonlyArray<ProductionRecord>,
  facilities: ReadonlyArray<Facility>,
  countryId: string,
): Set<string> => {
  const facilityIds = facilityIdsInCountry(facilities, countryId)
  const ids = new Set<string>()
  for (const record of records) {
    if (facilityIds.has(record.facilityId)) ids.add(record.productId)
  }
  return ids
}

export const productIdsAtFacility = (
  records: ReadonlyArray<ProductionRecord>,
  facilityId: string,
): Set<string> => {
  const ids = new Set<string>()
  for (const record of records) {
    if (record.facilityId === facilityId) ids.add(record.productId)
  }
  return ids
}
