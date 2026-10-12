import type { ParseKeys } from 'i18next'
import {
  ClipboardList,
  Factory,
  Globe,
  type LucideIcon,
  Map,
  Package,
  ShieldCheck,
  Users,
} from 'lucide-react'
import type { Permission } from '@/entities/access'

export interface NavItem {
  to: string
  /**
   * A checked translation key, not a bare string: a typo here would otherwise
   * render the key itself into the sidebar.
   */
  labelKey: ParseKeys
  icon: LucideIcon
  /** Filtered out when the signed-in role lacks this. */
  permission: Permission
}

export interface NavSection {
  titleKey: ParseKeys
  items: ReadonlyArray<NavItem>
}

/**
 * Every entry names the permission that reveals it, so navigation can never
 * offer a page the API is going to refuse. The guard on the route is the other
 * half — see `.claude/rules/rbac.md`.
 */
export const NAVIGATION: ReadonlyArray<NavSection> = [
  {
    titleKey: 'nav.sectionAnalysis',
    items: [{ to: '/', labelKey: 'nav.dashboard', icon: Map, permission: 'dashboard:read' }],
  },
  {
    titleKey: 'nav.sectionData',
    items: [
      { to: '/countries', labelKey: 'nav.countries', icon: Globe, permission: 'countries:read' },
      { to: '/products', labelKey: 'nav.products', icon: Package, permission: 'products:read' },
      {
        to: '/facilities',
        labelKey: 'nav.facilities',
        icon: Factory,
        permission: 'facilities:read',
      },
      {
        to: '/production',
        labelKey: 'nav.production',
        icon: ClipboardList,
        permission: 'production:read',
      },
    ],
  },
  {
    titleKey: 'nav.sectionAdmin',
    items: [
      { to: '/users', labelKey: 'nav.users', icon: Users, permission: 'users:read' },
      { to: '/roles', labelKey: 'nav.roles', icon: ShieldCheck, permission: 'roles:read' },
      { to: '/audit', labelKey: 'nav.audit', icon: ClipboardList, permission: 'audit:read' },
    ],
  },
]
