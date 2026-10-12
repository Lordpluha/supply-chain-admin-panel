import type { QueryClient } from '@tanstack/react-query'

/**
 * Handed to every route's `beforeLoad`, so a guard can ask who is signed in
 * before the component renders — and therefore redirect instead of flashing a
 * page the operator is about to be thrown out of.
 */
export interface RouterContext {
  queryClient: QueryClient
}
