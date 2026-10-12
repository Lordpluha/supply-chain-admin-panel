import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { facilityQueries } from '@/entities/facility'
import { productQueries } from '@/entities/product'
import type {
  ProductionRecordCreateInput,
  ProductionRecordFormValues,
} from '@/entities/production-record'
import { productionRecordCreateSchema } from '@/entities/production-record'
import { YEAR_MAX, YEARS } from '@/shared/config/constants'
import { useDebouncedValue } from '@/shared/lib/useDebouncedValue'
import { Field } from '@/shared/ui/field'
import { Form } from '@/shared/ui/form'
import { FormActions } from '@/shared/ui/form-actions'
import { Input } from '@/shared/ui/input'
import { OptionSelect } from '@/shared/ui/option-select'
import { SearchableSelect } from '@/shared/ui/searchable-select'
import type { EntityFormProps } from '@/widgets/entity-crud'

const EMPTY: ProductionRecordFormValues = {
  facilityId: '',
  productId: '',
  year: YEAR_MAX,
  value: 0,
}

export const ProductionForm = ({
  defaultValues,
  isPending,
  onSubmit,
  onCancel,
}: EntityFormProps<ProductionRecordCreateInput>) => {
  const { t } = useTranslation()
  const formRef = useRef<HTMLFormElement>(null)

  const [facilityTerm, setFacilityTerm] = useState('')
  const facilities = useQuery(
    facilityQueries.listOptions({
      search: useDebouncedValue(facilityTerm) || undefined,
      pageSize: 50,
      sortBy: 'name',
    }),
  )
  const products = useQuery(productQueries.listOptions({ pageSize: 0, sortBy: 'name' }))

  const form = useForm<ProductionRecordFormValues, unknown, ProductionRecordCreateInput>({
    resolver: zodResolver(productionRecordCreateSchema),
    defaultValues: { ...EMPTY, ...defaultValues },
  })

  const selectedFacilityId = useWatch({ control: form.control, name: 'facilityId' })
  const selectedProductId = useWatch({ control: form.control, name: 'productId' })
  const selectedYear = useWatch({ control: form.control, name: 'year' })

  const { errors } = form.formState

  return (
    <Form control={form.control} formRef={formRef} onSubmit={form.handleSubmit(onSubmit)}>
      <Field label={t('production.facility')} error={errors.facilityId?.message} required>
        {props => (
          <SearchableSelect
            {...props}
            value={selectedFacilityId}
            onChange={value => form.setValue('facilityId', value, { shouldValidate: true })}
            onSearch={setFacilityTerm}
            isLoading={facilities.isFetching}
            options={(facilities.data?.items ?? []).map(f => ({ value: f.id, label: f.name }))}
          />
        )}
      </Field>

      <Field label={t('production.product')} error={errors.productId?.message} required>
        {props => (
          <SearchableSelect
            {...props}
            value={selectedProductId}
            onChange={value => form.setValue('productId', value, { shouldValidate: true })}
            placeholder={t('production.product')}
            options={(products.data?.items ?? []).map(p => ({
              value: p.id,
              label: `${p.name} (${p.unit})`,
            }))}
          />
        )}
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label={t('production.year')} error={errors.year?.message} required>
          {props => (
            <OptionSelect
              {...props}
              value={String(selectedYear)}
              onChange={value => form.setValue('year', Number(value), { shouldValidate: true })}
              options={YEARS.map(option => ({
                value: String(option),
                label: String(option),
              }))}
            />
          )}
        </Field>
        <Field label={t('production.value')} error={errors.value?.message} required>
          {props => <Input {...props} {...form.register('value')} type="number" min="0" />}
        </Field>
      </div>

      <FormActions isPending={isPending} onCancel={onCancel} />
    </Form>
  )
}
