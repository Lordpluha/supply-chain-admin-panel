import { createFileRoute } from '@tanstack/react-router'
import { requirePermission } from '@/app/router/guards'
import { ProductDetailPage } from '@/pages/product-detail'
import { pageTitle } from '@/shared/lib/pageTitle'

export const Route = createFileRoute('/_authed/products_/$productId')({
  beforeLoad: requirePermission('products:read'),
  head: () => ({ meta: [{ title: pageTitle('Product') }] }),
  component: RouteComponent,
})

function RouteComponent() {
  const { productId } = Route.useParams()
  return <ProductDetailPage productId={productId} />
}
