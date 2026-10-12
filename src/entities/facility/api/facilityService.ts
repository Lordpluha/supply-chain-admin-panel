import type { CrudService, HttpClient } from '@/shared/api'
import { createCrudService, httpClient } from '@/shared/api'
import type {
  FacilityCreateInput,
  FacilityRow,
  FacilityUpdateInput,
} from '../model/facility.schema'

/**
 * Typed against `FacilityRow`: the API resolves the country and the products a
 * site makes, so a table or a map tooltip needs one request, not one per row.
 */
export type FacilityService = CrudService<FacilityRow, FacilityCreateInput, FacilityUpdateInput>

/**
 * The transport is a parameter, not an import, so a test can pass a stub and
 * the production instance below is just the default wiring.
 */
export const createFacilityService = (http: HttpClient = httpClient): FacilityService =>
  createCrudService<FacilityRow, FacilityCreateInput, FacilityUpdateInput>({
    http,
    resource: 'facilities',
  })

export const facilityService = createFacilityService()
