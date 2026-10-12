import { useQuery } from '@tanstack/react-query'
import type { PermissionSubject } from '@/entities/access'
import { toPermissionSubject } from '../lib/toPermissionSubject'
import type { SessionUser } from '../model/session.schema'
import { sessionQueries } from './sessionQueries'

export interface UseSessionResult {
  user: SessionUser | null
  subject: PermissionSubject | null
  isLoading: boolean
}

/**
 * The hooks-wrapping convention: UI asks `useSession()`, never
 * `useQuery(sessionQueries.currentOptions())`. The `subject` adaptation for
 * `hasPermission` lives here rather than at every call site.
 */
export const useSession = (): UseSessionResult => {
  const { data, isLoading } = useQuery(sessionQueries.currentOptions())
  const user = data?.user ?? null

  return { user, subject: toPermissionSubject(user), isLoading }
}
