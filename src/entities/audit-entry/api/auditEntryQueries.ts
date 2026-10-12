import { queryOptions } from '@tanstack/react-query'
import type { ListQuery } from '@/shared/api'
import { auditEntryService } from './auditEntryService'

const keys = {
  all: ['audit-entries'] as const,
  list: (query?: ListQuery) => ['audit-entries', 'list', query ?? {}] as const,
}

export const auditEntryQueries = {
  keys,
  listOptions: (query?: ListQuery) =>
    queryOptions({
      queryKey: keys.list(query),
      queryFn: () => auditEntryService.list(query),
    }),
}
