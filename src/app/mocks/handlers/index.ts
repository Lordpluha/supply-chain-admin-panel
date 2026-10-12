import { HttpResponse, http } from 'msw'
import { countryCreateSchema, countryUpdateSchema } from '@/entities/country'
import { facilityCreateSchema, facilityUpdateSchema } from '@/entities/facility'
import { productCreateSchema, productUpdateSchema } from '@/entities/product'
import {
  productionRecordCreateSchema,
  productionRecordUpdateSchema,
} from '@/entities/production-record'
import { roleCreateSchema, roleUpdateSchema } from '@/entities/role'
import { userCreateSchema, userUpdateSchema } from '@/entities/user'
import { env } from '@/shared/config/env'
import { db } from '../db'
import { analyticsHandlers } from './analytics'
import { authHandlers } from './auth'
import { createResourceHandlers } from './createResourceHandlers'
import { authorize, latency, notFound, parseListQuery, principalCan } from './lib'

/**
 * An IP address says where a person was sitting, which is a stricter thing to
 * disclose than the fact that they changed a row. Holding `audit:read` gets the
 * log; only `audit-ip:read` gets the addresses in it.
 *
 * Masked here, on the server side of the mock, rather than by leaving the column
 * out of the table: a field the client merely declines to render is still in the
 * response and still in the network tab.
 */
const maskIp = <T extends { ipAddress: string | null }>(entry: T, allowed: boolean): T =>
  allowed ? entry : { ...entry, ipAddress: null }

const auditHandlers = [
  http.get(`${env.apiBaseUrl}/audit-entries`, async ({ request, cookies }) => {
    await latency()
    const auth = authorize({ cookies }, 'audit:read')
    if ('response' in auth) return auth.response

    const showIp = principalCan(auth.principal, 'audit-ip:read')
    const query = parseListQuery(new URL(request.url))
    const page = db.auditEntries.query({ sortBy: 'createdAt', sortDir: 'desc', ...query })

    return HttpResponse.json({
      ...page,
      items: page.items.map(entry => maskIp(entry, showIp)),
    })
  }),

  http.get(`${env.apiBaseUrl}/audit-entries/:id`, async ({ params, cookies }) => {
    await latency()
    const auth = authorize({ cookies }, 'audit:read')
    if ('response' in auth) return auth.response

    const entry = db.auditEntries.find(String(params.id))
    if (!entry) return notFound('Audit entry')

    return HttpResponse.json(maskIp(entry, principalCan(auth.principal, 'audit-ip:read')))
  }),
]

export const handlers = [
  ...authHandlers,
  ...analyticsHandlers,
  ...auditHandlers,

  ...createResourceHandlers({
    resource: 'countries',
    collection: db.countries,
    auditEntityType: 'country',
    readPermission: 'countries:read',
    writePermission: 'countries:write',
    createSchema: countryCreateSchema,
    updateSchema: countryUpdateSchema,
    label: country => country.name,
    guardDelete: country =>
      db.facilities.all().some(facility => facility.countryId === country.id)
        ? 'Remove the facilities in this country first'
        : null,
  }),

  ...createResourceHandlers({
    resource: 'products',
    collection: db.products,
    auditEntityType: 'product',
    readPermission: 'products:read',
    writePermission: 'products:write',
    createSchema: productCreateSchema,
    updateSchema: productUpdateSchema,
    label: product => product.name,
    guardDelete: product =>
      db.records.all().some(record => record.productId === product.id)
        ? 'Remove the production records for this product first'
        : null,
  }),

  ...createResourceHandlers({
    resource: 'facilities',
    collection: db.facilities,
    auditEntityType: 'facility',
    readPermission: 'facilities:read',
    writePermission: 'facilities:write',
    createSchema: facilityCreateSchema,
    updateSchema: facilityUpdateSchema,
    label: facility => facility.name,
    decorate: facility => {
      const country = db.countries.find(facility.countryId)
      const productIds = new Set(
        db.records
          .all()
          .filter(r => r.facilityId === facility.id)
          .map(r => r.productId),
      )

      return {
        ...facility,
        countryName: country?.name ?? '—',
        countryIso2: country?.iso2 ?? '',
        // `.sort()` rather than `.toSorted()`: the array is freshly built by
        // the `.map()` above, so there is nothing to mutate, and `toSorted`
        // is ES2023 — past this project's target, with no polyfill loaded.
        // oxlint-disable-next-line unicorn/no-array-sort
        productNames: [...productIds].map(id => db.products.find(id)?.name ?? id).sort(),
      }
    },
    guardDelete: facility =>
      db.records.all().some(record => record.facilityId === facility.id)
        ? 'Remove the production records for this facility first'
        : null,
  }),

  ...createResourceHandlers({
    resource: 'production-records',
    collection: db.records,
    auditEntityType: 'production-record',
    readPermission: 'production:read',
    writePermission: 'production:write',
    createSchema: productionRecordCreateSchema,
    updateSchema: productionRecordUpdateSchema,
    label: record => {
      const facility = db.facilities.find(record.facilityId)
      const product = db.products.find(record.productId)
      return `${facility?.name ?? record.facilityId} · ${product?.name ?? record.productId} · ${record.year}`
    },
    decorate: record => {
      const facility = db.facilities.find(record.facilityId)
      const product = db.products.find(record.productId)
      const country = facility ? db.countries.find(facility.countryId) : undefined

      return {
        ...record,
        facilityName: facility?.name ?? '—',
        countryId: country?.id ?? '',
        countryName: country?.name ?? '—',
        productName: product?.name ?? '—',
        unit: product?.unit ?? '',
      }
    },
  }),

  ...createResourceHandlers({
    resource: 'roles',
    collection: db.roles,
    auditEntityType: 'role',
    readPermission: 'roles:read',
    writePermission: 'roles:write',
    createSchema: roleCreateSchema.transform(input => ({ ...input, isSystem: false })),
    updateSchema: roleUpdateSchema,
    label: role => role.name,
    guardDelete: role => {
      if (role.isSystem) return 'Built-in roles cannot be deleted'
      return db.users.all().some(user => user.roleId === role.id)
        ? 'Reassign the users holding this role first'
        : null
    },
  }),

  ...createResourceHandlers({
    resource: 'users',
    collection: db.users,
    auditEntityType: 'user',
    readPermission: 'users:read',
    writePermission: 'users:write',
    createSchema: userCreateSchema.transform(input => ({
      ...input,
      createdAt: new Date().toISOString(),
      lastActiveAt: null,
    })),
    updateSchema: userUpdateSchema,
    label: user => user.name,
    decorate: user => ({
      ...user,
      roleName: db.roles.find(user.roleId)?.name ?? '—',
    }),
  }),
]
