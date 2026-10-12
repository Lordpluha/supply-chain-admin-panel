import { createFileRoute } from '@tanstack/react-router'
import { requirePermission } from '@/app/router/guards'
import { AuditPage } from '@/pages/audit'
import { pageTitle } from '@/shared/lib/pageTitle'

export const Route = createFileRoute('/_authed/audit')({
  beforeLoad: requirePermission('audit:read'),
  head: () => ({ meta: [{ title: pageTitle('Activity log') }] }),
  component: AuditPage,
})
