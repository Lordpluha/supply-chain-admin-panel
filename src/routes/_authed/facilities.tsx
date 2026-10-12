import { createFileRoute } from '@tanstack/react-router'
import { requirePermission } from '@/app/router/guards'
import { FacilitiesPage } from '@/pages/facilities'
import { pageTitle } from '@/shared/lib/pageTitle'

export const Route = createFileRoute('/_authed/facilities')({
  beforeLoad: requirePermission('facilities:read'),
  head: () => ({ meta: [{ title: pageTitle('Facilities') }] }),
  component: FacilitiesPage,
})
