import { createCrudQueries } from '@/shared/api'
import { roleService } from './roleService'

export const roleQueries = createCrudQueries({
  resource: 'roles',
  service: roleService,
})
