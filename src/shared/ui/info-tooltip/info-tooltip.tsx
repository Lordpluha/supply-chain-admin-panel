import { Info } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip'

export interface InfoTooltipProps {
  /** What the tooltip explains. Also becomes the button's accessible name. */
  label: string
  children: ReactNode
  className?: string
}

/**
 * A small "what is this" affordance beside a heading or a figure.
 *
 * It is a real `<button type="button">`, not an icon with a `title`:
 *
 * - `title` appears on hover only, so a keyboard or touch reader never sees it;
 * - a focusable button puts the explanation in the tab order, and Base UI's
 *   tooltip opens on focus as well as hover.
 *
 * `label` is the accessible name — the icon carries no text, so without one the
 * control announces as "button" and nothing else.
 */
export const InfoTooltip = ({ label, children, className }: InfoTooltipProps) => (
  <Tooltip>
    <TooltipTrigger
      render={
        <button
          type="button"
          aria-label={label}
          className={cn(
            'text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex size-4 shrink-0 items-center justify-center rounded-full align-middle transition-colors focus-visible:ring-2 focus-visible:outline-none',
            className,
          )}
        >
          <Info className="size-3.5" aria-hidden="true" />
        </button>
      }
    />
    <TooltipContent className="max-w-64 text-pretty">{children}</TooltipContent>
  </Tooltip>
)

export interface LabelWithInfoProps {
  label: string
  info: ReactNode
  /** Announced on the info button; defaults to the label it sits beside. */
  infoLabel?: string
  className?: string
}

/** A heading or field label with its explanation tucked behind an icon. */
export const LabelWithInfo = ({ label, info, infoLabel, className }: LabelWithInfoProps) => (
  <span className={cn('inline-flex items-center gap-1.5', className)}>
    {label}
    <InfoTooltip label={infoLabel ?? label}>{info}</InfoTooltip>
  </span>
)
