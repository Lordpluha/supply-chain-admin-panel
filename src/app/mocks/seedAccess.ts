import type { Permission } from '@/entities/access'
import { PERMISSIONS } from '@/entities/access'
import type { Role } from '@/entities/role'
import type { User } from '@/entities/user'
import { DEFAULT_CREDENTIALS } from '@/shared/config/constants'

const READ_ONLY: ReadonlyArray<Permission> = [
  'dashboard:read',
  'countries:read',
  'products:read',
  'facilities:read',
  'production:read',
]

export const ROLE_SEED: ReadonlyArray<Role> = [
  {
    id: 'admin',
    name: 'ADMIN',
    description: 'Full control, including access management and the audit trail.',
    permissions: [...PERMISSIONS],
    isSystem: true,
  },
  {
    id: 'supply-analyst',
    name: 'SUPPLY_ANALYST',
    description: 'Maintains the production dataset; cannot manage access.',
    permissions: [
      ...READ_ONLY,
      'countries:write',
      'products:write',
      'facilities:write',
      'production:write',
    ],
    isSystem: true,
  },
  {
    id: 'auditor',
    name: 'AUDITOR',
    description: 'Reads everything and the audit trail; changes nothing. IP addresses stay masked.',
    // Deliberately without 'audit-ip:read', so the narrower permission is
    // visible in the running prototype rather than only in the roles grid.
    permissions: [...READ_ONLY, 'audit:read', 'users:read', 'roles:read'],
    isSystem: true,
  },
  {
    id: 'viewer',
    name: 'VIEWER',
    description: 'Read-only access to the map and the reference data.',
    permissions: [...READ_ONLY],
    isSystem: false,
  },
]

/**
 * Passwords live beside the user only because this is a mock. The seeded
 * operator's credentials are the ones pre-filled on the login screen.
 */
export interface SeedUser extends User {
  password: string
}

export const USER_SEED: ReadonlyArray<SeedUser> = [
  {
    id: 'u-admin',
    email: DEFAULT_CREDENTIALS.email,
    password: DEFAULT_CREDENTIALS.password,
    name: 'Ada Marchetti',
    roleId: 'admin',
    status: 'active',
    createdAt: '2023-04-11T09:12:00.000Z',
    lastActiveAt: '2026-09-18T16:40:00.000Z',
  },
  {
    id: 'u-analyst',
    email: 'lukas.weber@example.com',
    password: 'supply-chain',
    name: 'Lukas Weber',
    roleId: 'supply-analyst',
    status: 'active',
    createdAt: '2024-01-22T11:05:00.000Z',
    lastActiveAt: '2026-09-17T08:21:00.000Z',
  },
  {
    id: 'u-auditor',
    email: 'chloe.durand@example.com',
    password: 'supply-chain',
    name: 'Chloé Durand',
    roleId: 'auditor',
    status: 'active',
    createdAt: '2024-06-03T14:48:00.000Z',
    lastActiveAt: '2026-09-15T12:03:00.000Z',
  },
  {
    id: 'u-viewer',
    email: 'piotr.nowak@example.com',
    password: 'supply-chain',
    name: 'Piotr Nowak',
    roleId: 'viewer',
    status: 'suspended',
    createdAt: '2025-02-19T07:30:00.000Z',
    lastActiveAt: null,
  },
]
