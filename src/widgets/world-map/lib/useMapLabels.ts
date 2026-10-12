import { useTranslation } from 'react-i18next'
import type { FacilityRow } from '@/entities/facility'
import type { ProductionPoint } from '@/entities/production-record'
import { useFormatters } from '@/shared/lib/useFormatters'

export interface MapLabels {
  describePoint: (point: ProductionPoint) => string
  describeFacility: (facility: FacilityRow) => string
}

/**
 * Accessible names for the marks.
 *
 * A screen reader never sees the tooltip, so each dot's own name has to carry
 * what the tooltip would have shown — the map must not be the only way to read
 * any of this.
 */
export const useMapLabels = (): MapLabels => {
  const { t } = useTranslation()
  const fmt = useFormatters()

  const describePoint = (point: ProductionPoint) =>
    [
      point.countryName,
      point.unit === 'mixed'
        ? fmt.currencyCompact(point.value)
        : fmt.quantity(point.total, point.unit),
      `${fmt.percent(point.share).replace('+', '')} ${t('dashboard.shareOfTotal')}`,
      t('dashboard.facilityCount', { count: point.facilityCount }),
      `${point.firstYear}–${point.lastYear}`,
      point.topProducts.map(product => product.name).join(', '),
    ]
      .filter(Boolean)
      .join(', ')

  const describeFacility = (facility: FacilityRow) =>
    [
      facility.name,
      t(`facilities.kinds.${facility.kind}`),
      t(`facilities.status${facility.status[0].toUpperCase()}${facility.status.slice(1)}` as never),
      `${t('facilities.capacity')} ${fmt.number(facility.capacity)}`,
      facility.productNames.join(', '),
    ]
      .filter(Boolean)
      .join(', ')

  return { describePoint, describeFacility }
}
