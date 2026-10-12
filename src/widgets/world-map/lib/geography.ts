import type { GeoPermissibleObjects } from 'd3-geo'
import { geoGraticule10, geoNaturalEarth1, geoPath } from 'd3-geo'
import type { FeatureCollection, Geometry } from 'geojson'
import { feature } from 'topojson-client'
import type { GeometryCollection, Topology } from 'topojson-specification'
import worldAtlas from 'world-atlas/countries-110m.json'

/**
 * The drawing surface. Every coordinate the map produces is in this space and
 * the SVG scales through `viewBox`, so the projection is computed once rather
 * than on every resize.
 */
export const MAP_WIDTH = 960
export const MAP_HEIGHT = 480

/**
 * Natural Earth II, chosen over Mercator deliberately: this dataset is Congo,
 * Indonesia and Chile as much as it is Germany, and Mercator would inflate the
 * north at their expense. See DESIGN.md § The world map.
 */
export const projection = geoNaturalEarth1().fitSize([MAP_WIDTH, MAP_HEIGHT], { type: 'Sphere' })

const pathBuilder = geoPath(projection)

export const toPath = (object: GeoPermissibleObjects): string => pathBuilder(object) ?? ''

export const SPHERE_PATH = toPath({ type: 'Sphere' })
export const GRATICULE_PATH = toPath(geoGraticule10())

export interface CountryShape {
  /**
   * ISO 3166-1 numeric, as `world-atlas` keys its features — or an empty
   * string for the handful of shapes the atlas ships without an id.
   */
  isoNumeric: string
  /** Unique per shape, which `isoNumeric` is not: several have no id at all. */
  key: string
  path: string
  /**
   * Projected bounding box, `[[x0, y0], [x1, y1]]`. Computed once here so a
   * zoom can be fitted to the country's actual extent rather than guessing a
   * scale — see `lib/zoom.ts`.
   */
  bounds: [[number, number], [number, number]]
}

const topology = worldAtlas as unknown as Topology

/**
 * Built once at module load. The 110m resolution is ~110 KB and renders as a
 * few hundred paths — enough detail at this size, and cheap enough that the
 * land can paint immediately while the dots are still loading.
 */
export const COUNTRY_SHAPES: ReadonlyArray<CountryShape> = (() => {
  const collection = feature(
    topology,
    topology.objects.countries as GeometryCollection,
  ) as FeatureCollection<Geometry>

  return collection.features.map((item, index) => {
    const rawId = item.id == null ? '' : String(item.id)

    return {
      // `world-atlas` ids are numeric strings, occasionally without the
      // leading zero the ISO standard uses — pad so `36` matches Australia's
      // `036`. Shapes with no id keep an empty string rather than padding to
      // `000`, which would make every one of them look like the same country.
      isoNumeric: rawId ? rawId.padStart(3, '0') : '',
      key: rawId ? rawId.padStart(3, '0') : `unnamed-${index}`,
      path: toPath(item),
      bounds: pathBuilder.bounds(item),
    }
  })
})()

export interface Projected {
  x: number
  y: number
}

/** `null` when the point falls outside the projection's clip. */
export const projectPoint = (lng: number, lat: number): Projected | null => {
  const projected = projection([lng, lat])
  return projected ? { x: projected[0], y: projected[1] } : null
}

/**
 * Area — not radius — is proportional to output, because area is what the eye
 * compares. Taking the square root of the intensity gives that, and the floor
 * keeps the smallest producer clickable rather than a dot nobody can hit.
 */
export const MIN_DOT_RADIUS = 3
export const MAX_DOT_RADIUS = 18

export const dotRadius = (intensity: number): number =>
  MIN_DOT_RADIUS +
  Math.sqrt(Math.max(0, Math.min(1, intensity))) * (MAX_DOT_RADIUS - MIN_DOT_RADIUS)
