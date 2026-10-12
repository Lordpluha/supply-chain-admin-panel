import type { KeyboardEvent } from 'react'
import { useState } from 'react'
import type { ProductionPoint } from '@/entities/production-record'
import { cn } from '@/shared/lib/cn'
import { dotRadius } from '../lib/geography'

export interface MapDotProps {
  point: ProductionPoint
  x: number
  y: number
  selected: boolean
  /** Current view scale; marks divide by it to keep a constant screen size. */
  scale: number
  /** Full sentence — country, output, facilities. Read by a screen reader. */
  label: string
  onSelect: (countryId: string) => void
  onHover: (point: ProductionPoint | null) => void
}

/**
 * A real control, not a decorative circle.
 *
 * SVG has no `<button>`, so the role, the tab stop and the key handling are
 * declared explicitly — otherwise the map would be mouse-only, and the data
 * behind it unreachable. The same numbers also exist in the summary's
 * "by country" list; the map is an additional way to read them, never the only
 * one. See `.claude/rules/a11y.md`.
 *
 * The focus ring is drawn as SVG rather than a CSS `outline`: an outline on an
 * element inside a transformed group scales with it, so at a country zoom a
 * 2px ring renders many times too wide.
 */
export const MapDot = ({ point, x, y, scale, selected, label, onSelect, onHover }: MapDotProps) => {
  const [focused, setFocused] = useState(false)

  // Divided by the view scale, so zooming in magnifies the map but not
  // the marks drawn on top of it.
  const radius = dotRadius(point.intensity) / scale

  const handleKeyDown = (event: KeyboardEvent<SVGGElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    onSelect(point.countryId)
  }

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={label}
      aria-pressed={selected}
      onClick={() => onSelect(point.countryId)}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => onHover(point)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => {
        setFocused(true)
        onHover(point)
      }}
      onBlur={() => {
        setFocused(false)
        onHover(null)
      }}
      className="cursor-pointer outline-none"
    >
      {focused ? (
        <circle
          cx={x}
          cy={y}
          r={radius + 7 / scale}
          className="stroke-ring fill-none"
          strokeWidth={2 / scale}
        />
      ) : null}

      {selected ? (
        <circle
          cx={x}
          cy={y}
          r={radius + 4 / scale}
          className="stroke-ring fill-none"
          strokeWidth={2 / scale}
        />
      ) : null}

      <circle
        cx={x}
        cy={y}
        r={radius}
        strokeWidth={1 / scale}
        className={cn(
          'fill-primary stroke-background transition-[r,opacity] duration-150',
          selected ? 'opacity-100' : 'opacity-80 hover:opacity-100',
        )}
      />
    </g>
  )
}
