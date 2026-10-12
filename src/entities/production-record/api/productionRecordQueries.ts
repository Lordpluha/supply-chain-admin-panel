import { createCrudQueries } from '@/shared/api'
import { productionRecordService } from './productionRecordService'

export const productionRecordQueries = createCrudQueries({
  resource: 'production-records',
  service: productionRecordService,
})
