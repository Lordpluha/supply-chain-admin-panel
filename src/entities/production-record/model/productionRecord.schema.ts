import { z } from 'zod'
import { YEAR_MAX, YEAR_MIN } from '@/shared/config/constants'

export const productionRecordSchema = z.object({
  id: z.string(),
  facilityId: z.string().min(1, 'Pick a facility'),
  productId: z.string().min(1, 'Pick a product'),
  year: z.coerce
    .number()
    .int()
    .min(YEAR_MIN, `From ${YEAR_MIN}`)
    .max(YEAR_MAX, `Up to ${YEAR_MAX}`),
  value: z.coerce.number().nonnegative('Must be 0 or more'),
})

export const productionRecordCreateSchema = productionRecordSchema.omit({ id: true })
export const productionRecordUpdateSchema = productionRecordCreateSchema.partial()

/**
 * What the *form* holds, before Zod coerces it.
 *
 * `z.coerce.number()` accepts `unknown` on the way in — an `<input type="number">`
 * hands over a string — so react-hook-form must be typed against the schema's
 * input while the submit handler receives the parsed output.
 */
export type ProductionRecordFormValues = z.input<typeof productionRecordCreateSchema>

export type ProductionRecord = z.infer<typeof productionRecordSchema>
export type ProductionRecordCreateInput = z.infer<typeof productionRecordCreateSchema>
export type ProductionRecordUpdateInput = z.infer<typeof productionRecordUpdateSchema>

/** Row shape the CRUD table renders — ids resolved to human labels server-side. */
export interface ProductionRecordRow extends ProductionRecord {
  facilityName: string
  countryId: string
  countryName: string
  productName: string
  unit: string
}
