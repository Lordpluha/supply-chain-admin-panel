import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

export interface AutoWidthProps {
  /** Every label the control can show. The longest one sets the width. */
  labels: ReadonlyArray<string>
  children: ReactNode
  /** Room for whatever sits inside the trigger beside the text — a chevron. */
  trailing?: string
  className?: string
}

/**
 * Sizes a control to its widest possible content, so it stops resizing as the
 * selection changes.
 *
 * A hidden copy of the longest label shares one grid cell with the real
 * control. A grid track is as wide as its widest item, so the cell settles on
 * the sizer's width and the control fills it. The sizer is `aria-hidden` and
 * has no height, so nothing reads or reserves space for it.
 *
 * The alternative — measuring in an effect — costs a layout pass on every
 * render and still flashes at the old width first.
 */
export const AutoWidth = ({ labels, children, trailing = 'pe-9', className }: AutoWidthProps) => {
  const longest = labels.reduce((best, label) => (label.length > best.length ? label : best), '')

  return (
    <span className={cn('inline-grid w-full max-w-full', className)}>
      <span
        aria-hidden="true"
        className={cn(
          'typo-body-sm pointer-events-none invisible col-start-1 row-start-1 h-0 overflow-hidden px-3 whitespace-nowrap',
          trailing,
        )}
      >
        {longest}
      </span>

      <span className="col-start-1 row-start-1 min-w-0">{children}</span>
    </span>
  )
}
