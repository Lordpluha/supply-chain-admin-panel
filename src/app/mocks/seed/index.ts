import type { Country } from '@/entities/country'
import type { Facility } from '@/entities/facility'
import type { Product } from '@/entities/product'
import type { ProductionRecord } from '@/entities/production-record'
import { COUNTRY_SEED } from './countries'
import { hash, mulberry32, slug } from './deterministic'
import { FACILITY_SEED } from './facilities'
import { buildProductionRecords } from './production'
import { PRODUCT_SEED } from './products'

export type { CountrySeed } from './countries'
export type { FacilitySeed } from './facilities'
export type { ProductSeed } from './products'

export interface SeedData {
  countries: Array<Country>
  products: Array<Product>
  facilities: Array<Facility>
  records: Array<ProductionRecord>
}

/**
 * Ids are readable slugs rather than uuids on purpose: they end up in the URL
 * through nuqs, so `?countryId=de&productId=nmc-811` stays shareable.
 */
export const createSeedData = (): SeedData => ({
  countries: COUNTRY_SEED.map(seed => ({
    id: seed.iso2.toLowerCase(),
    name: seed.name,
    iso2: seed.iso2,
    iso3: seed.iso3,
    isoNumeric: seed.isoNumeric,
    region: seed.region,
    lat: seed.lat,
    lng: seed.lng,
  })),

  products: PRODUCT_SEED.map(seed => ({
    id: slug(seed.sku),
    sku: seed.sku,
    name: seed.name,
    category: seed.category,
    unit: seed.unit,
    unitPrice: seed.unitPrice,
  })),

  facilities: FACILITY_SEED.map(seed => ({
    id: slug(seed.name),
    name: seed.name,
    countryId: seed.iso2.toLowerCase(),
    lat: seed.lat,
    lng: seed.lng,
    capacity: seed.capacity,
    status: seed.status,
    kind: seed.kind,
  })),

  records: buildProductionRecords({ facilities: FACILITY_SEED, hash, mulberry32, slug }),
})
