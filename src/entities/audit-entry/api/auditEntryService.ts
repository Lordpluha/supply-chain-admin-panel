import type { HttpClient, ListQuery, Paginated, ReadableService } from '@/shared/api'
import { httpClient, toSearchParams } from '@/shared/api'
import type { AuditEntry } from '../model/auditEntry.types'

/**
 * Implements only the readable half of the service contract: the audit trail
 * has no write surface by design.
 */
export type AuditEntryService = ReadableService<AuditEntry>

export const createAuditEntryService = (http: HttpClient = httpClient): AuditEntryService => ({
  list: (query?: ListQuery) =>
    http<Paginated<AuditEntry>>('/audit-entries', { query: toSearchParams(query) }),
  getById: (id: string) => http<AuditEntry>(`/audit-entries/${id}`),
})

export const auditEntryService = createAuditEntryService()
