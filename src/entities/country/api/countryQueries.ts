import { createCrudQueries } from '@/shared/api'
import { countryService } from './countryService'

export const countryQueries = createCrudQueries({
  resource: 'countries',
  service: countryService,
})
