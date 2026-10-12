import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { countryQueries } from '@/entities/country'
import type { FacilityCreateInput, FacilityFormValues } from '@/entities/facility'
import { FACILITY_KINDS, FACILITY_STATUSES, facilityCreateSchema } from '@/entities/facility'
import { useDebouncedValue } from '@/shared/lib/useDebouncedValue'
import { Field } from '@/shared/ui/field'
import { Form } from '@/shared/ui/form'
import { FormActions } from '@/shared/ui/form-actions'
import { Input } from '@/shared/ui/input'
import { OptionSelect } from '@/shared/ui/option-select'
import { SearchableSelect } from '@/shared/ui/searchable-select'
import type { EntityFormProps } from '@/widgets/entity-crud'

const EMPTY: FacilityFormValues = {
  name: '',
  countryId: '',
  lat: 0,
  lng: 0,
  capacity: 0,
  status: 'active',
  kind: 'plant',
}

export const FacilityForm = ({
  defaultValues,
  isPending,
  onSubmit,
  onCancel,
}: EntityFormProps<FacilityCreateInput>) => {
  const { t } = useTranslation()
  const formRef = useRef<HTMLFormElement>(null)

  const [countryTerm, setCountryTerm] = useState('')
  const countries = useQuery(
    countryQueries.listOptions({
      search: useDebouncedValue(countryTerm) || undefined,
      pageSize: 50,
      sortBy: 'name',
    }),
  )

  const form = useForm<FacilityFormValues, unknown, FacilityCreateInput>({
    resolver: zodResolver(facilityCreateSchema),
    defaultValues: { ...EMPTY, ...defaultValues },
  })

  const selectedCountryId = useWatch({ control: form.control, name: 'countryId' })
  const selectedKind = useWatch({ control: form.control, name: 'kind' })
  const selectedStatus = useWatch({ control: form.control, name: 'status' })

  const { errors } = form.formState

  return (
    <Form control={form.control} formRef={formRef} onSubmit={form.handleSubmit(onSubmit)}>
      <Field label={t('facilities.name')} error={errors.name?.message} required>
        {props => <Input {...props} {...form.register('name')} />}
      </Field>

      <Field label={t('facilities.country')} error={errors.countryId?.message} required>
        {props => (
          <SearchableSelect
            {...props}
            value={selectedCountryId}
            onChange={value => form.setValue('countryId', value, { shouldValidate: true })}
            onSearch={setCountryTerm}
            isLoading={countries.isFetching}
            options={(countries.data?.items ?? []).map(c => ({ value: c.id, label: c.name }))}
            placeholder={t('dashboard.anyCountry')}
          />
        )}
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label={t('facilities.lat')} error={errors.lat?.message} required>
          {props => <Input {...props} {...form.register('lat')} type="number" step="0.01" />}
        </Field>
        <Field label={t('facilities.lng')} error={errors.lng?.message} required>
          {props => <Input {...props} {...form.register('lng')} type="number" step="0.01" />}
        </Field>
      </div>

      <Field label={t('facilities.kind')} error={errors.kind?.message} required>
        {props => (
          <OptionSelect
            {...props}
            value={selectedKind}
            onChange={value => form.setValue('kind', value as never)}
            options={FACILITY_KINDS.map(option => ({
              value: option,
              label: t(`facilities.kinds.${option}`),
            }))}
          />
        )}
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label={t('facilities.capacity')} error={errors.capacity?.message} required>
          {props => <Input {...props} {...form.register('capacity')} type="number" min="0" />}
        </Field>
        <Field label={t('facilities.status')} error={errors.status?.message} required>
          {props => (
            <OptionSelect
              {...props}
              value={selectedStatus}
              onChange={value => form.setValue('status', value as never)}
              options={FACILITY_STATUSES.map(option => ({
                value: option,
                label: t(`facilities.status${option[0].toUpperCase()}${option.slice(1)}` as never),
              }))}
            />
          )}
        </Field>
      </div>

      <FormActions isPending={isPending} onCancel={onCancel} />
    </Form>
  )
}
