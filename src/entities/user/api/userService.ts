import type { CrudService, HttpClient } from '@/shared/api'
import { createCrudService, httpClient } from '@/shared/api'
import type { UserCreateInput, UserRow, UserUpdateInput } from '../model/user.schema'

/**
 * Typed against `UserRow`: the API resolves the role name server-side so a
 * table needs one request rather than one per row.
 */
export type UserService = CrudService<UserRow, UserCreateInput, UserUpdateInput>

export const createUserService = (http: HttpClient = httpClient): UserService =>
  createCrudService<UserRow, UserCreateInput, UserUpdateInput>({
    http,
    resource: 'users',
  })

export const userService = createUserService()
