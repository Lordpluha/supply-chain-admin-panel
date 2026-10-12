import { z } from 'zod'

export const FACILITY_STATUSES = ['active', 'planned', 'idle'] as const

/**
 * What kind of site it is, roughly in supply-chain order. This is separate
 * from what it *makes*: a refinery and a cathode plant can both output a
 * powder, but they are not the same thing to look at on a map.
 */
export const FACILITY_KINDS = [
  'mine',
  'brine',
  'refinery',
  'plant',
  'gigafactory',
  'assembly',
] as const

export type FacilityStatus = (typeof FACILITY_STATUSES)[number]

export type FacilityKind = (typeof FACILITY_KINDS)[number]

export const facilitySchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'At least 2 characters'),
  countryId: z.string().min(1, 'Pick a country'),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  /** Nameplate capacity per year, in the unit of what it makes. */
  capacity: z.coerce.number().nonnegative('Must be 0 or more'),
  status: z.enum(FACILITY_STATUSES),
  kind: z.enum(FACILITY_KINDS),
})

export const facilityCreateSchema = facilitySchema.omit({ id: true })
export const facilityUpdateSchema = facilityCreateSchema.partial()

/**
 * What the *form* holds, before Zod coerces it.
 *
 * `z.coerce.number()` accepts `unknown` on the way in — an `<input type="number">`
 * hands over a string — so react-hook-form must be typed against the schema's
 * input while the submit handler receives the parsed output.
 */
export type FacilityFormValues = z.input<typeof facilityCreateSchema>

export type Facility = z.infer<typeof facilitySchema>

/**
 * List row with the country and what the site produces already resolved, so a
 * table or a map tooltip needs one request rather than one per row.
 */
export interface FacilityRow extends Facility {
  countryName: string
  countryIso2: string
  productNames: Array<string>
}
export type FacilityCreateInput = z.infer<typeof facilityCreateSchema>
export type FacilityUpdateInput = z.infer<typeof facilityUpdateSchema>
