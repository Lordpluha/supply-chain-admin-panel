import type { QueryKey } from '@tanstack/react-query'
import { MutationCache, QueryClient } from '@tanstack/react-query'
import i18next from 'i18next'
import { toast } from 'sonner'
import { ApiError } from '@/shared/api'
import { errorDetail, errorMessageKey, placementOf } from '@/shared/lib/errors'

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      /** Cache keys invalidated once this mutation succeeds. */
      invalidates?: QueryKey
      /**
       * Set by a surface that renders this mutation's failure itself. The
       * global toast then stays out of the way instead of saying the same
       * thing twice, in a place the reader is not looking.
       */
      silenceErrorToast?: boolean
    }
  }
}

/**
 * Global failures surface as a toast; per-field validation does not.
 *
 * A 400 carrying a `fields` map is the server telling a form which inputs to
 * mark — that belongs beside the input, where the operator can act on it. A
 * toast for it would name no field and vanish on a timer.
 */
const reportMutationError = (error: unknown): void => {
  if (placementOf(error) === 'field') return

  const detail = errorDetail(error)
  const message = i18next.t(errorMessageKey(error))

  toast.error(message, detail ? { description: detail } : undefined)
}

export const createQueryClient = (): QueryClient => {
  const client: QueryClient = new QueryClient({
    mutationCache: new MutationCache({
      // One subscriber performs every invalidation, reading the keys a mutation
      // declared in `meta.invalidates`. That is why no component in this
      // codebase calls `invalidateQueries` itself.
      onSuccess: (_data, _variables, _context, mutation) => {
        const { invalidates } = mutation.meta ?? {}
        if (invalidates) void client.invalidateQueries({ queryKey: invalidates })
      },
      onError: (error, _variables, _context, mutation) => {
        if (mutation.meta?.silenceErrorToast) return
        reportMutationError(error)
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          // A refused or missing resource will not become available by asking
          // again; only transient failures are worth a retry.
          if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
            return false
          }
          return failureCount < 2
        },
      },
      mutations: {
        retry: false,
      },
    },
  })

  return client
}
