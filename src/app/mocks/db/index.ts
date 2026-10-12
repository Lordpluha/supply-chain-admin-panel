import { seedAuditTrail } from './auditHistory'

export type { AuditInput } from './audit'
export { recordAudit } from './audit'
export type { MockDb } from './collections'
export { db } from './collections'
export { issueToken, passwords, userIdFromToken } from './sessions'

seedAuditTrail()
