import { useQuery } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { FacilityRow } from '@/entities/facility'
import { facilityQueries } from '@/entities/facility'
import type { ProductionPoint } from '@/entities/production-record'
import { useMediaQuery } from '@/shared/lib/useMediaQuery'
import { Skeleton } from '@/shared/ui/skeleton'
import { MAP_WIDTH, projectPoint } from '../lib/geography'
import { useMapLabels } from '../lib/useMapLabels'
import { useMapView } from '../lib/useMapView'
import { MapCanvas } from './MapCanvas'
import { MapTooltip } from './MapTooltip'

export interface WorldMapProps {
  points: ReadonlyArray<ProductionPoint>
  selection: { countryId: string; facilityId?: string }
  actions: {
    onSelectCountry: (countryId: string) => void
    /** Selecting a site narrows the analytics to it. */
    onSelectFacility?: (facilityId: string) => void
  }
  display?: {
    isLoading?: boolean
    /** Fill the container rather than holding the drawing's 2:1 aspect. */
    fill?: boolean
    /** `bottom` moves the readout across the foot, which is what fits a phone. */
    tooltipPlacement?: 'corner' | 'bottom'
    /** Hides the keyboard/pointer hint, which has nowhere to go full-screen. */
    hideHint?: boolean
  }
  /** Floating controls drawn over the map — expand, filters, close. */
  overlay?: ReactNode
}

export const WorldMap = ({ points, selection, actions, display, overlay }: WorldMapProps) => {
  const selectedCountryId = selection.countryId
  const selectedFacilityId = selection.facilityId ?? ''
  const isLoading = display?.isLoading ?? false
  const { t } = useTranslation()
  const labels = useMapLabels()
  const [hoveredPoint, setHoveredPoint] = useState<ProductionPoint | null>(null)
  const [hoveredSite, setHoveredSite] = useState<FacilityRow | null>(null)

  /**
   * A touch screen fires `mouseenter` on a tap and never the matching
   * `mouseleave`, so a hovered card there is a card that never goes away —
   * on the phone layout it sat over the map covering everything under it.
   * Where the pointer cannot hover, only the selection opens the card.
   */
  const canHover = useMediaQuery('(hover: hover)')
  const hovered = canHover ? hoveredPoint : null
  const hoveredFacility = canHover ? hoveredSite : null

  const selected = points.find(point => point.countryId === selectedCountryId) ?? null

  // The dot that was clicked already carries the code the zoom needs, so the
  // frame moves with the click rather than after a round trip.
  const { view, isoNumeric } = useMapView({
    countryId: selectedCountryId,
    knownIsoNumeric: selected?.isoNumeric,
  })

  // Only fetched once a country is chosen: at world scale these would be an
  // unreadable cluster, so there is nothing to show and nothing to load.
  const facilities = useQuery({
    ...facilityQueries.listOptions({
      pageSize: 0,
      sortBy: 'name',
      filters: { countryId: selectedCountryId || undefined },
    }),
    enabled: Boolean(selectedCountryId),
  })

  const placed = useMemo(
    () =>
      points.flatMap(point => {
        const position = projectPoint(point.lng, point.lat)
        return position ? [{ point, ...position }] : []
      }),
    [points],
  )

  const placedFacilities = useMemo(
    () =>
      (facilities.data?.items ?? []).flatMap(facility => {
        const position = projectPoint(facility.lng, facility.lat)
        return position ? [{ facility, ...position }] : []
      }),
    [facilities.data],
  )

  const pinnedFacility = selectedFacilityId
    ? (placedFacilities.find(entry => entry.facility.id === selectedFacilityId)?.facility ?? null)
    : null

  // Hovering wins, but with nothing under the pointer the current selection
  // keeps its card on screen — a selection you have to hover to read is one you
  // cannot read and act on at the same time.
  const shownFacility = hoveredFacility ?? (hovered ? null : pinnedFacility)
  const shownPoint = hoveredFacility ? null : (hovered ?? selected)

  /**
   * The card goes to the opposite side of the map from whatever it describes,
   * so it never covers its own subject.
   */
  const tooltipSide = useMemo(() => {
    const subject = shownFacility
      ? projectPoint(shownFacility.lng, shownFacility.lat)
      : shownPoint
        ? projectPoint(shownPoint.lng, shownPoint.lat)
        : null

    if (!subject) return 'start' as const
    return subject.x < MAP_WIDTH / 2 ? ('end' as const) : ('start' as const)
  }, [shownFacility, shownPoint])

  return (
    <div className={display?.fill ? 'relative flex h-full flex-col' : 'relative'}>
      <MapCanvas
        view={view}
        marks={{
          points: placed,
          facilities: placedFacilities,
          isoNumeric,
          isLoading,
          fill: display?.fill,
        }}
        selection={{ countryId: selectedCountryId, facilityId: selectedFacilityId }}
        labels={labels}
        actions={{
          onSelectCountry: actions.onSelectCountry,
          onSelectFacility: actions.onSelectFacility,
          onHoverPoint: setHoveredPoint,
          onHoverFacility: setHoveredSite,
        }}
      />

      {overlay}

      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton className="h-8 w-48" />
        </div>
      ) : null}

      {!isLoading && points.length === 0 ? (
        <p className="bg-card/85 absolute inset-0 flex items-center justify-center text-center">
          <span className="typo-body-sm text-muted-foreground max-w-xs">
            {t('dashboard.mapEmpty')}
          </span>
        </p>
      ) : null}

      <MapTooltip
        point={shownPoint}
        facility={shownFacility}
        side={tooltipSide}
        selected={shownPoint?.countryId === selectedCountryId}
        pinned={!hovered && !hoveredFacility}
        placement={display?.tooltipPlacement}
      />

      {display?.hideHint ? null : (
        <p className="typo-caption text-muted-foreground pt-2">
          {selectedCountryId ? t('dashboard.mapZoomHint') : t('dashboard.mapHint')}
        </p>
      )}
    </div>
  )
}
