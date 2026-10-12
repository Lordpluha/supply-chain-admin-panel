import { createFileRoute } from '@tanstack/react-router'
import { requirePermission } from '@/app/router/guards'
import { UsersPage } from '@/pages/users'
import { pageTitle } from '@/shared/lib/pageTitle'

export const Route = createFileRoute('/_authed/users')({
  beforeLoad: requirePermission('users:read'),
  head: () => ({ meta: [{ title: pageTitle('Users') }] }),
  component: UsersPage,
})
