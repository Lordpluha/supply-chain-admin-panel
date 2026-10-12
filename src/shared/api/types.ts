/** A value object every listed resource shares. */
export interface Identifiable {
  id: string
}

export type SortDirection = 'asc' | 'desc'

/**
 * Query envelope accepted by every list endpoint. `filters` stays open so a
 * resource can narrow by any of its own fields without widening this contract
 * for the resources that do not need it.
 */
export interface ListQuery {
  search?: string
  page?: number
  pageSize?: number
  sortBy?: string
  sortDir?: SortDirection
  filters?: Record<string, string | number | Array<string | number> | undefined>
}

export interface Paginated<T> {
  items: Array<T>
  total: number
  page: number
  pageSize: number
}

export interface ApiErrorBody {
  message: string
  code?: string
  fields?: Record<string, string>
}
