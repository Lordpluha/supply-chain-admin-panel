import { createFileRoute } from '@tanstack/react-router'
import { requirePermission } from '@/app/router/guards'
import { ProductionPage } from '@/pages/production'
import { pageTitle } from '@/shared/lib/pageTitle'

export const Route = createFileRoute('/_authed/production')({
  beforeLoad: requirePermission('production:read'),
  head: () => ({ meta: [{ title: pageTitle('Production') }] }),
  component: ProductionPage,
})
