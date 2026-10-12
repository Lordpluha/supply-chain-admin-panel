import { z } from 'zod'
import { permissionSchema } from '@/entities/role'

export const credentialsSchema = z.object({
  email: z.email('Enter a valid email'),
  password: z.string().min(6, 'At least 6 characters'),
})

export const sessionUserSchema = z.object({
  id: z.string(),
  email: z.email(),
  name: z.string(),
  roleId: z.string(),
  /** Denormalised so the shell can gate navigation without a second request. */
  roleName: z.string(),
  permissions: z.array(permissionSchema),
})

/**
 * No token. The session rides on a cookie the API issued and the browser
 * returns by itself; nothing in the client ever holds a credential, so there is
 * nothing for an XSS payload to read. See SECURITY.md.
 */
export const sessionSchema = z.object({
  user: sessionUserSchema,
})

export type Credentials = z.infer<typeof credentialsSchema>
export type SessionUser = z.infer<typeof sessionUserSchema>
export type Session = z.infer<typeof sessionSchema>
