import { zodResolver } from '@hookform/resolvers/zod'
import { useRef } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { CountryCreateInput, CountryFormValues } from '@/entities/country'
import { COUNTRY_REGIONS, countryCreateSchema } from '@/entities/country'
import { Field } from '@/shared/ui/field'
import { Form } from '@/shared/ui/form'
import { FormActions } from '@/shared/ui/form-actions'
import { Input } from '@/shared/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import type { EntityFormProps } from '@/widgets/entity-crud'

const EMPTY: CountryFormValues = {
  name: '',
  iso2: '',
  iso3: '',
  isoNumeric: '',
  region: 'Europe',
  lat: 0,
  lng: 0,
}

export const CountryForm = ({
  defaultValues,
  isPending,
  onSubmit,
  onCancel,
}: EntityFormProps<CountryCreateInput>) => {
  const { t } = useTranslation()
  const formRef = useRef<HTMLFormElement>(null)

  // Typed against the schema's input, with the submit handler receiving the
  // coerced output — see `CountryFormValues`.
  const form = useForm<CountryFormValues, unknown, CountryCreateInput>({
    resolver: zodResolver(countryCreateSchema),
    defaultValues: { ...EMPTY, ...defaultValues },
  })

  const selectedRegion = useWatch({ control: form.control, name: 'region' })

  const { errors } = form.formState

  return (
    <Form control={form.control} formRef={formRef} onSubmit={form.handleSubmit(onSubmit)}>
      <Field label={t('countries.name')} error={errors.name?.message} required>
        {props => <Input {...props} {...form.register('name')} />}
      </Field>

      <div className="grid grid-cols-3 gap-3">
        <Field label={t('countries.iso2')} error={errors.iso2?.message} required>
          {props => <Input {...props} {...form.register('iso2')} maxLength={2} />}
        </Field>
        <Field label={t('countries.iso3')} error={errors.iso3?.message} required>
          {props => <Input {...props} {...form.register('iso3')} maxLength={3} />}
        </Field>
        <Field
          label={t('countries.isoNumeric')}
          error={errors.isoNumeric?.message}
          hint="036"
          required
        >
          {props => <Input {...props} {...form.register('isoNumeric')} maxLength={3} />}
        </Field>
      </div>

      <Field label={t('countries.region')} error={errors.region?.message} required>
        {props => (
          <Select
            value={selectedRegion}
            onValueChange={value => value && form.setValue('region', value as never)}
          >
            <SelectTrigger {...props}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COUNTRY_REGIONS.map(option => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label={t('countries.lat')} error={errors.lat?.message} required>
          {props => <Input {...props} {...form.register('lat')} type="number" step="0.01" />}
        </Field>
        <Field label={t('countries.lng')} error={errors.lng?.message} required>
          {props => <Input {...props} {...form.register('lng')} type="number" step="0.01" />}
        </Field>
      </div>

      <FormActions isPending={isPending} onCancel={onCancel} />
    </Form>
  )
}
