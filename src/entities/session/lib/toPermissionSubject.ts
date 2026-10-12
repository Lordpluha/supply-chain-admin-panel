import type { PermissionSubject } from '@/entities/access'
import type { SessionUser } from '../model/session.schema'

/** Adapts the signed-in user onto the shape `hasPermission` expects. */
export const toPermissionSubject = (
  user: SessionUser | null | undefined,
): PermissionSubject | null =>
  user ? { roleName: user.roleName, permissions: user.permissions } : null
