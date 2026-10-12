import type { HttpClient } from '@/shared/api'
import { httpClient, toSearchParams } from '@/shared/api'
import type { AnalyticsFilters, ProductionPoint, ProductionSummary } from '../model/analytics.types'

/**
 * Read-only by design: analytics derives from production records and is never
 * written to, so it implements no write half at all.
 */
export interface AnalyticsService {
  getPoints: (filters: AnalyticsFilters) => Promise<Array<ProductionPoint>>
  getSummary: (filters: AnalyticsFilters) => Promise<ProductionSummary>
}

const asQuery = (filters: AnalyticsFilters) => toSearchParams({ filters: { ...filters } })

export const createAnalyticsService = (http: HttpClient = httpClient): AnalyticsService => ({
  getPoints: filters =>
    http<Array<ProductionPoint>>('/analytics/production-points', { query: asQuery(filters) }),
  getSummary: filters => http<ProductionSummary>('/analytics/summary', { query: asQuery(filters) }),
})

export const analyticsService = createAnalyticsService()
