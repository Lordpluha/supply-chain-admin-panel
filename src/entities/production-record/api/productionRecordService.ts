import type { CrudService, HttpClient } from '@/shared/api'
import { createCrudService, httpClient } from '@/shared/api'
import type {
  ProductionRecordCreateInput,
  ProductionRecordRow,
  ProductionRecordUpdateInput,
} from '../model/productionRecord.schema'

/**
 * Typed against `ProductionRecordRow`, not `ProductionRecord`: the API resolves
 * the facility, country and product names server-side so a table needs one
 * request instead of one per row. Pretending otherwise would push a cast onto
 * every consumer.
 */
export type ProductionRecordService = CrudService<
  ProductionRecordRow,
  ProductionRecordCreateInput,
  ProductionRecordUpdateInput
>

/**
 * The transport is a parameter, not an import, so a test can pass a stub and
 * the production instance below is just the default wiring.
 */
export const createProductionRecordService = (
  http: HttpClient = httpClient,
): ProductionRecordService =>
  createCrudService<ProductionRecordRow, ProductionRecordCreateInput, ProductionRecordUpdateInput>({
    http,
    resource: 'production-records',
  })

export const productionRecordService = createProductionRecordService()
