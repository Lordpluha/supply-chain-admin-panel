import { useTranslation } from 'react-i18next'
import type { ProductionSummary as Summary } from '@/entities/production-record'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { LabelWithInfo } from '@/shared/ui/info-tooltip'
import { Masonry, MasonryItem } from '@/shared/ui/masonry'
import { Skeleton } from '@/shared/ui/skeleton'
import { ProductionTrend } from './ProductionTrend'
import { SummaryBreakdown } from './SummaryBreakdown'
import { SummaryStats } from './SummaryStats'

export interface ProductionSummaryProps {
  summary: Summary | undefined
  isLoading: boolean
}

/**
 * Four independent panels, packed by masonry rather than stacked in one tall
 * card. They have nothing to do with each other's height — the breakdowns grow
 * with the number of countries in scope, the stats never change size — so
 * letting each find its own row is exactly the case masonry exists for.
 */
export const ProductionSummary = ({ summary, isLoading }: ProductionSummaryProps) => {
  const { t } = useTranslation()

  if (isLoading || !summary) {
    return (
      <Masonry columns={3}>
        {[0, 1, 2].map(index => (
          <MasonryItem key={index}>
            <Card>
              <CardHeader>
                <CardTitle className="typo-h6">
                  <Skeleton className="h-5 w-28" />
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {[0, 1, 2, 3].map(row => (
                  <Skeleton key={row} className="h-8 w-full" />
                ))}
              </CardContent>
            </Card>
          </MasonryItem>
        ))}
      </Masonry>
    )
  }

  const mixed = summary.unit === 'mixed'

  return (
    <Masonry columns={3}>
      <MasonryItem>
        <SummaryStats summary={summary} />
      </MasonryItem>

      <MasonryItem>
        <Card>
          <CardHeader>
            <CardTitle className="typo-h6">
              <LabelWithInfo label={t('dashboard.trendTitle')} info={t('dashboard.trendInfo')} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProductionTrend series={summary.series} unit={summary.unit} />
          </CardContent>
        </Card>
      </MasonryItem>

      <MasonryItem>
        <SummaryBreakdown
          title={t('dashboard.byProduct')}
          info={t('dashboard.byProductInfo')}
          items={summary.byProduct}
        />
      </MasonryItem>

      {/* The map's data in text: the non-visual equivalent, not a nicety. */}
      <MasonryItem>
        <SummaryBreakdown
          title={t('dashboard.byCountry')}
          info={t('dashboard.byCountryInfo')}
          items={summary.byCountry}
          showValueOnly={mixed}
        />
      </MasonryItem>
    </Masonry>
  )
}
