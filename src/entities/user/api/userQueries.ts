import { createCrudQueries } from '@/shared/api'
import { userService } from './userService'

export const userQueries = createCrudQueries({
  resource: 'users',
  service: userService,
})
