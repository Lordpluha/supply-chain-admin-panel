import type { LucideIcon } from 'lucide-react'
import { CircleHelp, PlugZap, SearchX, ShieldAlert, TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
import { useDocumentTitle } from '@/shared/lib/pageTitle'

/** The kinds of failure that get a whole screen rather than a toast. */
export type ErrorCode = '403' | '404' | '500' | 'offline'

/**
 * One icon per kind, with a question mark for anything unrecognised — the same
 * choice made for facility kinds, and for the same reason: a code added here
 * and forgotten shows a glyph someone will query rather than one that quietly
 * misleads.
 */
const ICONS: Record<ErrorCode, LucideIcon> = {
  '403': ShieldAlert,
  '404': SearchX,
  '500': TriangleAlert,
  offline: PlugZap,
}

export interface ErrorPageProps {
  code: ErrorCode
  title: string
  description: string
  /** A quotable identifier — the path that missed, the permission, the reason. */
  detail?: ReactNode
  /** What the operator can do about it. Always give at least one way out. */
  actions?: ReactNode
}

/**
 * The block every error screen is built from, so a 404 and a crash are
 * recognisably the same family rather than two people's idea of a sad face.
 *
 * It sets no height of its own: dropped into the panel's content area it fills
 * what is there, and `FullPageError` wraps it for the screens that stand alone.
 * A component that insisted on `min-h-svh` would push the shell's own scroll.
 *
 * The code is shown as text beside the icon rather than as the usual enormous
 * numeral. "404" at 8rem is decoration; what a reader needs is the sentence.
 */
export const ErrorPage = ({ code, title, description, detail, actions }: ErrorPageProps) => {
  // Set here rather than at each call site: every use of this component is a
  // full error screen, and a tab still naming the screen the operator came
  // from is its own small lie. Navigating away restores the route's own head.
  useDocumentTitle(title)

  const Icon = ICONS[code] ?? CircleHelp

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-6 py-16 text-center">
      <span className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-full">
        <Icon className="size-6" aria-hidden="true" />
      </span>

      <div className="flex flex-col gap-2">
        <h1 className="typo-h4 font-heading">{title}</h1>
        <p className="typo-body-sm text-muted-foreground">{description}</p>
      </div>

      {detail ? (
        <div className="border-border bg-muted/50 typo-code text-muted-foreground w-full overflow-x-auto rounded-md border px-3 py-2 text-start">
          {detail}
        </div>
      ) : null}

      {actions ? <div className="flex flex-wrap justify-center gap-2">{actions}</div> : null}

      {/* The code is for a bug report, not for the reader: last, and small. Not faded
          further — at 70% opacity it fell to 3.5:1. */}
      <span className="typo-caption text-muted-foreground">{code}</span>
    </div>
  )
}

export interface FullPageErrorProps extends ErrorPageProps {
  className?: string
}

/** The same block on a screen of its own — no shell around it to fill. */
export const FullPageError = ({ className, ...props }: FullPageErrorProps) => (
  <main className={cn('flex min-h-svh flex-col justify-center', className)}>
    <ErrorPage {...props} />
  </main>
)
