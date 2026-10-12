import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Skeleton } from '@/shared/ui/skeleton'

export interface DetailListItem {
  id: string
  primary: ReactNode
  secondary?: ReactNode
  trailing?: ReactNode
}

export interface DetailListProps {
  items: ReadonlyArray<DetailListItem>
  isLoading?: boolean
}

/**
 * The related records hanging off a detail page — the facilities in a country,
 * the products a site makes.
 *
 * A list rather than a table: these are a handful of rows whose job is to be
 * clicked through, and a table's sort, search and pagination chrome around six
 * names is furniture nobody asked for.
 */
export const DetailList = ({ items, isLoading = false }: DetailListProps) => {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2" aria-busy="true">
        <Skeleton className="h-5 w-3/5" />
        <Skeleton className="h-5 w-2/5" />
      </div>
    )
  }

  if (items.length === 0) {
    return <p className="typo-body-sm text-muted-foreground">{t('detail.empty')}</p>
  }

  return (
    <ul className="divide-border flex flex-col divide-y">
      {items.map(item => (
        <li key={item.id} className="flex items-baseline justify-between gap-3 py-2 first:pt-0">
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="typo-body-sm truncate">{item.primary}</span>
            {item.secondary ? (
              <span className="typo-caption text-muted-foreground truncate">{item.secondary}</span>
            ) : null}
          </span>
          {item.trailing ? (
            <span className="typo-caption text-muted-foreground shrink-0 tabular-nums">
              {item.trailing}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  )
}
