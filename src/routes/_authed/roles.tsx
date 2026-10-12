import { createFileRoute } from '@tanstack/react-router'
import { requirePermission } from '@/app/router/guards'
import { RolesPage } from '@/pages/roles'
import { pageTitle } from '@/shared/lib/pageTitle'

export const Route = createFileRoute('/_authed/roles')({
  beforeLoad: requirePermission('roles:read'),
  head: () => ({ meta: [{ title: pageTitle('Roles & permissions') }] }),
  component: RolesPage,
})
