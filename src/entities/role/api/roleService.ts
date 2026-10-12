import type { CrudService, HttpClient } from '@/shared/api'
import { createCrudService, httpClient } from '@/shared/api'
import type { Role, RoleCreateInput, RoleUpdateInput } from '../model/role.schema'

export type RoleService = CrudService<Role, RoleCreateInput, RoleUpdateInput>

export const createRoleService = (http: HttpClient = httpClient): RoleService =>
  createCrudService<Role, RoleCreateInput, RoleUpdateInput>({
    http,
    resource: 'roles',
  })

export const roleService = createRoleService()
