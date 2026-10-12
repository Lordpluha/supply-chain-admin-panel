import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib/cn'
import { LabelWithInfo } from '../info-tooltip'
import { Label } from '../label'
import type { SelectOption } from '../option-select'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../select'

export interface RangeSelectValue {
  from: string
  to: string
}

export interface RangeSelectProps {
  label: string
  /** The values both ends choose from, in order, lowest first. */
  options: ReadonlyArray<SelectOption>
  value: RangeSelectValue
  onChange: (value: RangeSelectValue) => void
  /** Shown behind an info button beside the label, and a class for the row. */
  slots?: { info?: string; className?: string }
}

const labelFor = (options: ReadonlyArray<SelectOption>, value: string): string =>
  options.find(option => option.value === value)?.label ?? value

/**
 * A range as two selects, joined into one control.
 *
 * Replaces the two-thumb slider this screen started with. A slider reads well
 * and drags badly: the value only exists while a thumb is held, every filter
 * beside it reflowed as the row grew and shrank mid-drag, and on a touch screen
 * the whole map scrolled instead. Two selects commit one value at a time and
 * hold still while they do it.
 *
 * The ends cannot be inverted, because neither is offered a value past the
 * other — the guarantee the slider gave by clamping, kept here by simply not
 * showing the impossible options. A pasted link with the ends the wrong way
 * round is still ordered by the caller.
 *
 * The values are the caller's: years on the overview, price bands on the
 * catalogue, output bands on production. Nothing here knows what it is ranging
 * over.
 */
export const RangeSelect = ({ label, options, value, onChange, slots }: RangeSelectProps) => {
  const { t } = useTranslation()

  const fromIndex = options.findIndex(option => option.value === value.from)
  const toIndex = options.findIndex(option => option.value === value.to)

  const trigger = 'w-full min-w-0 flex-1'

  return (
    <div className={cn('flex min-w-0 flex-col gap-1.5', slots?.className)}>
      {slots?.info ? (
        <LabelWithInfo label={label} info={slots.info} className="typo-label" />
      ) : (
        <Label>{label}</Label>
      )}

      {/* Joined: the pair is one value, and a gap between them would say they
          are two. The inner corners are squared and the divider is a single
          shared border. */}
      <div className="flex items-stretch">
        <Select
          value={value.from}
          onValueChange={next => onChange({ from: String(next), to: value.to })}
        >
          <SelectTrigger
            aria-label={`${label} — ${t('common.from')}`}
            className={cn(trigger, 'rounded-e-none')}
          >
            <SelectValue>{raw => labelFor(options, String(raw))}</SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-72">
            {options.map((option, index) => (
              <SelectItem
                key={option.value}
                value={option.value}
                disabled={toIndex >= 0 && index > toIndex}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span
          className="border-input text-muted-foreground typo-caption grid shrink-0 place-items-center border-y px-2"
          aria-hidden="true"
        >
          –
        </span>

        <Select
          value={value.to}
          onValueChange={next => onChange({ from: value.from, to: String(next) })}
        >
          <SelectTrigger
            aria-label={`${label} — ${t('common.to')}`}
            className={cn(trigger, 'rounded-s-none')}
          >
            <SelectValue>{raw => labelFor(options, String(raw))}</SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-72">
            {options.map((option, index) => (
              <SelectItem
                key={option.value}
                value={option.value}
                disabled={fromIndex >= 0 && index < fromIndex}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
