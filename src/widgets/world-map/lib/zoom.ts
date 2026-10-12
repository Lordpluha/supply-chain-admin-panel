import type { CountryShape } from './geography'
import { COUNTRY_SHAPES, MAP_HEIGHT, MAP_WIDTH } from './geography'

/** How much of the widget a selected country should fill. */
export const COUNTRY_FIT = 0.75

/**
 * A ceiling only for the genuinely tiny — a city state would otherwise zoom to
 * several hundred times and show nothing but its own outline. Every country in
 * this dataset reaches `COUNTRY_FIT` well below it.
 */
export const MAX_ZOOM = 60

export interface MapView {
  /** SVG transform for the whole drawing. */
  transform: string
  /** Scale in force, so marks can be kept a constant size on screen. */
  scale: number
}

export const WORLD_VIEW: MapView = { transform: 'translate(0, 0) scale(1)', scale: 1 }

const viewFor = (centreX: number, centreY: number, scale: number): MapView => ({
  // `translate` then `scale` means the translation is in untransformed units,
  // so this is simply "where the centre should land, minus where scaling puts
  // it".
  transform: `translate(${MAP_WIDTH / 2 - scale * centreX}, ${MAP_HEIGHT / 2 - scale * centreY}) scale(${scale})`,
  scale,
})

/**
 * Fits a country to `COUNTRY_FIT` of the widget.
 *
 * The scale comes from the country's own projected bounding box, so Germany
 * and Australia both end up filling the frame instead of sharing one arbitrary
 * zoom level that suits neither.
 */
export const viewForShape = (shape: CountryShape): MapView => {
  const [[x0, y0], [x1, y1]] = shape.bounds
  const width = Math.max(1, x1 - x0)
  const height = Math.max(1, y1 - y0)

  const scale = Math.min(
    MAX_ZOOM,
    Math.max(1, COUNTRY_FIT * Math.min(MAP_WIDTH / width, MAP_HEIGHT / height)),
  )

  return viewFor((x0 + x1) / 2, (y0 + y1) / 2, scale)
}

/**
 * The shape for an ISO numeric code, or `null`. A country the atlas does not
 * carry simply does not zoom rather than throwing the view somewhere odd.
 */
export const shapeFor = (isoNumeric: string): CountryShape | null =>
  COUNTRY_SHAPES.find(shape => shape.isoNumeric && shape.isoNumeric === isoNumeric) ?? null

export const viewForCountry = (isoNumeric: string): MapView => {
  const shape = shapeFor(isoNumeric)
  return shape ? viewForShape(shape) : WORLD_VIEW
}
