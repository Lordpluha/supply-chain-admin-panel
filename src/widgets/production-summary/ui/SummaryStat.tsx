import type { ReactNode } from 'react'
import { LabelWithInfo } from '@/shared/ui/info-tooltip'

export interface SummaryStatProps {
  label: string
  value: string
  /** Always visible, under the figure. For a caveat the reader must not miss. */
  hint?: string
  /** Behind an info button beside the label. For background they may want once. */
  info?: ReactNode
}

export const SummaryStat = ({ label, value, hint, info }: SummaryStatProps) => (
  <div className="flex flex-col gap-0.5">
    {info ? (
      <LabelWithInfo label={label} info={info} className="typo-caption text-muted-foreground" />
    ) : (
      <span className="typo-caption text-muted-foreground">{label}</span>
    )}
    <span className="typo-h6 tabular-nums">{value}</span>
    {hint ? <span className="typo-caption text-muted-foreground">{hint}</span> : null}
  </div>
)
