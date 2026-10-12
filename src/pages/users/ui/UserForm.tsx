import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useRef } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { roleQueries } from '@/entities/role'
import type { UserCreateInput, UserFormValues } from '@/entities/user'
import { USER_STATUSES, userCreateSchema } from '@/entities/user'
import { Field } from '@/shared/ui/field'
import { Form } from '@/shared/ui/form'
import { FormActions } from '@/shared/ui/form-actions'
import { Input } from '@/shared/ui/input'
import { OptionSelect } from '@/shared/ui/option-select'
import type { EntityFormProps } from '@/widgets/entity-crud'

const EMPTY: UserFormValues = {
  name: '',
  email: '',
  roleId: '',
  status: 'active',
}

export const UserForm = ({
  defaultValues,
  isPending,
  onSubmit,
  onCancel,
}: EntityFormProps<UserCreateInput>) => {
  const { t } = useTranslation()
  const formRef = useRef<HTMLFormElement>(null)

  const roles = useQuery(roleQueries.listOptions({ pageSize: 0, sortBy: 'name' }))

  const form = useForm<UserFormValues, unknown, UserCreateInput>({
    resolver: zodResolver(userCreateSchema),
    defaultValues: { ...EMPTY, ...defaultValues },
  })

  const selectedRoleId = useWatch({ control: form.control, name: 'roleId' })
  const selectedStatus = useWatch({ control: form.control, name: 'status' })

  const { errors } = form.formState

  return (
    <Form control={form.control} formRef={formRef} onSubmit={form.handleSubmit(onSubmit)}>
      <Field label={t('users.name')} error={errors.name?.message} required>
        {props => <Input {...props} {...form.register('name')} />}
      </Field>

      <Field
        label={t('users.email')}
        error={errors.email?.message}
        hint={t('users.defaultPasswordHint')}
        required
      >
        {props => <Input {...props} {...form.register('email')} type="email" />}
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label={t('users.role')} error={errors.roleId?.message} required>
          {props => (
            <OptionSelect
              {...props}
              value={selectedRoleId}
              onChange={value => form.setValue('roleId', value, { shouldValidate: true })}
              options={(roles.data?.items ?? []).map(role => ({
                value: role.id,
                label: role.name,
              }))}
            />
          )}
        </Field>

        <Field label={t('users.status')} error={errors.status?.message} required>
          {props => (
            <OptionSelect
              {...props}
              value={selectedStatus}
              onChange={value => form.setValue('status', value as never)}
              options={USER_STATUSES.map(option => ({
                value: option,
                label: t(`users.status${option[0].toUpperCase()}${option.slice(1)}` as never),
              }))}
            />
          )}
        </Field>
      </div>

      <FormActions isPending={isPending} onCancel={onCancel} />
    </Form>
  )
}
