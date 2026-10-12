import type { ProductionRecord } from '@/entities/production-record'
import { YEAR_MAX, YEAR_MIN } from '@/shared/config/constants'
import { db } from '../../db'

export interface AnalyticsFilterSet {
  countryId?: string
  productId?: string
  facilityId?: string
  yearFrom: number
  yearTo: number
}

export const readFilters = (url: URL): AnalyticsFilterSet => ({
  countryId: url.searchParams.get('countryId') ?? undefined,
  productId: url.searchParams.get('productId') ?? undefined,
  facilityId: url.searchParams.get('facilityId') ?? undefined,
  yearFrom: Number(url.searchParams.get('yearFrom') ?? YEAR_MIN),
  yearTo: Number(url.searchParams.get('yearTo') ?? YEAR_MAX),
})

export const selectRecords = (filters: AnalyticsFilterSet): Array<ProductionRecord> => {
  const facilityCountry = new Map(db.facilities.all().map(f => [f.id, f.countryId]))

  return db.records.all().filter(record => {
    if (record.year < filters.yearFrom || record.year > filters.yearTo) return false
    if (filters.productId && record.productId !== filters.productId) return false
    if (filters.facilityId && record.facilityId !== filters.facilityId) return false
    if (filters.countryId && facilityCountry.get(record.facilityId) !== filters.countryId) {
      return false
    }
    return true
  })
}

/**
 * `'mixed'` as soon as more than one product is in scope: tonnes of lithium and
 * millions of cells do not add up, so no grand total is offered for them.
 */
export const resolveUnit = (productIds: ReadonlySet<string>): string => {
  if (productIds.size !== 1) return 'mixed'
  const [only] = [...productIds]
  return db.products.find(only)?.unit ?? 'mixed'
}
