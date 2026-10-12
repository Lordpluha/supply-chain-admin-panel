import { useTranslation } from 'react-i18next'
import type { ProductionPoint } from '@/entities/production-record'
import { flagFor } from '@/shared/lib/flag'
import { useFormatters } from '@/shared/lib/useFormatters'

export interface CountryCardProps {
  point: ProductionPoint
  /** Whether this country is the one currently filtering the summary. */
  selected: boolean
}

/** What the readout says about one producing country. */
export const CountryCard = ({ point, selected }: CountryCardProps) => {
  const { t } = useTranslation()
  const fmt = useFormatters()

  const mixed = point.unit === 'mixed'

  return (
    <>
      <div className="flex items-baseline justify-between gap-3">
        <span className="typo-label">
          <span aria-hidden="true">{flagFor(point.iso2)}</span> {point.countryName}
        </span>
        <span className="typo-caption text-muted-foreground">{point.region}</span>
      </div>

      {/* Headline figure. With mixed units there is no honest single total, so
          the money value leads instead — it is the one thing that still adds. */}
      <div className="flex items-baseline justify-between gap-3">
        <span className="typo-h6 tabular-nums">
          {mixed ? fmt.currencyCompact(point.value) : fmt.quantity(point.total, point.unit)}
        </span>
        <span className="typo-caption text-muted-foreground tabular-nums">
          {fmt.percent(point.share).replace('+', '')} {t('dashboard.shareOfTotal')}
        </span>
      </div>

      {!mixed ? (
        <span className="typo-caption text-muted-foreground tabular-nums">
          ≈ {fmt.currencyCompact(point.value)}
        </span>
      ) : null}

      {point.topProducts.length > 0 ? (
        <ul className="border-border flex flex-col gap-0.5 border-t pt-2">
          {point.topProducts.map(product => (
            <li key={product.id} className="flex items-baseline justify-between gap-3">
              <span className="typo-caption truncate">{product.name}</span>
              <span className="typo-caption text-muted-foreground shrink-0 tabular-nums">
                {fmt.quantity(product.total, product.unit)}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="border-border typo-caption text-muted-foreground flex items-baseline justify-between gap-3 border-t pt-2">
        <span>{t('dashboard.facilityCount', { count: point.facilityCount })}</span>
        <span className="tabular-nums">
          {point.firstYear}–{point.lastYear}
        </span>
      </div>

      <span className="typo-caption text-muted-foreground">
        {selected ? t('dashboard.clickToClear') : t('dashboard.clickToFilter')}
      </span>
    </>
  )
}
