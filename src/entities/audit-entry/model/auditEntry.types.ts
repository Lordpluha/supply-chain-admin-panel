export const AUDIT_ACTIONS = ['create', 'update', 'delete', 'login', 'logout'] as const

export type AuditAction = (typeof AUDIT_ACTIONS)[number]

export const AUDIT_ENTITY_TYPES = [
  'country',
  'product',
  'facility',
  'production-record',
  'user',
  'role',
  'session',
] as const

export type AuditEntityType = (typeof AUDIT_ENTITY_TYPES)[number]

/**
 * One recorded operator action. Read-only everywhere — an audit trail somebody
 * can edit is not an audit trail, so no create/update/delete exists for it.
 */
export interface AuditEntry {
  id: string
  action: AuditAction
  entityType: AuditEntityType
  entityId: string | null
  /** Human label of the affected row at the time of the action. */
  entityLabel: string | null
  actorId: string | null
  /** Resolved server-side so the list needs no request per row. */
  actorName: string
  ipAddress: string | null
  /** ISO-8601 timestamp. */
  createdAt: string
}

/** Shown for entries the platform wrote itself, which carry no operator. */
export const SYSTEM_ACTOR = 'system'

export const auditActorLabel = (entry: AuditEntry): string => entry.actorName || SYSTEM_ACTOR
