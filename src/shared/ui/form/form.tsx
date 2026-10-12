import type { FormEventHandler, ReactNode, RefObject } from 'react'
import type { Control, FieldValues } from 'react-hook-form'
import { cn } from '@/shared/lib/cn'
import { FormDevtools } from '../form-devtools'

export interface FormProps<T extends FieldValues> {
  onSubmit: FormEventHandler<HTMLFormElement>
  /** Passed straight to the dev-only devtools panel. */
  control: Control<T>
  children: ReactNode
  /** Scopes `useServerFieldErrors`' search for the first invalid control. */
  formRef?: RefObject<HTMLFormElement | null>
  className?: string
}

/**
 * Wraps a `<form>` and attaches the devtools panel in development.
 *
 * Every form in the panel goes through this, so the devtools are never
 * something a developer has to remember to add — and never something they can
 * accidentally ship, since `FormDevtools` compiles away in production.
 *
 * `noValidate` is deliberate: the browser's own validation bubbles are
 * unstyled, untranslated, and would pre-empt the messages `Field` renders
 * beside the input.
 */
export const Form = <T extends FieldValues>({
  onSubmit,
  control,
  children,
  formRef,
  className,
}: FormProps<T>) => (
  <>
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      className={cn('flex flex-col gap-4', className)}
    >
      {children}
    </form>
    <FormDevtools control={control} />
  </>
)
