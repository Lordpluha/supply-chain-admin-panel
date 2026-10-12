import { createFileRoute } from '@tanstack/react-router'
import { requirePermission } from '@/app/router/guards'
import { FacilityDetailPage } from '@/pages/facility-detail'
import { pageTitle } from '@/shared/lib/pageTitle'

export const Route = createFileRoute('/_authed/facilities_/$facilityId')({
  beforeLoad: requirePermission('facilities:read'),
  head: () => ({ meta: [{ title: pageTitle('Facility') }] }),
  component: RouteComponent,
})

function RouteComponent() {
  const { facilityId } = Route.useParams()
  return <FacilityDetailPage facilityId={facilityId} />
}
