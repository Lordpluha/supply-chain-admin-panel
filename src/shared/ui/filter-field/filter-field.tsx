import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
import { Label } from '../label'

export interface FilterFieldProps {
  label: string
  /**
   * Set when the control is a real form element. A `<label for>` only binds to
   * labelable elements, so a select whose trigger is a `<button>` leaves this
   * out and carries its own `aria-label` instead — see below.
   */
  htmlFor?: string
  children: ReactNode
  className?: string
}

/**
 * A caption above a filter control.
 *
 * A row of bare selects reading "All", "All", "All" says nothing about what is
 * being filtered; the placeholder only names the current value, never the
 * question. The label is what makes a toolbar readable at a glance.
 *
 * Without `htmlFor` the caption is `aria-hidden`: the control it sits above
 * already carries the same string as its `aria-label`, and announcing it twice
 * is worse than announcing it once. The two are read from the same translation
 * key, so they cannot drift apart.
 */
export const FilterField = ({ label, htmlFor, children, className }: FilterFieldProps) => (
  <div className={cn('flex min-w-0 flex-col gap-1', className)}>
    {htmlFor ? (
      <Label htmlFor={htmlFor} className="typo-caption text-muted-foreground font-normal">
        {label}
      </Label>
    ) : (
      <span className="typo-caption text-muted-foreground" aria-hidden="true">
        {label}
      </span>
    )}
    {children}
  </div>
)
