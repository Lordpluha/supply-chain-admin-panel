import type { AuditEntry } from '@/entities/audit-entry'
import type { Country } from '@/entities/country'
import type { Facility } from '@/entities/facility'
import type { Product } from '@/entities/product'
import type { ProductionRecord } from '@/entities/production-record'
import type { Role } from '@/entities/role'
import type { User } from '@/entities/user'
import type { Collection } from '../collection'
import { createCollection } from '../collection'
import { createSeedData } from '../seed'
import { ROLE_SEED, USER_SEED } from '../seedAccess'
import {
  countryIdsForProduct,
  facilityIdsForProduct,
  productIdsAtFacility,
  productIdsForCountry,
} from './joins'

const seed = createSeedData()

export interface MockDb {
  countries: Collection<Country>
  products: Collection<Product>
  facilities: Collection<Facility>
  records: Collection<ProductionRecord>
  roles: Collection<Role>
  users: Collection<User>
  auditEntries: Collection<AuditEntry>
}

/**
 * The explicit annotation is load-bearing: the filter predicates below close
 * over `db`, so without it TypeScript cannot infer the type of a value that
 * references itself.
 */
export const db: MockDb = {
  countries: createCollection<Country>('country', seed.countries, {
    searchable: ['name', 'iso2', 'iso3', 'region'],
    filters: {
      region: (item, value) => item.region === value,
      /** Only countries that actually produce the given product. */
      productId: (item, value) =>
        countryIdsForProduct(db.records.all(), db.facilities.all(), value).has(item.id),
      facilityId: (item, value) => db.facilities.find(value)?.countryId === item.id,
    },
  }),

  products: createCollection<Product>('product', seed.products, {
    searchable: ['name', 'sku', 'category'],
    filters: {
      category: (item, value) => item.category === value,
      priceMin: (item, value) => item.unitPrice >= Number(value),
      priceMax: (item, value) => item.unitPrice <= Number(value),
      /** Only products actually produced in the given country. */
      countryId: (item, value) =>
        productIdsForCountry(db.records.all(), db.facilities.all(), value).has(item.id),
      facilityId: (item, value) => productIdsAtFacility(db.records.all(), value).has(item.id),
    },
  }),

  facilities: createCollection<Facility>('facility', seed.facilities, {
    searchable: ['name', 'status', 'kind'],
    filters: {
      countryId: (item, value) => item.countryId === value,
      status: (item, value) => item.status === value,
      kind: (item, value) => item.kind === value,
      capacityMin: (item, value) => item.capacity >= Number(value),
      capacityMax: (item, value) => item.capacity <= Number(value),
      productId: (item, value) => facilityIdsForProduct(db.records.all(), value).has(item.id),
    },
  }),

  records: createCollection<ProductionRecord>('record', seed.records, {
    searchable: ['facilityId', 'productId'],
    filters: {
      facilityId: (item, value) => item.facilityId === value,
      productId: (item, value) => item.productId === value,
      countryId: (item, value) => db.facilities.find(item.facilityId)?.countryId === value,
      year: (item, value) => item.year === Number(value),
      yearFrom: (item, value) => item.year >= Number(value),
      yearTo: (item, value) => item.year <= Number(value),
      outputMin: (item, value) => item.value >= Number(value),
      outputMax: (item, value) => item.value <= Number(value),
    },
  }),

  roles: createCollection<Role>('role', [...ROLE_SEED], {
    searchable: ['name', 'description'],
  }),

  users: createCollection<User>(
    'user',
    USER_SEED.map(({ password: _password, ...user }) => user),
    {
      searchable: ['name', 'email'],
      filters: {
        roleId: (item, value) => item.roleId === value,
        status: (item, value) => item.status === value,
      },
    },
  ),

  auditEntries: createCollection<AuditEntry>('audit', [], {
    searchable: ['action', 'entityType', 'entityLabel', 'actorName'],
    filters: {
      action: (item, value) => item.action === value,
      entityType: (item, value) => item.entityType === value,
      actorId: (item, value) => item.actorId === value,
      // Inclusive of the whole closing day: a date with no time means the day.
      dateFrom: (item, value) => item.createdAt >= value,
      dateTo: (item, value) => item.createdAt <= `${value}T23:59:59.999Z`,
    },
  }),
}
