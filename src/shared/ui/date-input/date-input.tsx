import { format, isValid, parseISO } from 'date-fns'
import { de, enUS, fr, pl } from 'date-fns/locale'
import { CalendarDays, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib/cn'
import { Button } from '../button'
import { Calendar } from '../calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../popover'

export interface DatePickerProps {
  id?: string
  value?: string
  min?: string
  max?: string
  disabled?: boolean
  className?: string
  /** Used by screenshots and composed views that deliberately start expanded. */
  defaultOpen?: boolean
  onValueChange?: (value: string) => void
}

const locales = { de, en: enUS, fr, pl } as const

const dateFromIso = (value?: string): Date | undefined => {
  if (!value) return undefined
  const date = parseISO(value)
  return isValid(date) ? date : undefined
}

/** A themed calendar popover with keyboard navigation and min/max constraints. */
export const DatePicker = ({
  id,
  value = '',
  min,
  max,
  disabled = false,
  className,
  defaultOpen = false,
  onValueChange,
}: DatePickerProps) => {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(defaultOpen)
  const selected = dateFromIso(value)
  const minDate = dateFromIso(min)
  const maxDate = dateFromIso(max)
  const language = i18n.resolvedLanguage?.split('-')[0] as keyof typeof locales | undefined
  const locale = locales[language ?? 'en'] ?? enUS

  const disabledDates = [
    ...(minDate ? [{ before: minDate }] : []),
    ...(maxDate ? [{ after: maxDate }] : []),
  ]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            id={id}
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              'w-44 max-w-full justify-start gap-2 px-2.5 text-start font-normal tabular-nums',
              value ? 'border-primary/35 text-foreground' : 'text-muted-foreground',
              className,
            )}
          />
        }
      >
        <CalendarDays className={cn('size-4', value && 'text-primary')} aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate">
          {selected ? format(selected, 'PP', { locale }) : t('common.selectDate')}
        </span>
        <ChevronDown className="size-3.5 text-muted-foreground" aria-hidden="true" />
      </PopoverTrigger>

      <PopoverContent
        role="dialog"
        aria-label={t('common.selectDate')}
        align="start"
        sideOffset={8}
        className="w-auto gap-0 overflow-hidden rounded-xl p-0"
      >
        <Calendar
          mode="single"
          locale={locale}
          selected={selected}
          defaultMonth={selected ?? maxDate ?? new Date()}
          startMonth={minDate}
          endMonth={maxDate}
          disabled={disabledDates}
          fixedWeeks
          onSelect={date => {
            if (!date) return
            onValueChange?.(format(date, 'yyyy-MM-dd'))
            setOpen(false)
          }}
        />

        {value ? (
          <div className="flex justify-end border-t border-border/60 px-3 py-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                onValueChange?.('')
                setOpen(false)
              }}
            >
              {t('common.clearDate')}
            </Button>
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}
