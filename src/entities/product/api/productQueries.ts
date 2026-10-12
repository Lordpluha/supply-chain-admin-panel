import { createCrudQueries } from '@/shared/api'
import { productService } from './productService'

export const productQueries = createCrudQueries({
  resource: 'products',
  service: productService,
})
