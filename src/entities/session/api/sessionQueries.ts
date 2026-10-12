import { queryOptions } from '@tanstack/react-query'
import { ApiError } from '@/shared/api'
import { authService } from './authService'

const keys = {
  all: ['session'] as const,
  current: () => ['session', 'current'] as const,
}

export const sessionQueries = {
  keys,

  /**
   * The single source of truth for "who am I". A `401` is a valid answer —
   * signed out — not a failure, so it resolves to `null` rather than throwing
   * and tripping the global error toast.
   */
  currentOptions: () =>
    queryOptions({
      queryKey: keys.current(),
      queryFn: async () => {
        try {
          return await authService.me()
        } catch (error) {
          if (error instanceof ApiError && error.status === 401) return null
          throw error
        }
      },
      staleTime: 5 * 60_000,
      retry: false,
    }),

  loginOptions: () => ({
    mutationFn: authService.login,
    meta: { invalidates: keys.all },
  }),

  logoutOptions: () => ({
    mutationFn: authService.logout,
    meta: { invalidates: keys.all },
  }),
}
