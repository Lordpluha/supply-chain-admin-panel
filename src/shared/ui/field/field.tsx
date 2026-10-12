import { AlertCircle } from 'lucide-react'
import type { ReactNode } from 'react'
import { useId } from 'react'
import { cn } from '@/shared/lib/cn'
import { Label } from '../label'

export interface FieldProps {
  label: string
  /** Receives the wiring every control needs to be announced correctly. */
  children: (props: FieldControlProps) => ReactNode
  error?: string
  hint?: string
  required?: boolean
}

export interface FieldControlProps {
  id: string
  'aria-invalid': boolean
  'aria-describedby': string | undefined
  'aria-required': boolean | undefined
}

/**
 * Label, control, and the error **beside the control** — never in a toast.
 *
 * The message is tied to the input with `aria-describedby` and the input is
 * marked `aria-invalid`, which is also what `useServerFieldErrors` scrolls to.
 * Colour is never the only signal: the border changes, an icon appears, and
 * the reason is written out.
 */
export const Field = ({ label, children, error, hint, required }: FieldProps) => {
  const id = useId()
  const errorId = `${id}-error`
  const hintId = `${id}-hint`

  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ')

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className={cn(error && 'text-destructive')}>
        {label}
        {required ? (
          <span className="text-destructive" aria-hidden="true">
            *
          </span>
        ) : null}
      </Label>

      {children({
        id,
        'aria-invalid': Boolean(error),
        'aria-describedby': describedBy || undefined,
        'aria-required': required || undefined,
      })}

      {hint && !error ? (
        <p id={hintId} className="typo-caption text-muted-foreground">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} className="typo-caption text-destructive flex items-center gap-1.5">
          <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  )
}
