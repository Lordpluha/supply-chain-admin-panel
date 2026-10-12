import { zodResolver } from '@hookform/resolvers/zod'
import { useRef } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { ProductCreateInput, ProductFormValues } from '@/entities/product'
import { PRODUCT_CATEGORIES, productCreateSchema } from '@/entities/product'
import { BASE_CURRENCY } from '@/shared/config/currency'
import { Field } from '@/shared/ui/field'
import { Form } from '@/shared/ui/form'
import { FormActions } from '@/shared/ui/form-actions'
import { Input } from '@/shared/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import type { EntityFormProps } from '@/widgets/entity-crud'

const EMPTY: ProductFormValues = {
  sku: '',
  name: '',
  category: 'Raw material',
  unit: 't',
  unitPrice: 0,
}

export const ProductForm = ({
  defaultValues,
  isPending,
  onSubmit,
  onCancel,
}: EntityFormProps<ProductCreateInput>) => {
  const { t } = useTranslation()
  const formRef = useRef<HTMLFormElement>(null)

  const form = useForm<ProductFormValues, unknown, ProductCreateInput>({
    resolver: zodResolver(productCreateSchema),
    defaultValues: { ...EMPTY, ...defaultValues },
  })

  const selectedCategory = useWatch({ control: form.control, name: 'category' })

  const { errors } = form.formState

  return (
    <Form control={form.control} formRef={formRef} onSubmit={form.handleSubmit(onSubmit)}>
      <Field label={t('products.name')} error={errors.name?.message} required>
        {props => <Input {...props} {...form.register('name')} />}
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label={t('products.sku')} error={errors.sku?.message} required>
          {props => <Input {...props} {...form.register('sku')} />}
        </Field>
        <Field
          label={t('products.unit')}
          error={errors.unit?.message}
          hint="t · km² · packs"
          required
        >
          {props => <Input {...props} {...form.register('unit')} />}
        </Field>
      </div>

      <Field label={t('products.category')} error={errors.category?.message} required>
        {props => (
          <Select
            value={selectedCategory}
            onValueChange={value => value && form.setValue('category', value as never)}
          >
            <SelectTrigger {...props}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRODUCT_CATEGORIES.map(option => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </Field>

      <Field
        label={t('products.unitPrice')}
        error={errors.unitPrice?.message}
        hint={`${BASE_CURRENCY} · ${t('dashboard.valueHint')}`}
        required
      >
        {props => (
          <Input {...props} {...form.register('unitPrice')} type="number" step="1" min="0" />
        )}
      </Field>

      <FormActions isPending={isPending} onCancel={onCancel} />
    </Form>
  )
}
