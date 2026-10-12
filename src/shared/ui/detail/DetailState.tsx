import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert'
import { Skeleton } from '@/shared/ui/skeleton'

export interface DetailQuery<T> {
  data: T | undefined
  isLoading: boolean
  isError: boolean
}

export interface DetailStateProps<T> {
  query: DetailQuery<T>
  children: (value: T) => ReactNode
}

/**
 * Loading, gone, and present — the three states a record page has, in one
 * place so that five of them do not each invent their own.
 *
 * A finished request with no record is reported as "no longer exists" rather
 * than as a blank page: an id in the address bar that resolves to nothing is
 * almost always a deleted row or a mistyped link, and both deserve saying.
 */
export const DetailState = <T,>({ query, children }: DetailStateProps<T>) => {
  const { t } = useTranslation()

  if (query.isLoading) {
    return (
      <div className="flex flex-col gap-3" aria-busy="true">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (query.isError || !query.data) {
    return (
      <Alert variant="destructive">
        <AlertTitle>{t('errors.notFoundTitle')}</AlertTitle>
        <AlertDescription>{t('errors.notFound')}</AlertDescription>
      </Alert>
    )
  }

  return <>{children(query.data)}</>
}
