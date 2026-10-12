import type { ProductionPoint, ProductionPointProduct } from '@/entities/production-record'
import { sorted } from '@/shared/lib/array'
import { db } from '../../db'
import type { AnalyticsFilterSet } from './filters'
import { resolveUnit, selectRecords } from './filters'

/** How many products a map tooltip names before it stops being readable. */
const TOP_PRODUCTS = 3

interface CountryAggregate {
  total: number
  value: number
  facilityIds: Set<string>
  byProduct: Map<string, number>
  firstYear: number
  lastYear: number
}

const emptyAggregate = (): CountryAggregate => ({
  total: 0,
  value: 0,
  facilityIds: new Set(),
  byProduct: new Map(),
  firstYear: Number.POSITIVE_INFINITY,
  lastYear: Number.NEGATIVE_INFINITY,
})

/**
 * Scales each product's contribution against that product's own maximum before
 * summing, so a country making 90 000 t of lithium does not drown out one
 * making 400 M cells. With a single product selected this reduces to
 * `total / max`, which is what you would have written anyway.
 */
const computeIntensities = (
  perCountryProduct: ReadonlyMap<string, Map<string, number>>,
): Map<string, number> => {
  const productMax = new Map<string, number>()

  for (const products of perCountryProduct.values()) {
    for (const [productId, total] of products) {
      productMax.set(productId, Math.max(productMax.get(productId) ?? 0, total))
    }
  }

  const scores = new Map<string, number>()
  for (const [countryId, products] of perCountryProduct) {
    let score = 0
    for (const [productId, total] of products) {
      const max = productMax.get(productId) ?? 0
      if (max > 0) score += total / max
    }
    scores.set(countryId, score)
  }

  const maxScore = Math.max(...scores.values(), 0)
  if (maxScore === 0) return scores

  return new Map([...scores].map(([countryId, score]) => [countryId, score / maxScore]))
}

const topProductsOf = (byProduct: ReadonlyMap<string, number>): Array<ProductionPointProduct> =>
  sorted([...byProduct.entries()], (a, b) => b[1] - a[1])
    .slice(0, TOP_PRODUCTS)
    .map(([productId, total]) => {
      const product = db.products.find(productId)
      return {
        id: productId,
        name: product?.name ?? productId,
        total,
        unit: product?.unit ?? '',
      }
    })

const aggregate = (filters: AnalyticsFilterSet) => {
  const facilities = new Map(db.facilities.all().map(facility => [facility.id, facility]))
  const byCountry = new Map<string, CountryAggregate>()
  const productIds = new Set<string>()

  for (const record of selectRecords(filters)) {
    const facility = facilities.get(record.facilityId)
    if (!facility) continue

    const entry = byCountry.get(facility.countryId) ?? emptyAggregate()
    const unitPrice = db.products.find(record.productId)?.unitPrice ?? 0

    entry.total += record.value
    entry.value += record.value * unitPrice
    entry.facilityIds.add(facility.id)
    entry.byProduct.set(
      record.productId,
      (entry.byProduct.get(record.productId) ?? 0) + record.value,
    )
    entry.firstYear = Math.min(entry.firstYear, record.year)
    entry.lastYear = Math.max(entry.lastYear, record.year)

    byCountry.set(facility.countryId, entry)
    productIds.add(record.productId)
  }

  return { byCountry, productIds }
}

export const buildPoints = (filters: AnalyticsFilterSet): Array<ProductionPoint> => {
  const { byCountry, productIds } = aggregate(filters)

  const intensities = computeIntensities(
    new Map([...byCountry].map(([countryId, entry]) => [countryId, entry.byProduct])),
  )
  const unit = resolveUnit(productIds)

  // Share is taken by value, not by quantity: it is the one denominator that
  // still means something when the units are mixed.
  const grandValue = [...byCountry.values()].reduce((sum, entry) => sum + entry.value, 0)

  const points = [...byCountry.entries()].flatMap<ProductionPoint>(([countryId, entry]) => {
    const country = db.countries.find(countryId)
    if (!country) return []

    return [
      {
        countryId,
        countryName: country.name,
        iso2: country.iso2,
        isoNumeric: country.isoNumeric,
        region: country.region,
        lat: country.lat,
        lng: country.lng,
        total: entry.total,
        unit,
        facilityCount: entry.facilityIds.size,
        intensity: intensities.get(countryId) ?? 0,
        value: entry.value,
        share: grandValue > 0 ? entry.value / grandValue : 0,
        firstYear: Number.isFinite(entry.firstYear) ? entry.firstYear : filters.yearFrom,
        lastYear: Number.isFinite(entry.lastYear) ? entry.lastYear : filters.yearTo,
        topProducts: topProductsOf(entry.byProduct),
      },
    ]
  })

  return sorted(points, (a, b) => b.intensity - a.intensity)
}
