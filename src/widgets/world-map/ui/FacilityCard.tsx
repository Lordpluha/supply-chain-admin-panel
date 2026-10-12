import { useTranslation } from 'react-i18next'
import type { FacilityRow } from '@/entities/facility'
import { FacilityKindIcon } from '@/entities/facility'
import { flagFor } from '@/shared/lib/flag'
import { useFormatters } from '@/shared/lib/useFormatters'

export interface FacilityCardProps {
  facility: FacilityRow
  /** Held open by a selection rather than by the pointer. */
  pinned: boolean
}

/** What the readout says about one production site. */
export const FacilityCard = ({ facility, pinned }: FacilityCardProps) => {
  const { t } = useTranslation()
  const fmt = useFormatters()

  return (
    <>
      <div className="flex items-start gap-2">
        <FacilityKindIcon
          kind={facility.kind}
          className="text-muted-foreground mt-0.5 size-4 shrink-0"
          aria-hidden="true"
        />
        <div className="flex min-w-0 flex-col">
          <span className="typo-label truncate">{facility.name}</span>
          <span className="typo-caption text-muted-foreground">
            {t(`facilities.kinds.${facility.kind}`)} ·{' '}
            {t(
              `facilities.status${facility.status[0].toUpperCase()}${facility.status.slice(1)}` as never,
            )}
          </span>
        </div>
      </div>

      <div className="border-border flex items-baseline justify-between gap-3 border-t pt-2">
        <span className="typo-caption text-muted-foreground">{t('facilities.capacity')}</span>
        <span className="typo-body-sm tabular-nums">{fmt.number(facility.capacity)}</span>
      </div>

      {facility.productNames.length > 0 ? (
        <div className="border-border flex flex-col gap-0.5 border-t pt-2">
          <span className="typo-caption text-muted-foreground">{t('facilities.products')}</span>
          {facility.productNames.map(name => (
            <span key={name} className="typo-caption truncate">
              {name}
            </span>
          ))}
        </div>
      ) : null}

      <span className="typo-caption text-muted-foreground border-border border-t pt-2">
        {/* Emoji flag, or a question mark when the code cannot be resolved. */}
        <span aria-hidden="true">{flagFor(facility.countryIso2)}</span> {facility.countryName}
      </span>

      <span className="typo-caption text-muted-foreground">
        {pinned ? t('dashboard.clickToClear') : t('dashboard.clickToFilter')}
      </span>
    </>
  )
}
