import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import type { AnalyticsFilters } from '../model/analytics.types'
import { analyticsService } from './analyticsService'

const keys = {
  all: ['analytics'] as const,
  points: (filters: AnalyticsFilters) => ['analytics', 'points', filters] as const,
  summary: (filters: AnalyticsFilters) => ['analytics', 'summary', filters] as const,
}

export const analyticsQueries = {
  keys,
  pointsOptions: (filters: AnalyticsFilters) =>
    queryOptions({
      queryKey: keys.points(filters),
      queryFn: () => analyticsService.getPoints(filters),
      // Every filter change is a new key, and without this the map would empty
      // itself between the old answer and the new one — the dots disappear, the
      // zoom falls back to world scale, and the transition plays twice.
      placeholderData: keepPreviousData,
    }),
  summaryOptions: (filters: AnalyticsFilters) =>
    queryOptions({
      queryKey: keys.summary(filters),
      queryFn: () => analyticsService.getSummary(filters),
      placeholderData: keepPreviousData,
    }),
}
