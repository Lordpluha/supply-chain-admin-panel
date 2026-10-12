import { useTranslation } from 'react-i18next'
import type { FacilityRow } from '@/entities/facility'
import type { ProductionPoint } from '@/entities/production-record'
import type { Projected } from '../lib/geography'
import {
  COUNTRY_SHAPES,
  GRATICULE_PATH,
  MAP_HEIGHT,
  MAP_WIDTH,
  SPHERE_PATH,
} from '../lib/geography'
import type { MapLabels } from '../lib/useMapLabels'
import type { MapView } from '../lib/zoom'
import { FacilityDot } from './FacilityDot'
import { MapDot } from './MapDot'

export interface PlacedPoint extends Projected {
  point: ProductionPoint
}

export interface PlacedFacility extends Projected {
  facility: FacilityRow
}

export interface MapCanvasProps {
  view: MapView
  marks: {
    points: ReadonlyArray<PlacedPoint>
    facilities: ReadonlyArray<PlacedFacility>
    /** The country in frame, which is drawn as the highlighted shape. */
    isoNumeric: string | null
    isLoading: boolean
    /** Fill the container rather than keeping the drawing's 2:1 aspect. */
    fill?: boolean
  }
  selection: { countryId: string; facilityId: string }
  labels: MapLabels
  actions: {
    onSelectCountry: (countryId: string) => void
    onSelectFacility?: (facilityId: string) => void
    onHoverPoint: (point: ProductionPoint | null) => void
    onHoverFacility: (facility: FacilityRow | null) => void
  }
}

/**
 * The drawing itself: land, graticule and marks under one transform.
 *
 * One group carries the whole view, so zooming is a single transform rather
 * than a re-projection of every shape. Marks divide by the scale to keep a
 * constant size on screen, and `motion-reduce` drops the animation for anyone
 * who asked for that.
 */
export const MapCanvas = ({ view, marks, selection, labels, actions }: MapCanvasProps) => {
  const { t } = useTranslation()
  const producing = new Set(marks.points.map(entry => entry.point.isoNumeric))

  return (
    <svg
      viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
      className={marks.fill ? 'h-full w-full' : 'h-auto w-full'}
      role="img"
      aria-label={t('dashboard.mapTitle')}
    >
      <title>{t('dashboard.mapTitle')}</title>

      <g
        transform={view.transform}
        className="transition-transform duration-500 ease-out motion-reduce:transition-none"
      >
        {/* The sphere is inside the transform, not outside it: left out, the
            globe's outline stays at world scale and hangs around a country that
            has been zoomed to fill the frame. */}
        <path d={SPHERE_PATH} className="fill-map-ocean" />

        <path
          d={GRATICULE_PATH}
          className="stroke-map-graticule fill-none"
          strokeWidth={0.4 / view.scale}
        />

        {COUNTRY_SHAPES.map(shape => (
          <path
            key={shape.key}
            d={shape.path}
            className={
              shape.isoNumeric && shape.isoNumeric === marks.isoNumeric
                ? 'fill-primary/30 stroke-primary'
                : producing.has(shape.isoNumeric)
                  ? 'fill-primary/15 stroke-map-land-stroke'
                  : 'fill-map-land stroke-map-land-stroke'
            }
            strokeWidth={0.4 / view.scale}
          />
        ))}

        {!marks.isLoading &&
          marks.points.map(({ point, x, y }) => (
            <MapDot
              key={point.countryId}
              point={point}
              x={x}
              y={y}
              scale={view.scale}
              selected={point.countryId === selection.countryId}
              label={labels.describePoint(point)}
              onSelect={actions.onSelectCountry}
              onHover={actions.onHoverPoint}
            />
          ))}

        {/* Facility detail exists only at country zoom, and fades in when its
            own request lands rather than arriving as a pop. */}
        {selection.countryId
          ? marks.facilities.map(({ facility, x, y }) => (
              <FacilityDot
                key={facility.id}
                facility={facility}
                x={x}
                y={y}
                scale={view.scale}
                selected={facility.id === selection.facilityId}
                label={labels.describeFacility(facility)}
                onSelect={id =>
                  // Selecting the same site again clears it, matching the
                  // country dots' behaviour.
                  actions.onSelectFacility?.(id === selection.facilityId ? '' : id)
                }
                onHover={actions.onHoverFacility}
              />
            ))
          : null}
      </g>
    </svg>
  )
}
