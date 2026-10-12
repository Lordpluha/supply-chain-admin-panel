import type { RequestHandler } from 'msw'
import { HttpResponse, http } from 'msw'
import type { z } from 'zod'
import type { Permission } from '@/entities/access'
import type { AuditEntityType } from '@/entities/audit-entry'
import type { Identifiable } from '@/shared/api'
import { env } from '@/shared/config/env'
import type { Collection } from '../collection'
import { recordAudit } from '../db'
import { authorize, badRequest, latency, notFound, parseListQuery } from './lib'

/**
 * The panel only ever calls `safeParse`, so that is all this asks for. Depending
 * on the narrow shape instead of the whole `ZodType` keeps the factory usable
 * with a plain schema, a transformed one, or a hand-rolled parser in a test.
 */
export interface Parser<TOut> {
  safeParse: (
    input: unknown,
  ) => { success: true; data: TOut } | { success: false; error: z.ZodError }
}

export type JsonRow = Record<string, unknown>

export interface ResourceHandlersConfig<T extends Identifiable> {
  resource: string
  collection: Collection<T>
  auditEntityType: AuditEntityType
  readPermission: Permission
  writePermission: Permission
  createSchema: Parser<Omit<T, 'id'>>
  updateSchema: Parser<Partial<Omit<T, 'id'>>>
  /** Human label used in the audit trail. */
  label: (item: T) => string
  /** Optional projection applied to every row leaving the API. */
  decorate?: (item: T) => JsonRow
  /** Refuses a delete that would break referential integrity. */
  guardDelete?: (item: T) => string | null
}

/**
 * One factory, seven endpoints, every resource. Written once so a new resource
 * is a config object rather than another 120 lines of near-identical handlers.
 */
export const createResourceHandlers = <T extends Identifiable>(
  config: ResourceHandlersConfig<T>,
): Array<RequestHandler> => {
  const base = `${env.apiBaseUrl}/${config.resource}`
  const project = (item: T): JsonRow =>
    config.decorate ? config.decorate(item) : (item as unknown as JsonRow)

  return [
    http.get(base, async ({ request, cookies }) => {
      await latency()
      const auth = authorize({ cookies }, config.readPermission)
      if ('response' in auth) return auth.response

      const page = config.collection.query(parseListQuery(new URL(request.url)))
      return HttpResponse.json({ ...page, items: page.items.map(project) })
    }),

    http.get(`${base}/:id`, async ({ params, cookies }) => {
      await latency()
      const auth = authorize({ cookies }, config.readPermission)
      if ('response' in auth) return auth.response

      const item = config.collection.find(String(params.id))
      return item ? HttpResponse.json(project(item)) : notFound(config.resource)
    }),

    http.post(base, async ({ request, cookies }) => {
      await latency()
      const auth = authorize({ cookies }, config.writePermission)
      if ('response' in auth) return auth.response

      const parsed = config.createSchema.safeParse(await request.json())
      if (!parsed.success) {
        return badRequest('Validation failed', flattenIssues(parsed.error))
      }

      const created = config.collection.insert(parsed.data)
      recordAudit({
        action: 'create',
        entityType: config.auditEntityType,
        entityId: created.id,
        entityLabel: config.label(created),
        actorId: auth.principal.user.id,
        actorName: auth.principal.user.name,
      })

      return HttpResponse.json(project(created), { status: 201 })
    }),

    http.patch(`${base}/:id`, async ({ request, params, cookies }) => {
      await latency()
      const auth = authorize({ cookies }, config.writePermission)
      if ('response' in auth) return auth.response

      const parsed = config.updateSchema.safeParse(await request.json())
      if (!parsed.success) {
        return badRequest('Validation failed', flattenIssues(parsed.error))
      }

      const updated = config.collection.update(String(params.id), parsed.data)
      if (!updated) return notFound(config.resource)

      recordAudit({
        action: 'update',
        entityType: config.auditEntityType,
        entityId: updated.id,
        entityLabel: config.label(updated),
        actorId: auth.principal.user.id,
        actorName: auth.principal.user.name,
      })

      return HttpResponse.json(project(updated))
    }),

    http.delete(`${base}/:id`, async ({ params, cookies }) => {
      await latency()
      const auth = authorize({ cookies }, config.writePermission)
      if ('response' in auth) return auth.response

      const id = String(params.id)
      const item = config.collection.find(id)
      if (!item) return notFound(config.resource)

      const objection = config.guardDelete?.(item)
      if (objection) return HttpResponse.json({ message: objection }, { status: 409 })

      config.collection.remove(id)
      recordAudit({
        action: 'delete',
        entityType: config.auditEntityType,
        entityId: id,
        entityLabel: config.label(item),
        actorId: auth.principal.user.id,
        actorName: auth.principal.user.name,
      })

      return new HttpResponse(null, { status: 204 })
    }),
  ]
}

const flattenIssues = (error: z.ZodError): Record<string, string> => {
  const fields: Record<string, string> = {}
  for (const issue of error.issues) {
    const path = issue.path.join('.')
    if (path && !fields[path]) fields[path] = issue.message
  }
  return fields
}
