import type { CrudService, HttpClient } from '@/shared/api'
import { createCrudService, httpClient } from '@/shared/api'
import type { Country, CountryCreateInput, CountryUpdateInput } from '../model/country.schema'

export type CountryService = CrudService<Country, CountryCreateInput, CountryUpdateInput>

/**
 * The transport is a parameter, not an import, so a test can pass a stub and
 * the production instance below is just the default wiring.
 */
export const createCountryService = (http: HttpClient = httpClient): CountryService =>
  createCrudService<Country, CountryCreateInput, CountryUpdateInput>({
    http,
    resource: 'countries',
  })

export const countryService = createCountryService()
