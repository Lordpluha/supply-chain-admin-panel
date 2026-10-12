import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

export interface DetailField {
  label: string
  value: ReactNode
}

export interface DetailFieldsProps {
  fields: ReadonlyArray<DetailField>
  className?: string
}

/**
 * A `<dl>`, not a two-column `<div>` grid: label and value are a term and its
 * definition, and a screen reader reading the pair as such is the difference
 * between "Region Europe" and two unrelated fragments.
 */
export const DetailFields = ({ fields, className }: DetailFieldsProps) => (
  <dl className={cn('grid gap-x-6 gap-y-3 sm:grid-cols-2', className)}>
    {fields.map(field => (
      <div key={field.label} className="flex min-w-0 flex-col gap-0.5">
        <dt className="typo-caption text-muted-foreground">{field.label}</dt>
        <dd className="typo-body-sm min-w-0 break-words">{field.value}</dd>
      </div>
    ))}
  </dl>
)
