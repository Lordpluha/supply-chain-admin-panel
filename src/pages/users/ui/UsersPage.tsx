import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import { parseAsString } from 'nuqs'
import { useTranslation } from 'react-i18next'
import { roleQueries } from '@/entities/role'
import type { UserCreateInput, UserRow, UserUpdateInput } from '@/entities/user'
import { userQueries } from '@/entities/user'
import { useFormatters } from '@/shared/lib/useFormatters'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import type { DataColumn } from '@/shared/ui/data-table'
import { FilterField } from '@/shared/ui/filter-field'
import { OptionSelect } from '@/shared/ui/option-select'
import type { EntityCrudConfig } from '@/widgets/entity-crud'
import { EntityCrudPage } from '@/widgets/entity-crud'
import { UserForm } from './UserForm'

export const UsersPage = () => {
  const { t } = useTranslation()
  const fmt = useFormatters()

  const roles = useQuery(roleQueries.listOptions({ pageSize: 0, sortBy: 'name' }))

  const columns: ReadonlyArray<DataColumn<UserRow>> = [
    { id: 'name', header: t('users.name'), cell: row => row.name, sortable: true },
    { id: 'email', header: t('users.email'), cell: row => row.email, sortable: true },
    {
      id: 'roleId',
      header: t('users.role'),
      cell: row => <Badge variant="secondary">{row.roleName}</Badge>,
      sortable: true,
    },
    {
      id: 'status',
      header: t('users.status'),
      cell: row => (
        <Badge variant={row.status === 'active' ? 'default' : 'outline'}>
          {t(`users.status${row.status[0].toUpperCase()}${row.status.slice(1)}` as never)}
        </Badge>
      ),
      sortable: true,
    },
    {
      id: 'lastActiveAt',
      header: t('users.lastActiveAt'),
      cell: row => (row.lastActiveAt ? fmt.dateTime(row.lastActiveAt) : t('users.never')),
      secondary: true,
      sortable: true,
    },
  ]

  const config: EntityCrudConfig<UserRow, UserCreateInput, UserUpdateInput> = {
    titleKey: 'users.title',
    descriptionKey: 'users.description',
    createTitleKey: 'users.createTitle',
    editTitleKey: 'users.editTitle',
    queries: userQueries,
    readPermission: 'users:read',
    writePermission: 'users:write',
    columns,
    filterParsers: {
      roleId: parseAsString.withDefault(''),
      status: parseAsString.withDefault(''),
    },
    renderFilters: ({ values, set }) => (
      <>
        <FilterField label={t('users.role')}>
          <OptionSelect
            className="w-44"
            aria-label={t('users.role')}
            value={values.roleId}
            onChange={value => set('roleId', value || null)}
            allLabel={t('common.selectAll')}
            options={(roles.data?.items ?? []).map(role => ({ value: role.id, label: role.name }))}
          />
        </FilterField>
        <FilterField label={t('users.status')}>
          <OptionSelect
            className="w-36"
            aria-label={t('users.status')}
            value={values.status}
            onChange={value => set('status', value || null)}
            allLabel={t('common.selectAll')}
            options={(['active', 'suspended'] as const).map(status => ({
              value: status,
              label: t(`users.status${status[0].toUpperCase()}${status.slice(1)}` as never),
            }))}
          />
        </FilterField>
      </>
    ),
    exportFileName: 'users',
    exportColumns: [
      { header: t('users.name'), value: row => row.name },
      { header: t('users.email'), value: row => row.email },
      { header: t('users.role'), value: row => row.roleName },
      { header: t('users.status'), value: row => row.status },
      { header: t('users.createdAt'), value: row => new Date(row.createdAt) },
      {
        header: t('users.lastActiveAt'),
        value: row => (row.lastActiveAt ? new Date(row.lastActiveAt) : null),
      },
    ],
    detailLink: row => (
      <Button
        render={<Link to="/users/$userId" params={{ userId: row.id }} />}
        variant="ghost"
        size="icon"
        className="size-8"
        aria-label={`${t('common.open')} — ${row.name}`}
      >
        <ArrowUpRight aria-hidden="true" />
      </Button>
    ),
    label: row => row.name,
    toFormValues: row =>
      row ? { name: row.name, email: row.email, roleId: row.roleId, status: row.status } : {},
    Form: UserForm,
  }

  return <EntityCrudPage config={config} />
}
