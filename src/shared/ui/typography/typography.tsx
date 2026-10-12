import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import type { ElementType, HTMLAttributes, PropsWithChildren } from 'react'
import { Slot } from '@/shared/lib/slot'

/**
 * Every variant maps onto a `typo-*` utility, which in turn reads the semantic
 * tokens in `app/styles/typography.css`. No size is ever written inline, so the
 * whole scale changes from one place and stays in `rem`.
 */
export const typographyVariants = cva('', {
  variants: {
    size: {
      display: 'typo-display',
      h1: 'typo-h1',
      h2: 'typo-h2',
      h3: 'typo-h3',
      h4: 'typo-h4',
      h5: 'typo-h5',
      h6: 'typo-h6',
      bodyLg: 'typo-body-lg',
      body: 'typo-body',
      bodySm: 'typo-body-sm',
      label: 'typo-label',
      caption: 'typo-caption',
      overline: 'typo-overline',
      button: 'typo-button',
      code: 'typo-code',
    },
    tone: {
      default: '',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
      destructive: 'text-destructive',
      success: 'text-success',
      warning: 'text-warning',
    },
  },
  defaultVariants: {
    size: 'body',
    tone: 'default',
  },
})

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

const HEADING_SIZE = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
} as const satisfies Record<HeadingLevel, NonNullable<TypographyBaseProps['size']>>

export interface TypographyBaseProps
  extends VariantProps<typeof typographyVariants>,
    Omit<HTMLAttributes<HTMLElement>, 'color'> {}

/**
 * At most one of these three ways of choosing the element, never two at once —
 * a heading level, an explicit tag, or the caller's own child. Passing none of
 * them renders a `<p>`, which is the common case.
 */
export type TypographyFeatureProps =
  | { level: HeadingLevel; as?: undefined; asChild?: false }
  | { as: ElementType; level?: undefined; asChild?: false }
  | { asChild: true; level?: undefined; as?: undefined }
  | { level?: undefined; as?: undefined; asChild?: false }

export type TypographyProps = TypographyBaseProps & TypographyFeatureProps

export const Typography = ({
  children,
  className,
  level,
  size,
  tone,
  asChild = false,
  as,
  ...props
}: PropsWithChildren<TypographyProps>) => {
  const Element: ElementType = asChild
    ? Slot
    : (as ?? (level !== undefined ? (`h${level}` as ElementType) : 'p'))

  // A heading with no explicit size takes the size matching its level.
  const resolvedSize = size ?? (level !== undefined ? HEADING_SIZE[level] : undefined)

  return (
    <Element
      className={typographyVariants({ size: resolvedSize, tone, className })}
      data-level={level}
      {...props}
    >
      {children}
    </Element>
  )
}
