import { z } from 'zod'

export const __NameCamel__Schema = z.object({
  id: z.string(),
  // Replace with the real contract before wiring any consumer.
  name: z.string().min(2, 'At least 2 characters'),
})

export const __NameCamel__CreateSchema = __NameCamel__Schema.omit({ id: true })
export const __NameCamel__UpdateSchema = __NameCamel__CreateSchema.partial()

export type __NamePascal__ = z.infer<typeof __NameCamel__Schema>
export type __NamePascal__CreateInput = z.infer<typeof __NameCamel__CreateSchema>
export type __NamePascal__UpdateInput = z.infer<typeof __NameCamel__UpdateSchema>
