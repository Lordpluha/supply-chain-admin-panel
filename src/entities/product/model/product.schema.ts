import { z } from 'zod'

export const PRODUCT_CATEGORIES = [
  'Raw material',
  'Cathode',
  'Anode',
  'Electrolyte',
  'Component',
  'Cell',
  'Pack',
] as const

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]

export const productSchema = z.object({
  id: z.string(),
  sku: z.string().min(3, 'At least 3 characters'),
  name: z.string().min(2, 'At least 2 characters'),
  category: z.enum(PRODUCT_CATEGORIES),
  unit: z.string().min(1, 'Required'),
  /**
   * Indicative price of one `unit`, in the base currency (EUR). Mock data:
   * real sourcing prices move weekly and would be stamped with a date.
   */
  unitPrice: z.coerce.number().nonnegative('Must be 0 or more'),
})

export const productCreateSchema = productSchema.omit({ id: true })
export const productUpdateSchema = productCreateSchema.partial()

/**
 * What the *form* holds, before Zod coerces it.
 *
 * `z.coerce.number()` accepts `unknown` on the way in — an `<input type="number">`
 * hands over a string — so react-hook-form must be typed against the schema's
 * input while the submit handler receives the parsed output.
 */
export type ProductFormValues = z.input<typeof productCreateSchema>

export type Product = z.infer<typeof productSchema>
export type ProductCreateInput = z.infer<typeof productCreateSchema>
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>
