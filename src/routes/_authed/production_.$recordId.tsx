import { createFileRoute } from '@tanstack/react-router'
import { requirePermission } from '@/app/router/guards'
import { ProductionDetailPage } from '@/pages/production-detail'
import { pageTitle } from '@/shared/lib/pageTitle'

export const Route = createFileRoute('/_authed/production_/$recordId')({
  beforeLoad: requirePermission('production:read'),
  head: () => ({ meta: [{ title: pageTitle('Production record') }] }),
  component: RouteComponent,
})

function RouteComponent() {
  const { recordId } = Route.useParams()
  return <ProductionDetailPage recordId={recordId} />
}
