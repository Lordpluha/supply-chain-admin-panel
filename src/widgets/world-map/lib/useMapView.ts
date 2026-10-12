import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { countryQueries } from '@/entities/country'
import type { MapView } from './zoom'
import { viewForCountry, WORLD_VIEW } from './zoom'

export interface UseMapViewInput {
  countryId: string
  /**
   * The code already in hand, when the selection came from a dot on the map.
   * The dot carries it, so the zoom needs no request at all.
   */
  knownIsoNumeric?: string
}

export interface UseMapViewResult {
  view: MapView
  /** ISO 3166-1 numeric of the country in frame, or `null` at world scale. */
  isoNumeric: string | null
}

/**
 * Where the map is looking.
 *
 * **Synchronous whenever it can be.** The zoom used to wait on a country
 * request of its own while the analytics request ran beside it, and the two
 * landed at different moments — so a click produced two separate movements
 * instead of one. Every dot already carries its own `isoNumeric`, so selecting
 * one on the map now moves the frame in the same frame as the click.
 *
 * The request stays as the fallback for the cases the map cannot answer
 * itself: a country arrived at from the filter panel, or from a pasted link,
 * that is not among the dots currently plotted. It holds the previous answer
 * while it loads, so the frame never falls back to world scale on the way.
 */
export const useMapView = ({ countryId, knownIsoNumeric }: UseMapViewInput): UseMapViewResult => {
  const country = useQuery({
    ...countryQueries.detailOptions(countryId),
    // Nothing to ask when the caller already knows the answer.
    enabled: Boolean(countryId) && !knownIsoNumeric,
    placeholderData: keepPreviousData,
  })

  const isoNumeric = !countryId ? null : (knownIsoNumeric ?? country.data?.isoNumeric ?? null)

  return {
    view: useMemo(() => (isoNumeric ? viewForCountry(isoNumeric) : WORLD_VIEW), [isoNumeric]),
    isoNumeric,
  }
}
