import { useTranslation } from 'react-i18next'
import type { ProductionPoint, ProductionSummary } from '@/entities/production-record'
import type { UseSupplyFiltersResult } from '@/features/supply-filters'
import { SupplyFilters } from '@/features/supply-filters'
import { Card, CardContent } from '@/shared/ui/card'
// Aliased: the widget and the entity type it renders share a name.
import { ProductionSummary as ProductionSummaryPanel } from '@/widgets/production-summary'
import { WorldMap } from '@/widgets/world-map'

export interface DesktopDashboardProps {
  filters: UseSupplyFiltersResult
  points: { data: ReadonlyArray<ProductionPoint>; isLoading: boolean }
  summary: { data: ProductionSummary | undefined; isLoading: boolean }
}

export const DesktopDashboard = ({ filters, points, summary }: DesktopDashboardProps) => {
  const { t } = useTranslation()

  return (
    <>
      <header className="flex flex-col gap-1">
        <h1 className="typo-h4 font-heading">{t('dashboard.title')}</h1>
        <p className="typo-body-sm text-muted-foreground">
          {t('dashboard.description', { from: filters.yearFrom, to: filters.yearTo })}
        </p>
      </header>

      <Card>
        <CardContent>
          <SupplyFilters filters={filters} />
        </CardContent>
      </Card>

      {/* The map takes the full width and is deliberately **not** in the
          masonry below: a world map squeezed into a third of the viewport is
          unreadable, and it is the one block whose width is load-bearing. */}
      <Card>
        <CardContent>
          <WorldMap
            points={points.data}
            selection={{ countryId: filters.countryId, facilityId: filters.facilityId }}
            actions={{
              // Clicking the selected dot again clears it, so the map is a
              // filter control rather than a one-way trip.
              onSelectCountry: countryId =>
                filters.setCountry(countryId === filters.countryId ? '' : countryId),
              onSelectFacility: filters.setFacility,
            }}
            display={{ isLoading: points.isLoading }}
          />
        </CardContent>
      </Card>

      <ProductionSummaryPanel summary={summary.data} isLoading={summary.isLoading} />
    </>
  )
}
