import { z } from 'zod'

export const USER_STATUSES = ['active', 'suspended'] as const

export type UserStatus = (typeof USER_STATUSES)[number]

export const userSchema = z.object({
  id: z.string(),
  email: z.email('Enter a valid email'),
  name: z.string().min(2, 'At least 2 characters'),
  roleId: z.string().min(1, 'Pick a role'),
  status: z.enum(USER_STATUSES),
  createdAt: z.string(),
  lastActiveAt: z.string().nullable(),
})

export const userCreateSchema = userSchema.omit({
  id: true,
  createdAt: true,
  lastActiveAt: true,
})
export const userUpdateSchema = userCreateSchema.partial()

/**
 * What the *form* holds, before Zod coerces it.
 *
 * `z.coerce.number()` accepts `unknown` on the way in — an `<input type="number">`
 * hands over a string — so react-hook-form must be typed against the schema's
 * input while the submit handler receives the parsed output.
 */
export type UserFormValues = z.input<typeof userCreateSchema>

export type User = z.infer<typeof userSchema>
export type UserCreateInput = z.infer<typeof userCreateSchema>
export type UserUpdateInput = z.infer<typeof userUpdateSchema>

/** List row with the role name already resolved, so the table issues one request. */
export interface UserRow extends User {
  roleName: string
}
