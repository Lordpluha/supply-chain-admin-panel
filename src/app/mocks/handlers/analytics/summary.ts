import type {
  ProductionBreakdownItem,
  ProductionSeriesPoint,
  ProductionSummary,
} from '@/entities/production-record'
import { sorted } from '@/shared/lib/array'
import { db } from '../../db'
import type { AnalyticsFilterSet } from './filters'
import { resolveUnit, selectRecords } from './filters'

interface BreakdownFields {
  label: (id: string) => string
  unit: (id: string) => string
  value: (id: string, total: number) => number
}

const toBreakdown = (
  totals: ReadonlyMap<string, number>,
  fields: BreakdownFields,
): Array<ProductionBreakdownItem> => {
  const grand = [...totals.values()].reduce((sum, value) => sum + value, 0)

  const items = [...totals.entries()].map(([id, total]) => ({
    id,
    label: fields.label(id),
    total,
    unit: fields.unit(id),
    share: grand > 0 ? total / grand : 0,
    value: fields.value(id, total),
  }))

  // Ranked by worth, not by volume: 400 M cells outranks 90 000 t of lithium,
  // and a reader comparing a mixed set wants the money order.
  return sorted(items, (a, b) => b.value - a.value)
}

export const buildSummary = (filters: AnalyticsFilterSet): ProductionSummary => {
  const records = selectRecords(filters)
  const facilities = new Map(db.facilities.all().map(f => [f.id, f]))

  const byYear = new Map<number, number>()
  const byProduct = new Map<string, number>()
  const byCountry = new Map<string, number>()
  const valueByCountry = new Map<string, number>()
  const facilityIds = new Set<string>()
  const productIds = new Set<string>()
  const countryIds = new Set<string>()

  let total = 0
  let totalValue = 0

  for (const record of records) {
    const facility = facilities.get(record.facilityId)
    if (!facility) continue

    const unitPrice = db.products.find(record.productId)?.unitPrice ?? 0
    const worth = record.value * unitPrice

    total += record.value
    totalValue += worth
    valueByCountry.set(facility.countryId, (valueByCountry.get(facility.countryId) ?? 0) + worth)
    facilityIds.add(facility.id)
    productIds.add(record.productId)
    countryIds.add(facility.countryId)

    byYear.set(record.year, (byYear.get(record.year) ?? 0) + record.value)
    byProduct.set(record.productId, (byProduct.get(record.productId) ?? 0) + record.value)
    byCountry.set(facility.countryId, (byCountry.get(facility.countryId) ?? 0) + record.value)
  }

  const series: Array<ProductionSeriesPoint> = []
  for (let year = filters.yearFrom; year <= filters.yearTo; year += 1) {
    series.push({ year, total: byYear.get(year) ?? 0 })
  }

  // Growth is measured between the first and last years that actually reported,
  // not the filter bounds — otherwise a range starting before a site existed
  // always reads as infinite growth.
  const reporting = series.filter(point => point.total > 0)
  const first = reporting.at(0)
  const last = reporting.at(-1)
  const peakYear = reporting.reduce<ProductionSeriesPoint | null>(
    (best, point) => (best === null || point.total > best.total ? point : best),
    null,
  )

  const unit = resolveUnit(productIds)

  return {
    total,
    unit,
    totalValue,
    countryCount: countryIds.size,
    productCount: productIds.size,
    facilityCount: facilityIds.size,
    recordCount: records.length,
    yearFrom: filters.yearFrom,
    yearTo: filters.yearTo,
    peakYear,
    growth:
      first && last && first.total > 0 && first !== last
        ? (last.total - first.total) / first.total
        : null,
    series,
    byProduct: toBreakdown(byProduct, {
      label: id => db.products.find(id)?.name ?? id,
      unit: id => db.products.find(id)?.unit ?? '',
      value: (id, subtotal) => subtotal * (db.products.find(id)?.unitPrice ?? 0),
    }),
    byCountry: toBreakdown(byCountry, {
      label: id => db.countries.find(id)?.name ?? id,
      unit: () => unit,
      value: id => valueByCountry.get(id) ?? 0,
    }),
  }
}
