import { z } from 'zod'
import { PERMISSIONS } from '@/entities/access'

export const permissionSchema = z.enum(PERMISSIONS)

export const roleSchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'At least 2 characters'),
  description: z.string().max(200, 'Up to 200 characters'),
  permissions: z.array(permissionSchema),
  /** Built-in roles cannot be renamed or deleted. */
  isSystem: z.boolean(),
})

export const roleCreateSchema = roleSchema.omit({ id: true, isSystem: true })
export const roleUpdateSchema = roleCreateSchema.partial()

/**
 * What the *form* holds, before Zod coerces it.
 *
 * `z.coerce.number()` accepts `unknown` on the way in — an `<input type="number">`
 * hands over a string — so react-hook-form must be typed against the schema's
 * input while the submit handler receives the parsed output.
 */
export type RoleFormValues = z.input<typeof roleCreateSchema>

export type Role = z.infer<typeof roleSchema>
export type RoleCreateInput = z.infer<typeof roleCreateSchema>
export type RoleUpdateInput = z.infer<typeof roleUpdateSchema>
