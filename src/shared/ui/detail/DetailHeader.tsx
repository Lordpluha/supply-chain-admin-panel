import type { ReactNode } from 'react'

export interface DetailHeaderProps {
  title: ReactNode
  description?: ReactNode
  /** A link back to the list this record came from. */
  back?: ReactNode
  actions?: ReactNode
}

/**
 * The top of a record page. The back link sits above the title rather than
 * beside it: a detail page reached from a filtered list needs an obvious way
 * home, and a crumb below the heading is one people read as decoration.
 */
export const DetailHeader = ({ title, description, back, actions }: DetailHeaderProps) => (
  <header className="flex flex-col gap-2">
    {back}

    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex min-w-0 flex-col gap-1">
        <h1 className="typo-h4 font-heading flex items-center gap-2">{title}</h1>
        {description ? <p className="typo-body-sm text-muted-foreground">{description}</p> : null}
      </div>

      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  </header>
)
