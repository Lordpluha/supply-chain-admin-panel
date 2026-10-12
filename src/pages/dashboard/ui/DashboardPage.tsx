import { useQuery } from '@tanstack/react-query'
import { analyticsQueries } from '@/entities/production-record'
import { useSupplyFilters } from '@/features/supply-filters'
import { useIsMobile } from '@/shared/lib/useMediaQuery'
import { DesktopDashboard } from './DesktopDashboard'
import { MobileDashboard } from './MobileDashboard'

/**
 * Two layouts, one set of queries.
 *
 * A single responsive tree was the other option and would have meant a map that
 * is a panel and a full screen at once, a filter bar that is also a sheet, and
 * a readout in two places — CSS can hide things, but it cannot make a toolbar
 * into a drawer. Branching on the breakpoint keeps each layout honest; the data
 * is fetched here so switching between them re-uses the same cache.
 */
export const DashboardPage = () => {
  const filters = useSupplyFilters()
  const isMobile = useIsMobile()

  const points = useQuery(analyticsQueries.pointsOptions(filters.analytics))
  const summary = useQuery(analyticsQueries.summaryOptions(filters.analytics))

  const props = {
    filters,
    points: { data: points.data ?? [], isLoading: points.isLoading },
    summary: { data: summary.data, isLoading: summary.isLoading },
  }

  return isMobile ? <MobileDashboard {...props} /> : <DesktopDashboard {...props} />
}
