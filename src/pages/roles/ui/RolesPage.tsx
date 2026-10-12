import { useTranslation } from 'react-i18next'
import type { Role, RoleCreateInput, RoleUpdateInput } from '@/entities/role'
import { roleQueries } from '@/entities/role'
import { Badge } from '@/shared/ui/badge'
import type { DataColumn } from '@/shared/ui/data-table'
import type { EntityCrudConfig } from '@/widgets/entity-crud'
import { EntityCrudPage } from '@/widgets/entity-crud'
import { RoleForm } from './RoleForm'

export const RolesPage = () => {
  const { t } = useTranslation()

  const columns: ReadonlyArray<DataColumn<Role>> = [
    {
      id: 'name',
      header: t('roles.name'),
      cell: row => (
        <span className="flex items-center gap-2">
          <code className="typo-code">{row.name}</code>
          {row.isSystem ? <Badge variant="outline">{t('roles.system')}</Badge> : null}
        </span>
      ),
      sortable: true,
    },
    {
      id: 'description',
      header: t('roles.roleDescription'),
      cell: row => <span className="text-muted-foreground">{row.description}</span>,
      secondary: true,
    },
    {
      id: 'permissions',
      header: t('roles.permissions'),
      cell: row => t('roles.permissionCount', { count: row.permissions.length }),
      align: 'end',
    },
  ]

  const config: EntityCrudConfig<Role, RoleCreateInput, RoleUpdateInput> = {
    titleKey: 'roles.title',
    descriptionKey: 'roles.description',
    createTitleKey: 'roles.createTitle',
    editTitleKey: 'roles.editTitle',
    queries: roleQueries,
    readPermission: 'roles:read',
    writePermission: 'roles:write',
    columns,
    exportFileName: 'roles',
    exportColumns: [
      { header: t('roles.name'), value: row => row.name },
      { header: t('roles.roleDescription'), value: row => row.description },
      { header: t('roles.system'), value: row => row.isSystem },
      { header: t('roles.permissions'), value: row => row.permissions.join(', '), width: 60 },
    ],
    // The API refuses it too, but a button that is always refused is not an
    // offer — and `roles.systemLocked` promises it cannot be done.
    canDelete: row => !row.isSystem,
    label: row => row.name,
    toFormValues: row =>
      row ? { name: row.name, description: row.description, permissions: row.permissions } : {},
    Form: RoleForm,
  }

  return <EntityCrudPage config={config} />
}
