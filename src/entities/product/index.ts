export { productQueries } from './api/productQueries'
export type { ProductService } from './api/productService'
export { createProductService, productService } from './api/productService'
export type {
  Product,
  ProductCategory,
  ProductCreateInput,
  ProductFormValues,
  ProductUpdateInput,
} from './model/product.schema'
export {
  PRODUCT_CATEGORIES,
  productCreateSchema,
  productSchema,
  productUpdateSchema,
} from './model/product.schema'
