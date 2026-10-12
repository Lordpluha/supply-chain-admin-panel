import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'
import { useCallback, useMemo } from 'react'
import type { AnalyticsFilters } from '@/entities/production-record'
import { YEAR_MAX, YEAR_MIN } from '@/shared/config/constants'

export const supplyFilterParsers = {
  countryId: parseAsString.withDefault(''),
  /** Narrows to one site. Only meaningful once a country is chosen. */
  facilityId: parseAsString.withDefault(''),
  productId: parseAsString.withDefault(''),
  yearFrom: parseAsInteger.withDefault(YEAR_MIN),
  yearTo: parseAsInteger.withDefault(YEAR_MAX),
}

export interface UseSupplyFiltersResult {
  countryId: string
  facilityId: string
  productId: string
  yearFrom: number
  yearTo: number
  /** Ready for `analyticsQueries`. */
  analytics: AnalyticsFilters
  setCountry: (countryId: string) => void
  setFacility: (facilityId: string) => void
  setProduct: (productId: string) => void
  setYearRange: (from: number, to: number) => void
  reset: () => void
  isFiltered: boolean
}

export const useSupplyFilters = (): UseSupplyFiltersResult => {
  const [state, setState] = useQueryStates(supplyFilterParsers, { history: 'replace' })

  const analytics = useMemo<AnalyticsFilters>(
    () => ({
      countryId: state.countryId || undefined,
      facilityId: state.facilityId || undefined,
      productId: state.productId || undefined,
      yearFrom: state.yearFrom,
      yearTo: state.yearTo,
    }),
    [state.countryId, state.facilityId, state.productId, state.yearFrom, state.yearTo],
  )

  const setCountry = useCallback(
    (countryId: string) => {
      void setState({
        countryId: countryId || null,
        // A facility belongs to one country, so changing the country always
        // invalidates it — keeping it would filter to a site that is no longer
        // in scope and quietly return nothing.
        facilityId: null,
      })
    },
    [setState],
  )

  const setFacility = useCallback(
    (facilityId: string) => {
      void setState({ facilityId: facilityId || null })
    },
    [setState],
  )

  const setProduct = useCallback(
    (productId: string) => {
      void setState({ productId: productId || null })
    },
    [setState],
  )

  // The range is kept ordered here rather than trusted from the URL: a pasted
  // link with `yearFrom` after `yearTo` would otherwise return nothing at all.
  const setYearRange = useCallback(
    (from: number, to: number) => {
      const low = Math.max(YEAR_MIN, Math.min(from, to))
      const high = Math.min(YEAR_MAX, Math.max(from, to))
      void setState({ yearFrom: low, yearTo: high })
    },
    [setState],
  )

  const reset = useCallback(() => {
    void setState(null)
  }, [setState])

  return {
    ...state,
    analytics,
    setCountry,
    setFacility,
    setProduct,
    setYearRange,
    reset,
    isFiltered:
      Boolean(state.countryId) ||
      Boolean(state.facilityId) ||
      Boolean(state.productId) ||
      state.yearFrom !== YEAR_MIN ||
      state.yearTo !== YEAR_MAX,
  }
}
