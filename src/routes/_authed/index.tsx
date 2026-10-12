import { createFileRoute } from '@tanstack/react-router'
import { requirePermission } from '@/app/router/guards'
import { DashboardPage } from '@/pages/dashboard'
import { pageTitle } from '@/shared/lib/pageTitle'

export const Route = createFileRoute('/_authed/')({
  beforeLoad: requirePermission('dashboard:read'),
  head: () => ({ meta: [{ title: pageTitle('Supply map') }] }),
  component: DashboardPage,
})
