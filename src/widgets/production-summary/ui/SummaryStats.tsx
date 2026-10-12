import { useTranslation } from 'react-i18next'
import type { ProductionSummary } from '@/entities/production-record'
import { useFormatters } from '@/shared/lib/useFormatters'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { LabelWithInfo } from '@/shared/ui/info-tooltip'
import { SummaryStat } from './SummaryStat'

export interface SummaryStatsProps {
  summary: ProductionSummary
}

export const SummaryStats = ({ summary }: SummaryStatsProps) => {
  const { t } = useTranslation()
  const fmt = useFormatters()
  const mixed = summary.unit === 'mixed'

  return (
    <Card>
      <CardHeader>
        <CardTitle className="typo-h6">
          <LabelWithInfo label={t('dashboard.summaryTitle')} info={t('dashboard.summaryInfo')} />
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          {/* A grand total across mixed units would be a lie, so it is not
              offered — the per-product breakdown is. Money is the one figure
              that still adds up, so it stays either way. */}
          <SummaryStat
            label={t('dashboard.totalOutput')}
            value={mixed ? '—' : fmt.quantity(summary.total, summary.unit)}
            hint={mixed ? t('dashboard.mixedUnits') : undefined}
          />
          <SummaryStat
            label={t('dashboard.estimatedValue')}
            value={fmt.currencyCompact(summary.totalValue)}
            info={t('dashboard.valueHint')}
          />
          <SummaryStat
            label={t('dashboard.peakYear')}
            value={summary.peakYear ? String(summary.peakYear.year) : '—'}
          />
          <SummaryStat
            label={t('dashboard.growth')}
            value={summary.growth === null ? '—' : fmt.percent(summary.growth)}
            info={t('dashboard.growthInfo')}
          />
        </div>

        <div className="border-border grid grid-cols-4 gap-3 border-t pt-4">
          <SummaryStat label={t('dashboard.countries')} value={fmt.number(summary.countryCount)} />
          <SummaryStat label={t('dashboard.products')} value={fmt.number(summary.productCount)} />
          <SummaryStat
            label={t('dashboard.facilities')}
            value={fmt.number(summary.facilityCount)}
          />
          <SummaryStat label={t('dashboard.records')} value={fmt.number(summary.recordCount)} />
        </div>
      </CardContent>
    </Card>
  )
}
