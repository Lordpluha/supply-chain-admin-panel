import type { KeyboardEvent } from 'react'
import { useState } from 'react'
import type { FacilityRow } from '@/entities/facility'
import { FacilityKindIcon } from '@/entities/facility'
import { cn } from '@/shared/lib/cn'

export interface FacilityDotProps {
  facility: FacilityRow
  x: number
  y: number
  /** Marks divide by the view scale so they stay a constant screen size. */
  scale: number
  selected: boolean
  label: string
  onSelect: (facilityId: string) => void
  onHover: (facility: FacilityRow | null) => void
}

const SIZE = 14

/**
 * One production site, shown only once a country is selected and the map has
 * zoomed in. At world scale these would be an unreadable cluster.
 *
 * The glyph says what kind of site it is — a pickaxe for a mine, a factory for
 * a refinery — so a zoomed map reads as a supply chain rather than a field of
 * identical dots. An unrecognised kind falls back to a question mark, which is
 * something a reader will query rather than quietly misread.
 *
 * The focus ring is drawn as SVG, not as a CSS `outline`. An outline on an
 * element inside a transformed group is scaled with it, so at a 16× country
 * zoom a 2px ring renders 32px wide. Dividing by the scale keeps it the size
 * it is supposed to be.
 */
export const FacilityDot = ({
  facility,
  x,
  y,
  scale,
  selected,
  label,
  onSelect,
  onHover,
}: FacilityDotProps) => {
  const [focused, setFocused] = useState(false)
  const size = SIZE / scale
  const radius = size * 0.8

  const handleKeyDown = (event: KeyboardEvent<SVGGElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    onSelect(facility.id)
  }

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={label}
      aria-pressed={selected}
      onClick={() => onSelect(facility.id)}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => onHover(facility)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => {
        setFocused(true)
        onHover(facility)
      }}
      onBlur={() => {
        setFocused(false)
        onHover(null)
      }}
      className="animate-in fade-in cursor-pointer outline-none duration-300"
    >
      {focused ? (
        <circle
          cx={x}
          cy={y}
          r={radius + 4 / scale}
          className="stroke-ring fill-none"
          strokeWidth={2 / scale}
        />
      ) : null}

      {/* A selected site keeps a permanent ring, dashed so it is distinct from
          both the focus ring and a selected country's solid one. */}
      {selected ? (
        <circle
          cx={x}
          cy={y}
          r={radius + 2.5 / scale}
          className="stroke-chart-2 fill-none"
          strokeWidth={2 / scale}
          strokeDasharray={`${3 / scale} ${2 / scale}`}
        />
      ) : null}

      <circle
        cx={x}
        cy={y}
        r={radius}
        strokeWidth={1.5 / scale}
        className={cn(
          'stroke-background transition-colors',
          selected
            ? 'fill-chart-2'
            : facility.status === 'active'
              ? 'fill-chart-3'
              : 'fill-muted-foreground',
        )}
      />

      <FacilityKindIcon
        kind={facility.kind}
        x={x - size / 2}
        y={y - size / 2}
        width={size}
        height={size}
        strokeWidth={2.5}
        className="text-background pointer-events-none"
        aria-hidden="true"
      />
    </g>
  )
}
