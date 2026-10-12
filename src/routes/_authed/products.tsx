import { createFileRoute } from '@tanstack/react-router'
import { requirePermission } from '@/app/router/guards'
import { ProductsPage } from '@/pages/products'
import { pageTitle } from '@/shared/lib/pageTitle'

export const Route = createFileRoute('/_authed/products')({
  beforeLoad: requirePermission('products:read'),
  head: () => ({ meta: [{ title: pageTitle('Products') }] }),
  component: ProductsPage,
})
