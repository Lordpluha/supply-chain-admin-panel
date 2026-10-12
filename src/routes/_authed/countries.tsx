import { createFileRoute } from '@tanstack/react-router'
import { requirePermission } from '@/app/router/guards'
import { CountriesPage } from '@/pages/countries'
import { pageTitle } from '@/shared/lib/pageTitle'

export const Route = createFileRoute('/_authed/countries')({
  beforeLoad: requirePermission('countries:read'),
  head: () => ({ meta: [{ title: pageTitle('Countries') }] }),
  component: CountriesPage,
})
