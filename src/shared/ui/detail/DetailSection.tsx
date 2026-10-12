import type { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'

export interface DetailSectionProps {
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
}

/** One titled block of a record page. */
export const DetailSection = ({ title, description, actions, children }: DetailSectionProps) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      {description ? <p className="typo-caption text-muted-foreground">{description}</p> : null}
      {actions}
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
)
