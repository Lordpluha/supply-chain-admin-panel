import { Maximize2, SlidersHorizontal, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ProductionPoint, ProductionSummary } from '@/entities/production-record'
import type { UseSupplyFiltersResult } from '@/features/supply-filters'
import { SupplyFiltersDrawer } from '@/features/supply-filters'
import { Button } from '@/shared/ui/button'
import { Card, CardContent } from '@/shared/ui/card'
// Aliased: the widget and the entity type it renders share a name.
import { ProductionSummary as ProductionSummaryPanel } from '@/widgets/production-summary'
import { WorldMap } from '@/widgets/world-map'

export interface MobileDashboardProps {
  filters: UseSupplyFiltersResult
  points: { data: ReadonlyArray<ProductionPoint>; isLoading: boolean }
  summary: { data: ProductionSummary | undefined; isLoading: boolean }
}

/**
 * The phone layout: the map is the screen, not a panel on it.
 *
 * A filter toolbar, a map and a stack of summary cards do not coexist on a
 * 360px screen — so the filters fold into a bottom sheet behind a floating
 * button, the readout for whatever is selected sits across the foot of the map
 * where a thumb can reach it, and the map itself expands to fill the viewport.
 */
export const MobileDashboard = ({ filters, points, summary }: MobileDashboardProps) => {
  const { t } = useTranslation()
  const [isFilterOpen, setFilterOpen] = useState(false)
  const [isExpanded, setExpanded] = useState(false)

  const mapActions = {
    onSelectCountry: (countryId: string) =>
      filters.setCountry(countryId === filters.countryId ? '' : countryId),
    onSelectFacility: filters.setFacility,
  }

  const controls = (
    <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex justify-between gap-2">
      <Button
        size="sm"
        variant="secondary"
        className="pointer-events-auto shadow-md"
        onClick={() => setFilterOpen(true)}
      >
        <SlidersHorizontal aria-hidden="true" />
        {t('dashboard.filters')}
        {filters.isFiltered ? (
          <span className="bg-primary ml-1 size-2 rounded-full" aria-hidden="true" />
        ) : null}
      </Button>

      <Button
        size="icon"
        variant="secondary"
        className="pointer-events-auto shadow-md"
        onClick={() => setExpanded(!isExpanded)}
        aria-label={isExpanded ? t('dashboard.closeMap') : t('dashboard.expandMap')}
      >
        {isExpanded ? <X aria-hidden="true" /> : <Maximize2 aria-hidden="true" />}
      </Button>
    </div>
  )

  if (isExpanded) {
    return (
      <>
        <div className="bg-background fixed inset-0 z-40 flex flex-col">
          <WorldMap
            points={points.data}
            selection={{ countryId: filters.countryId, facilityId: filters.facilityId }}
            actions={mapActions}
            display={{
              isLoading: points.isLoading,
              fill: true,
              tooltipPlacement: 'bottom',
              hideHint: true,
            }}
            overlay={controls}
          />
        </div>

        <SupplyFiltersDrawer
          filters={filters}
          resultCount={points.data.length}
          open={isFilterOpen}
          onOpenChange={setFilterOpen}
        />
      </>
    )
  }

  return (
    <>
      <header className="flex flex-col gap-1">
        <h1 className="typo-h4 font-heading">{t('dashboard.title')}</h1>
        <p className="typo-body-sm text-muted-foreground">
          {t('dashboard.description', { from: filters.yearFrom, to: filters.yearTo })}
        </p>
      </header>

      <Card>
        <CardContent className="px-0">
          <WorldMap
            points={points.data}
            selection={{ countryId: filters.countryId, facilityId: filters.facilityId }}
            actions={mapActions}
            display={{ isLoading: points.isLoading, tooltipPlacement: 'bottom', hideHint: true }}
            overlay={controls}
          />
        </CardContent>
      </Card>

      <ProductionSummaryPanel summary={summary.data} isLoading={summary.isLoading} />

      <SupplyFiltersDrawer
        filters={filters}
        resultCount={points.data.length}
        open={isFilterOpen}
        onOpenChange={setFilterOpen}
      />
    </>
  )
}
