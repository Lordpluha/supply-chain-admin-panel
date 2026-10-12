import type { LinkProps } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'

export interface DetailBackLinkProps {
  to: LinkProps['to']
  label: string
}

/** The way out of a record page, back to the list it came from. */
export const DetailBackLink = ({ to, label }: DetailBackLinkProps) => (
  <Link
    to={to}
    className="typo-caption text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex w-fit items-center gap-1 rounded-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
  >
    <ChevronLeft className="size-3.5" aria-hidden="true" />
    {label}
  </Link>
)
