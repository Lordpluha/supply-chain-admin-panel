import { useTranslation } from 'react-i18next'
import type { Permission } from '@/entities/access'
import { PERMISSION_GROUPS } from '@/entities/access'
import { Checkbox } from '@/shared/ui/checkbox'

export interface PermissionGridProps {
  value: ReadonlyArray<Permission>
  onChange: (permissions: Array<Permission>) => void
  disabled?: boolean
}

/**
 * One row per area, one checkbox per action. Built from `PERMISSION_GROUPS`,
 * so a permission added to the union and left out of the groups is a missing
 * checkbox someone will notice — see `.claude/rules/rbac.md`.
 */
export const PermissionGrid = ({ value, onChange, disabled }: PermissionGridProps) => {
  const { t } = useTranslation()
  const held = new Set(value)

  const toggle = (permission: Permission) => {
    const next = new Set(held)
    if (next.has(permission)) next.delete(permission)
    else next.add(permission)
    onChange([...next])
  }

  return (
    <table className="w-full">
      <caption className="sr-only">{t('roles.permissions')}</caption>
      <thead>
        <tr className="typo-caption text-muted-foreground">
          <th scope="col" className="pb-2 text-start font-normal">
            {t('roles.resource')}
          </th>
          <th scope="col" className="pb-2 font-normal">
            {t('roles.read')}
          </th>
          <th scope="col" className="pb-2 font-normal">
            {t('roles.write')}
          </th>
        </tr>
      </thead>
      <tbody className="divide-border divide-y">
        {PERMISSION_GROUPS.map(group => {
          const read = group.permissions.find(p => p.endsWith(':read'))
          const write = group.permissions.find(p => p.endsWith(':write'))

          return (
            <tr key={group.resource}>
              <th scope="row" className="typo-body-sm py-2 text-start font-normal">
                {t(`roles.resources.${group.resource}` as never)}
              </th>
              {[read, write].map((permission, index) => (
                <td key={permission ?? index} className="py-2 text-center">
                  {permission ? (
                    <Checkbox
                      checked={held.has(permission)}
                      onCheckedChange={() => toggle(permission)}
                      disabled={disabled}
                      aria-label={`${t(`roles.resources.${group.resource}` as never)} — ${
                        index === 0 ? t('roles.read') : t('roles.write')
                      }`}
                    />
                  ) : (
                    <span className="text-muted-foreground" aria-hidden="true">
                      —
                    </span>
                  )}
                </td>
              ))}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
