import { z } from 'zod'

export const COUNTRY_REGIONS = [
  'Asia',
  'Europe',
  'North America',
  'South America',
  'Africa',
  'Oceania',
] as const

export type CountryRegion = (typeof COUNTRY_REGIONS)[number]

export const countrySchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'At least 2 characters'),
  iso2: z.string().length(2, 'Exactly 2 letters'),
  iso3: z.string().length(3, 'Exactly 3 letters'),
  /** ISO 3166-1 numeric — the key `world-atlas` TopoJSON features are keyed by. */
  isoNumeric: z.string().length(3, 'Exactly 3 digits'),
  region: z.enum(COUNTRY_REGIONS),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
})

export const countryCreateSchema = countrySchema.omit({ id: true })
export const countryUpdateSchema = countryCreateSchema.partial()

/**
 * What the *form* holds, before Zod coerces it.
 *
 * `z.coerce.number()` accepts `unknown` on the way in — an `<input type="number">`
 * hands over a string — so react-hook-form must be typed against the schema's
 * input while the submit handler receives the parsed output.
 */
export type CountryFormValues = z.input<typeof countryCreateSchema>

export type Country = z.infer<typeof countrySchema>
export type CountryCreateInput = z.infer<typeof countryCreateSchema>
export type CountryUpdateInput = z.infer<typeof countryUpdateSchema>
