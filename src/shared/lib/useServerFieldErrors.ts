import { useCallback } from 'react'
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { getFieldErrors } from './errors'

/** Where the scroll lands: enough room above the field to read its label. */
const SCROLL_OPTIONS: ScrollIntoViewOptions = {
  behavior: 'smooth',
  block: 'center',
}

const focusFirstInvalid = (formElement: HTMLElement | null): void => {
  const target =
    formElement?.querySelector<HTMLElement>('[aria-invalid="true"]') ??
    document.querySelector<HTMLElement>('[aria-invalid="true"]')

  if (!target) return

  // Scroll first, then focus: focusing alone jumps instantly and loses the
  // reader's sense of where on the form they landed.
  target.scrollIntoView(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? { ...SCROLL_OPTIONS, behavior: 'auto' }
      : SCROLL_OPTIONS,
  )
  target.focus({ preventScroll: true })
}

export interface UseServerFieldErrorsOptions<T extends FieldValues> {
  form: UseFormReturn<T>
  /** The form element, so the search for the first invalid control is scoped. */
  formRef?: React.RefObject<HTMLElement | null>
}

/**
 * Replays the server's per-field messages onto the form.
 *
 * Returns `true` when it handled the error, so the caller knows not to fall
 * through to a toast — a validation failure belongs beside the input, never in
 * a corner of the screen.
 */
export const useServerFieldErrors = <T extends FieldValues>({
  form,
  formRef,
}: UseServerFieldErrorsOptions<T>) =>
  useCallback(
    (error: unknown): boolean => {
      const fields = getFieldErrors(error)
      if (!fields) return false

      for (const [field, message] of Object.entries(fields)) {
        form.setError(field as Path<T>, { type: 'server', message }, { shouldFocus: false })
      }

      // After paint, so `aria-invalid` is on the DOM before we look for it.
      requestAnimationFrame(() => focusFirstInvalid(formRef?.current ?? null))

      return true
    },
    [form, formRef],
  )
