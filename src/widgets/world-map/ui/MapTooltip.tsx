import type { FacilityRow } from '@/entities/facility'
import type { ProductionPoint } from '@/entities/production-record'
import { cn } from '@/shared/lib/cn'
import { CountryCard } from './CountryCard'
import { FacilityCard } from './FacilityCard'

export interface MapTooltipProps {
  point: ProductionPoint | null
  /** Takes precedence: a facility is the more specific thing to describe. */
  facility?: FacilityRow | null
  /** Which edge to sit on — the caller puts it opposite whatever is hovered. */
  side?: 'start' | 'end'
  selected?: boolean
  /** Held open by a selection rather than by the pointer. */
  pinned?: boolean
  /** `bottom` puts the card across the foot of the map, for narrow screens. */
  placement?: 'corner' | 'bottom'
}

/**
 * The map's readout — the shell that positions it, and nothing about content.
 *
 * `<output>` rather than a `div` with `role="status"`: the element carries that
 * role implicitly, so the markup says it once instead of twice.
 *
 * Anchored to an edge of the panel rather than following the cursor. A tooltip
 * that tracks the pointer is unreachable by keyboard, and the dots are
 * focusable controls — focusing one fills this in exactly as hovering does.
 * The caller flips the edge so the panel never covers the dot it describes.
 */
export const MapTooltip = ({
  point,
  facility,
  side = 'start',
  selected = false,
  pinned = false,
  placement = 'corner',
}: MapTooltipProps) => {
  if (!point && !facility) return null

  return (
    <output
      aria-live="polite"
      className={cn(
        'absolute z-10 flex flex-col gap-2 rounded-lg border p-3 shadow-md backdrop-blur-sm',
        'bg-popover/95 text-popover-foreground pointer-events-none',
        // A pinned card belongs to the selection, and says so, rather than
        // looking like a tooltip the pointer forgot to dismiss.
        pinned ? 'border-primary/40 ring-primary/15 ring-2' : 'border-border',
        placement === 'bottom'
          ? 'inset-x-3 bottom-3 max-h-[45%] overflow-y-auto'
          : cn('top-3 max-w-72', side === 'end' ? 'right-3' : 'left-3'),
      )}
    >
      {facility ? (
        <FacilityCard facility={facility} pinned={pinned} />
      ) : point ? (
        <CountryCard point={point} selected={selected} />
      ) : null}
    </output>
  )
}
