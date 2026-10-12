import type { ReactNode } from 'react'

export interface CanvasCardProps {
  title: string
  note?: string
  children: ReactNode
}

/** One cell of the component canvas: a label, a note, and the live component. */
export const CanvasCard = ({ title, note, children }: CanvasCardProps) => (
  <figure className="border-border bg-card flex flex-col gap-3 rounded-lg border p-5">
    <figcaption className="flex flex-col gap-1">
      <span className="typo-label">{title}</span>
      {note ? <span className="typo-caption text-muted-foreground">{note}</span> : null}
    </figcaption>
    <div className="flex min-h-16 flex-wrap items-center gap-3">{children}</div>
  </figure>
)

export interface CanvasProps {
  children: ReactNode
}

export const Canvas = ({ children }: CanvasProps) => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
)

export interface SectionProps {
  title: string
  description: string
  children: ReactNode
}

export const Section = ({ title, description, children }: SectionProps) => (
  <section className="flex flex-col gap-4">
    <div className="flex flex-col gap-1">
      <h2 className="typo-h4 font-heading">{title}</h2>
      <p className="typo-body-sm text-muted-foreground max-w-2xl">{description}</p>
    </div>
    {children}
  </section>
)
