import type { Permission } from './permission'
import { SUPER_ADMIN_ROLE } from './permission'

export interface PermissionSubject {
  roleName: string
  permissions: ReadonlyArray<Permission>
}

export interface HasPermissionInput {
  subject: PermissionSubject | null
  permission: Permission
}

/**
 * Whether the signed-in operator may see or do something.
 *
 * This is a **cosmetic** check: it decides what the panel renders, nothing
 * more. A real deployment re-checks every request server-side regardless of
 * what this returns — the mock API in `app/mocks` does exactly that, so the
 * two enforcement points stay honest about each other.
 */
export const hasPermission = ({ subject, permission }: HasPermissionInput): boolean => {
  if (subject === null) return false
  if (subject.roleName === SUPER_ADMIN_ROLE) return true
  return subject.permissions.includes(permission)
}

export const hasEveryPermission = (
  subject: PermissionSubject | null,
  permissions: ReadonlyArray<Permission>,
): boolean => permissions.every(permission => hasPermission({ subject, permission }))

export const hasSomePermission = (
  subject: PermissionSubject | null,
  permissions: ReadonlyArray<Permission>,
): boolean => permissions.some(permission => hasPermission({ subject, permission }))
