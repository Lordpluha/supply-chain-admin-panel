import { useQuery } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { countryQueries } from '@/entities/country'
import { facilityQueries } from '@/entities/facility'
import { productQueries } from '@/entities/product'
import { YEARS } from '@/shared/config/constants'
import { useDebouncedValue } from '@/shared/lib/useDebouncedValue'
import { Button } from '@/shared/ui/button'
import { Label } from '@/shared/ui/label'
import { RangeSelect } from '@/shared/ui/range-select'
import { SearchableSelect } from '@/shared/ui/searchable-select'
import type { UseSupplyFiltersResult } from '../model/useSupplyFilters'

export interface SupplyFiltersProps {
  filters: UseSupplyFiltersResult
}

/**
 * One row, not four stacked blocks.
 *
 * The explanatory lines that used to sit under the controls are behind info
 * buttons: they are read once and then only take height on every subsequent
 * visit, which on a filter bar above a map is the most expensive place to spend
 * vertical space.
 */
/** Built once: the list is a constant and every render would otherwise rebuild it. */
const YEAR_OPTIONS = YEARS.map(year => ({ value: String(year), label: String(year) }))

export const SupplyFilters = ({ filters }: SupplyFiltersProps) => {
  const { t } = useTranslation()
  // The term goes to the API rather than filtering a fully-loaded list: the
  // catalogue is small today and will not stay that way.
  const [countryTerm, setCountryTerm] = useState('')
  const [facilityTerm, setFacilityTerm] = useState('')
  const [productTerm, setProductTerm] = useState('')
  const countrySearch = useDebouncedValue(countryTerm)
  const productSearch = useDebouncedValue(productTerm)

  // The second list narrows to what actually exists under the first choice.
  // The API does the join through facilities and production records, so the
  // narrowing is real rather than a hard-coded table.
  const countries = useQuery(
    countryQueries.listOptions({
      search: countrySearch || undefined,
      pageSize: 50,
      sortBy: 'name',
      filters: { productId: filters.productId || undefined },
    }),
  )

  // Facility level is only offered once a country is chosen: the list is
  // otherwise hundreds of sites with no way to tell them apart. A chosen
  // product narrows it to the sites that actually make it.
  const facilities = useQuery({
    ...facilityQueries.listOptions({
      search: useDebouncedValue(facilityTerm) || undefined,
      pageSize: 50,
      sortBy: 'name',
      filters: {
        countryId: filters.countryId || undefined,
        productId: filters.productId || undefined,
      },
    }),
    enabled: Boolean(filters.countryId),
  })

  // Narrowed by the facility as well as the country: a site makes a subset of
  // what its country makes, so picking one must shrink this list again.
  const products = useQuery(
    productQueries.listOptions({
      search: productSearch || undefined,
      pageSize: 50,
      sortBy: 'name',
      filters: {
        countryId: filters.countryId || undefined,
        facilityId: filters.facilityId || undefined,
      },
    }),
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:gap-x-4">
        <div className="flex w-full min-w-0 flex-col gap-1.5 sm:w-auto">
          <Label htmlFor="filter-country">{t('dashboard.country')}</Label>
          <SearchableSelect
            id="filter-country"
            className="w-full sm:w-auto"
            value={filters.countryId}
            onChange={filters.setCountry}
            onSearch={setCountryTerm}
            isLoading={countries.isFetching}
            placeholder={t('dashboard.anyCountry')}
            allLabel={t('dashboard.anyCountry')}
            options={(countries.data?.items ?? []).map(country => ({
              value: country.id,
              label: country.name,
            }))}
          />
        </div>

        <div className="flex w-full min-w-0 flex-col gap-1.5 sm:w-auto">
          <Label htmlFor="filter-product">{t('dashboard.product')}</Label>
          <SearchableSelect
            id="filter-product"
            className="w-full sm:w-auto"
            value={filters.productId}
            onChange={filters.setProduct}
            onSearch={setProductTerm}
            isLoading={products.isFetching}
            placeholder={t('dashboard.anyProduct')}
            allLabel={t('dashboard.anyProduct')}
            options={(products.data?.items ?? []).map(product => ({
              value: product.id,
              label: product.name,
            }))}
          />
        </div>

        {filters.countryId ? (
          <div className="flex w-full min-w-0 flex-col gap-1.5 sm:w-auto">
            <Label htmlFor="filter-facility">{t('dashboard.facility')}</Label>
            <SearchableSelect
              id="filter-facility"
              className="w-full sm:w-auto"
              value={filters.facilityId}
              onChange={filters.setFacility}
              onSearch={setFacilityTerm}
              isLoading={facilities.isFetching}
              placeholder={t('dashboard.anyFacility')}
              allLabel={t('dashboard.anyFacility')}
              options={(facilities.data?.items ?? []).map(facility => ({
                value: facility.id,
                label: facility.name,
                group: t(`facilities.kinds.${facility.kind}`),
              }))}
            />
          </div>
        ) : null}

        <RangeSelect
          label={t('dashboard.yearRange')}
          options={YEAR_OPTIONS}
          value={{ from: String(filters.yearFrom), to: String(filters.yearTo) }}
          onChange={({ from, to }) => filters.setYearRange(Number(from), Number(to))}
          slots={{
            info: t('dashboard.yearRangeHint'),
            className: 'w-full sm:w-56',
          }}
        />
      </div>

      {/* Its own row. Sharing the wrapping row above meant the control appeared
          and vanished as filters changed, moving everything beside it. */}
      {filters.isFiltered ? (
        <div>
          <Button variant="ghost" size="sm" onClick={filters.reset}>
            <X aria-hidden="true" />
            {t('dashboard.clearFilters')}
          </Button>
        </div>
      ) : null}
    </div>
  )
}
