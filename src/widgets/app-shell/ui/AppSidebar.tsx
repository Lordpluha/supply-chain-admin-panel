import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { hasPermission } from '@/entities/access'
import { useSession } from '@/entities/session'
import { cn } from '@/shared/lib/cn'
import { useUiStore } from '@/shared/store/uiStore'
import { NAVIGATION } from '../config/navigation'

export const AppSidebar = () => {
  const { t } = useTranslation()
  const { subject } = useSession()
  const collapsed = useUiStore(state => state.sidebarCollapsed)

  const sections = NAVIGATION.map(section => ({
    ...section,
    items: section.items.filter(item => hasPermission({ subject, permission: item.permission })),
  })).filter(section => section.items.length > 0)

  return (
    <nav
      aria-label={t('nav.toggleSidebar')}
      className={cn(
        // Sticky under the 3.5rem header, with its own scroll only when the
        // navigation itself is taller than the viewport.
        'bg-sidebar border-sidebar-border sticky top-14 flex h-[calc(100svh-3.5rem)] shrink-0 flex-col gap-6 overflow-y-auto border-e p-3 transition-[width]',
        collapsed ? 'w-16' : 'w-60',
      )}
    >
      {sections.map(section => (
        <div key={section.titleKey} className="flex flex-col gap-1">
          {!collapsed ? (
            <h2 className="typo-overline text-muted-foreground px-3 pb-1">{t(section.titleKey)}</h2>
          ) : null}

          {section.items.map(item => (
            <Link
              key={item.to}
              to={item.to}
              // `exact` on the dashboard only: every other route should stay
              // highlighted while a nested detail view is open.
              // Filters live in the query string and do not change the page.
              activeOptions={{ exact: item.to === '/', includeSearch: false }}
              className={cn(
                'typo-body-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-2.5 rounded-md px-3 py-2 transition-colors',
                collapsed && 'justify-center px-0',
              )}
              activeProps={{
                className:
                  'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary',
                'aria-current': 'page',
              }}
              title={collapsed ? t(item.labelKey) : undefined}
            >
              <item.icon className="size-4 shrink-0" aria-hidden="true" />
              {collapsed ? <span className="sr-only">{t(item.labelKey)}</span> : t(item.labelKey)}
            </Link>
          ))}
        </div>
      ))}
    </nav>
  )
}
