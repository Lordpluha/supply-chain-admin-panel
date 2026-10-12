import type { AuditAction, AuditEntityType, AuditEntry } from '@/entities/audit-entry'
import { db } from './collections'

export interface AuditInput {
  action: AuditAction
  entityType: AuditEntityType
  entityId: string | null
  entityLabel: string | null
  actorId: string | null
  actorName: string
  createdAt?: string
}

let counter = 0

export const recordAudit = (input: AuditInput): AuditEntry => {
  counter += 1

  const entry: AuditEntry = {
    id: `audit_${counter.toString().padStart(5, '0')}`,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId,
    entityLabel: input.entityLabel,
    actorId: input.actorId,
    actorName: input.actorName,
    // A prototype has no real client IP; a fixed placeholder keeps the column
    // honest rather than inventing plausible-looking addresses.
    ipAddress: '10.0.0.1',
    createdAt: input.createdAt ?? new Date().toISOString(),
  }

  db.auditEntries.reset([entry, ...db.auditEntries.all()])
  return entry
}
