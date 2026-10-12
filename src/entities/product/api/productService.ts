import type { CrudService, HttpClient } from '@/shared/api'
import { createCrudService, httpClient } from '@/shared/api'
import type { Product, ProductCreateInput, ProductUpdateInput } from '../model/product.schema'

export type ProductService = CrudService<Product, ProductCreateInput, ProductUpdateInput>

/**
 * The transport is a parameter, not an import, so a test can pass a stub and
 * the production instance below is just the default wiring.
 */
export const createProductService = (http: HttpClient = httpClient): ProductService =>
  createCrudService<Product, ProductCreateInput, ProductUpdateInput>({
    http,
    resource: 'products',
  })

export const productService = createProductService()
