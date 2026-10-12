import { createFileRoute } from '@tanstack/react-router'
import { requirePermission } from '@/app/router/guards'
import { CountryDetailPage } from '@/pages/country-detail'
import { pageTitle } from '@/shared/lib/pageTitle'

/**
 * `countries_` rather than `countries`: the trailing underscore opts the route
 * out of nesting, so a record page is a sibling of the list instead of being
 * rendered inside it through an `<Outlet />` the list does not have.
 */
export const Route = createFileRoute('/_authed/countries_/$countryId')({
  beforeLoad: requirePermission('countries:read'),
  head: () => ({ meta: [{ title: pageTitle('Country') }] }),
  component: RouteComponent,
})

function RouteComponent() {
  const { countryId } = Route.useParams()
  return <CountryDetailPage countryId={countryId} />
}
