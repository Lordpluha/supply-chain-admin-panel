import { createFileRoute } from '@tanstack/react-router'
import { requirePermission } from '@/app/router/guards'
import { UserDetailPage } from '@/pages/user-detail'
import { pageTitle } from '@/shared/lib/pageTitle'

export const Route = createFileRoute('/_authed/users_/$userId')({
  beforeLoad: requirePermission('users:read'),
  head: () => ({ meta: [{ title: pageTitle('User') }] }),
  component: RouteComponent,
})

function RouteComponent() {
  const { userId } = Route.useParams()
  return <UserDetailPage userId={userId} />
}
