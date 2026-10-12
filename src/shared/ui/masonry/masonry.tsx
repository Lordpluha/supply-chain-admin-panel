import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

export interface MasonryProps {
  children: ReactNode
  /** Columns at the `lg` breakpoint and up. Below that it steps down to 1–2. */
  columns?: 2 | 3 | 4
  className?: string
}

const COLUMN_CLASSES = {
  2: 'sm:columns-2',
  3: 'sm:columns-2 xl:columns-3',
  4: 'sm:columns-2 xl:columns-3 2xl:columns-4',
} as const

/**
 * Masonry packing for cards of unequal height.
 *
 * Built on CSS multi-column rather than the native `grid-template-rows:
 * masonry`, which is still behind a flag outside Safari and would leave most of
 * this project's supported browsers with a single column. A JavaScript masonry
 * library was the other option and buys nothing here: no measuring, no resize
 * observer, no layout thrash — the browser does it.
 *
 * The trade-off worth knowing: multi-column flows **top-to-bottom, then
 * across**, so reading order follows each column rather than each row. That is
 * correct for a set of independent panels and wrong for anything sequential —
 * do not use it for a form or a list of steps.
 */
export const Masonry = ({ children, columns = 2, className }: MasonryProps) => (
  <div className={cn('columns-1 gap-6 [column-fill:_balance]', COLUMN_CLASSES[columns], className)}>
    {children}
  </div>
)

export interface MasonryItemProps {
  children: ReactNode
  className?: string
}

/**
 * One cell. `break-inside-avoid` is what stops a card being sliced across a
 * column boundary; `mb-6` does the vertical gap, because `gap` only applies
 * between columns in a multi-column layout.
 */
export const MasonryItem = ({ children, className }: MasonryItemProps) => (
  <div className={cn('mb-6 break-inside-avoid', className)}>{children}</div>
)
