import { describe, expect, it } from 'vitest'
import type { PermissionSubject } from './hasPermission'
import { hasEveryPermission, hasPermission, hasSomePermission } from './hasPermission'
import { PERMISSION_GROUPS, PERMISSIONS, SUPER_ADMIN_ROLE } from './permission'

const viewer: PermissionSubject = {
  roleName: 'VIEWER',
  permissions: ['dashboard:read', 'countries:read'],
}

const admin: PermissionSubject = { roleName: SUPER_ADMIN_ROLE, permissions: [] }

describe('hasPermission', () => {
  it('grants what the role holds and refuses what it does not', () => {
    expect(hasPermission({ subject: viewer, permission: 'countries:read' })).toBe(true)
    expect(hasPermission({ subject: viewer, permission: 'countries:write' })).toBe(false)
  })

  it('refuses everything when nobody is signed in', () => {
    expect(hasPermission({ subject: null, permission: 'dashboard:read' })).toBe(false)
  })

  it('grants ADMIN everything, including permissions it does not list', () => {
    // The short-circuit is what makes a permission added later automatically
    // available to ADMIN — note this subject's own list is empty.
    for (const permission of PERMISSIONS) {
      expect(hasPermission({ subject: admin, permission })).toBe(true)
    }
  })

  it('does not grant a role that merely looks like ADMIN', () => {
    const impostor: PermissionSubject = { roleName: 'ADMINISTRATOR', permissions: [] }
    expect(hasPermission({ subject: impostor, permission: 'audit:read' })).toBe(false)
  })
})

describe('hasEveryPermission / hasSomePermission', () => {
  it('distinguishes all from any', () => {
    const wanted = ['countries:read', 'countries:write'] as const

    expect(hasEveryPermission(viewer, wanted)).toBe(false)
    expect(hasSomePermission(viewer, wanted)).toBe(true)
  })

  it('treats an empty list as satisfied for every and unsatisfied for some', () => {
    expect(hasEveryPermission(viewer, [])).toBe(true)
    expect(hasSomePermission(viewer, [])).toBe(false)
  })
})

describe('the permission catalogue', () => {
  it('lists every permission exactly once', () => {
    expect(new Set(PERMISSIONS).size).toBe(PERMISSIONS.length)
  })

  it('offers every permission on the roles screen', () => {
    // A permission missing from the groups is a checkbox nobody can tick, so
    // a role could never be granted it through the UI.
    const grouped = new Set(PERMISSION_GROUPS.flatMap(group => group.permissions))

    expect([...PERMISSIONS].filter(permission => !grouped.has(permission))).toEqual([])
  })
})
