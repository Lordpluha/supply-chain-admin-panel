import { sorted } from '@/shared/lib/array'
import type { AuditInput } from './audit'
import { recordAudit } from './audit'

/** A little history, so the activity log is not empty on first load. */
const HISTORY: ReadonlyArray<AuditInput> = [
  {
    action: 'login',
    entityType: 'session',
    entityId: null,
    entityLabel: null,
    actorId: 'u-analyst',
    actorName: 'Lukas Weber',
    createdAt: '2026-09-17T08:21:00.000Z',
  },
  {
    action: 'update',
    entityType: 'production-record',
    entityId: 'ningde-cell-gigafactory__cell-21700__2025',
    entityLabel: 'Ningde Cell Gigafactory · Cylindrical Cell 21700 · 2025',
    actorId: 'u-analyst',
    actorName: 'Lukas Weber',
    createdAt: '2026-09-17T08:34:00.000Z',
  },
  {
    action: 'create',
    entityType: 'facility',
    entityId: 'sanand-cell-park',
    entityLabel: 'Sanand Cell Park',
    actorId: 'u-analyst',
    actorName: 'Lukas Weber',
    createdAt: '2026-09-17T09:02:00.000Z',
  },
  {
    action: 'logout',
    entityType: 'session',
    entityId: null,
    entityLabel: null,
    actorId: 'u-auditor',
    actorName: 'Chloé Durand',
    createdAt: '2026-09-15T12:03:00.000Z',
  },
  {
    action: 'update',
    entityType: 'role',
    entityId: 'viewer',
    entityLabel: 'VIEWER',
    actorId: 'u-admin',
    actorName: 'Ada Marchetti',
    createdAt: '2026-09-18T10:15:00.000Z',
  },
  {
    action: 'update',
    entityType: 'user',
    entityId: 'u-viewer',
    entityLabel: 'Piotr Nowak',
    actorId: 'u-admin',
    actorName: 'Ada Marchetti',
    createdAt: '2026-09-18T10:18:00.000Z',
  },
  {
    action: 'delete',
    entityType: 'production-record',
    entityId: 'jorf-lasfar-cathode-plant__lfp-cat__2026',
    entityLabel: 'Jorf Lasfar Cathode Plant · LFP Cathode · 2026',
    actorId: 'u-admin',
    actorName: 'Ada Marchetti',
    createdAt: '2026-09-18T11:47:00.000Z',
  },
]

/** Written oldest-first so the newest entry ends up at the top of the list. */
export const seedAuditTrail = (): void => {
  const oldestFirst = sorted(HISTORY, (a, b) =>
    (a.createdAt ?? '').localeCompare(b.createdAt ?? ''),
  )

  for (const entry of oldestFirst) recordAudit(entry)
}
