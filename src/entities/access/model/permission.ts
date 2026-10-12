/**
 * Every capability the panel can gate on, as `<resource>:<action>`.
 *
 * Declared as a union first and mirrored into a tuple below so that adding a
 * member without listing it is a compile error rather than a silently missing
 * checkbox on the roles screen.
 */
export type Permission =
  | 'dashboard:read'
  | 'countries:read'
  | 'countries:write'
  | 'products:read'
  | 'products:write'
  | 'facilities:read'
  | 'facilities:write'
  | 'production:read'
  | 'production:write'
  | 'users:read'
  | 'users:write'
  | 'roles:read'
  | 'roles:write'
  | 'audit:read'
  | 'audit-ip:read'

/** Compile-time proof that the tuple covers the union exhaustively. */
const coveringTuple =
  <T extends string>() =>
  <U extends ReadonlyArray<T>>(
    tuple: U & ([T] extends [U[number]] ? unknown : never),
  ): Readonly<U> =>
    tuple

export const PERMISSIONS = coveringTuple<Permission>()([
  'dashboard:read',
  'countries:read',
  'countries:write',
  'products:read',
  'products:write',
  'facilities:read',
  'facilities:write',
  'production:read',
  'production:write',
  'users:read',
  'users:write',
  'roles:read',
  'roles:write',
  'audit:read',
  'audit-ip:read',
])

/** Permission groups, in the order the roles screen renders them. */
export const PERMISSION_GROUPS = [
  { resource: 'dashboard', permissions: ['dashboard:read'] },
  { resource: 'countries', permissions: ['countries:read', 'countries:write'] },
  { resource: 'products', permissions: ['products:read', 'products:write'] },
  { resource: 'facilities', permissions: ['facilities:read', 'facilities:write'] },
  { resource: 'production', permissions: ['production:read', 'production:write'] },
  { resource: 'users', permissions: ['users:read', 'users:write'] },
  { resource: 'roles', permissions: ['roles:read', 'roles:write'] },
  { resource: 'audit', permissions: ['audit:read'] },
  // Its own row rather than a column on the audit row: an IP address
  // identifies a person's location, so holding the log is not the same as
  // being allowed to read who connected from where.
  { resource: 'auditIp', permissions: ['audit-ip:read'] },
] as const satisfies ReadonlyArray<{
  resource: string
  permissions: ReadonlyArray<Permission>
}>

/**
 * Governs the screens that hand out access. Kept separate so the roles screen
 * can refuse to let a role strip its own ability to grant permissions.
 */
export const PROTECTED_PERMISSIONS: ReadonlyArray<Permission> = [
  'users:read',
  'users:write',
  'roles:read',
  'roles:write',
]

/** The one role name that is always allowed everything. */
export const SUPER_ADMIN_ROLE = 'ADMIN'
