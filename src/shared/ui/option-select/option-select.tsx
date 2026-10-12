import { Fragment } from 'react'
import { AutoWidth } from '../auto-width'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../select'

export interface SelectOption {
  value: string
  label: string
  /** Consecutive options sharing a group get a heading above the first of them. */
  group?: string
}

export interface OptionSelectProps {
  value: string
  options: ReadonlyArray<SelectOption>
  onChange: (value: string) => void
  placeholder?: string
  /** Adds an entry that clears the selection, labelled with this text. */
  allLabel?: string
  className?: string
}

/** Sentinel, because a Base UI item cannot carry an empty string value. */
const ALL = '__all__'

/**
 * A select over a list of `{ value, label }`. Knows nothing about the domain,
 * so it lives in `shared/ui` and the caller supplies the options from whichever
 * entity query it owns.
 *
 * `SelectValue` is given an explicit function child. Without one, Base UI
 * prints the raw value — which meant the "any country" entry rendered as the
 * literal `__all__` on screen.
 */
export const OptionSelect = ({
  value,
  options,
  onChange,
  placeholder,
  allLabel,
  className,
  ...rest
}: OptionSelectProps & Record<string, unknown>) => {
  const current = value || (allLabel ? ALL : '')

  const labelFor = (raw: unknown): string => {
    if (raw === ALL || raw === '' || raw == null) return allLabel ?? placeholder ?? ''
    return options.find(option => option.value === raw)?.label ?? String(raw)
  }

  // The trigger is sized to the longest option, so picking a short one does
  // not shrink the control and shift everything beside it.
  const allLabels = [
    ...(allLabel ? [allLabel] : []),
    ...(placeholder ? [placeholder] : []),
    ...options.map(option => option.label),
  ]

  return (
    <AutoWidth labels={allLabels} className={className}>
      <Select value={current} onValueChange={next => onChange(next === ALL ? '' : (next ?? ''))}>
        <SelectTrigger className="w-full" {...rest}>
          <SelectValue placeholder={placeholder}>{labelFor}</SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-72">
          {allLabel ? <SelectItem value={ALL}>{allLabel}</SelectItem> : null}
          {options.map((option, index) => (
            <Fragment key={option.value}>
              {option.group && option.group !== options[index - 1]?.group ? (
                <div className="typo-overline text-muted-foreground px-2 pt-2 pb-1">
                  {option.group}
                </div>
              ) : null}
              <SelectItem value={option.value}>{option.label}</SelectItem>
            </Fragment>
          ))}
        </SelectContent>
      </Select>
    </AutoWidth>
  )
}
