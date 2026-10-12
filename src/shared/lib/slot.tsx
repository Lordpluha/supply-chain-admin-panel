import { cn } from 'cn'
import type { ReactElement, ReactNode } from 'react'
import { cloneElement, isValidElement } from 'react'

export interface SlotProps extends Record<string, unknown> {
  children?: ReactNode
  className?: string
}

/**
 * Merges its own props onto a single child element instead of rendering a
 * wrapper. Lets `asChild` keep the caller's element (and its semantics) while
 * still picking up the parent's classes.
 */
export const Slot = ({ children, className, ...props }: SlotProps) => {
  if (!isValidElement(children)) return null

  const child = children as ReactElement<{ className?: string }>

  return cloneElement(child, {
    ...props,
    ...child.props,
    className: cn(className, child.props.className),
  })
}
