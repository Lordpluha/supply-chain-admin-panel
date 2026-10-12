import { createCrudQueries } from '@/shared/api'
import { facilityService } from './facilityService'

export const facilityQueries = createCrudQueries({
  resource: 'facilities',
  service: facilityService,
})
