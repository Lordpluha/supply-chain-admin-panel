import type { SelectOption } from '../option-select'
import { RangeSelect } from '../range-select'

export interface RangeFilterProps {
  label: string
  /** The bands both ends choose from, lowest first. */
  options: ReadonlyArray<SelectOption>
  /** The raw filter values — `''` for an end the operator has not narrowed. */
  value: { from: string; to: string }
  /** `null` for an end that is back at its extreme, so the key leaves the URL. */
  onChange: (from: string | null, to: string | null) => void
  info?: string
}

/**
 * A `RangeSelect` that speaks the URL's language.
 *
 * An end sitting at its extreme is not a filter, so it is reported as `null`
 * and the key drops out of the address entirely. Without that, every list would
 * arrive carrying `priceMin=0` and count itself as filtered — the reset button
 * would offer to clear a filter nobody set.
 */
export const RangeFilter = ({ label, options, value, onChange, info }: RangeFilterProps) => {
  const lowest = options[0]?.value ?? ''
  const highest = options.at(-1)?.value ?? ''

  return (
    <RangeSelect
      label={label}
      options={options}
      value={{ from: value.from || lowest, to: value.to || highest }}
      onChange={({ from, to }) =>
        onChange(from === lowest ? null : from, to === highest ? null : to)
      }
      slots={{ info, className: 'w-56' }}
    />
  )
}
