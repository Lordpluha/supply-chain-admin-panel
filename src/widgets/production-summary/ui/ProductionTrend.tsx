// An HTML <button> is not valid content inside <svg>, so a focusable <g>
// carrying the role is the only way to make a bar operable by keyboard.
// oxlint-disable jsx-a11y/prefer-tag-over-role
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ProductionSeriesPoint } from '@/entities/production-record'
import { cn } from '@/shared/lib/cn'
import { useFormatters } from '@/shared/lib/useFormatters'

export interface ProductionTrendProps {
  series: ReadonlyArray<ProductionSeriesPoint>
  unit: string
}

const HEIGHT = 64

/**
 * A bar per year, drawn as plain SVG. No chart library: the shape is one
 * `max()` and a loop, and every colour is a theme token so it follows the
 * three palettes like everything else.
 *
 * Each bar is a focusable control with its own accessible name, and hovering or
 * focusing one reads out that year's figure — an accumulation chart that only
 * shows a silhouette makes the reader guess at every value it plots.
 */
export const ProductionTrend = ({ series, unit }: ProductionTrendProps) => {
  const { t } = useTranslation()
  const fmt = useFormatters()
  const [active, setActive] = useState<ProductionSeriesPoint | null>(null)

  const max = Math.max(...series.map(point => point.total), 1)
  const barWidth = 100 / Math.max(series.length, 1)

  const describe = (point: ProductionSeriesPoint) =>
    `${point.year}: ${fmt.quantity(point.total, unit === 'mixed' ? '' : unit)}`

  const shown = active ?? series.at(-1) ?? null

  return (
    <figure className="flex flex-col gap-2">
      {/* The readout sits above the chart and is reserved space, so hovering
          never nudges the bars. */}
      <figcaption className="typo-caption text-muted-foreground flex h-5 items-baseline justify-between gap-2">
        {shown ? (
          <>
            <span className="tabular-nums">{shown.year}</span>
            <span className={cn('tabular-nums', active && 'text-foreground')}>
              {fmt.quantity(shown.total, unit === 'mixed' ? '' : unit)}
            </span>
          </>
        ) : null}
      </figcaption>

      <svg viewBox={`0 0 100 ${HEIGHT}`} preserveAspectRatio="none" className="h-16 w-full">
        {series.map((point, index) => {
          const height = (point.total / max) * HEIGHT

          return (
            <g
              key={point.year}
              role="button"
              tabIndex={0}
              aria-label={describe(point)}
              onMouseEnter={() => setActive(point)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(point)}
              onBlur={() => setActive(null)}
              className="group cursor-pointer outline-none"
            >
              {/* A full-height hit area: a 2px-tall bar for a lean year would
                  otherwise be impossible to point at. */}
              <rect
                x={index * barWidth}
                y={0}
                width={barWidth}
                height={HEIGHT}
                className="fill-transparent"
              />
              <rect
                x={index * barWidth + barWidth * 0.15}
                y={HEIGHT - height}
                width={barWidth * 0.7}
                height={height}
                vectorEffect="non-scaling-stroke"
                className="fill-chart-1 stroke-transparent transition-colors group-hover:fill-chart-highlight group-hover:stroke-ring group-hover:stroke-2 group-focus-visible:fill-chart-highlight group-focus-visible:stroke-ring group-focus-visible:stroke-2"
              />
            </g>
          )
        })}
      </svg>

      <div className="typo-caption text-muted-foreground flex justify-between tabular-nums">
        <span>{series.at(0)?.year}</span>
        <span>{series.at(-1)?.year}</span>
      </div>

      {/* The chart's content in text, for anyone not reading the picture. */}
      <p className="sr-only">{series.map(describe).join(', ')}</p>
      <span className="sr-only">{t('dashboard.trendInfo')}</span>
    </figure>
  )
}
