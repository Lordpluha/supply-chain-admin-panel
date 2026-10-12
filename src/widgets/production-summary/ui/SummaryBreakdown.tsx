import type { ProductionBreakdownItem } from '@/entities/production-record'
import { useFormatters } from '@/shared/lib/useFormatters'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { LabelWithInfo } from '@/shared/ui/info-tooltip'

export interface SummaryBreakdownProps {
  title: string
  info?: string
  items: ReadonlyArray<ProductionBreakdownItem>
  /** With mixed units a quantity is meaningless, so value leads instead. */
  showValueOnly?: boolean
  limit?: number
}

export const SummaryBreakdown = ({
  title,
  info,
  items,
  showValueOnly = false,
  limit = 8,
}: SummaryBreakdownProps) => {
  const fmt = useFormatters()

  if (items.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="typo-h6">
          {info ? <LabelWithInfo label={title} info={info} /> : title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ul className="flex flex-col gap-2">
          {items.slice(0, limit).map(item => (
            <li key={item.id} className="flex flex-col gap-1">
              <div className="flex items-baseline justify-between gap-3">
                <span className="typo-body-sm truncate">{item.label}</span>
                <span className="typo-caption text-muted-foreground shrink-0 tabular-nums">
                  {showValueOnly
                    ? fmt.currencyCompact(item.value)
                    : `${fmt.quantity(item.total, item.unit)} · ${fmt.currencyCompact(item.value)}`}
                </span>
              </div>
              {/* A bar makes the ranking readable at a glance; the figures
                  beside it stay the authoritative version. */}
              <div className="bg-muted h-1 overflow-hidden rounded-full">
                <div
                  className="bg-chart-1 h-full rounded-full"
                  style={{ width: `${Math.max(2, item.share * 100)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
