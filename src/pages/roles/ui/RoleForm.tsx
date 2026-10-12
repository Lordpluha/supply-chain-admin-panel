import { zodResolver } from '@hookform/resolvers/zod'
import { useRef } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { RoleCreateInput, RoleFormValues } from '@/entities/role'
import { roleCreateSchema } from '@/entities/role'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { Field } from '@/shared/ui/field'
import { Form } from '@/shared/ui/form'
import { FormActions } from '@/shared/ui/form-actions'
import { Input } from '@/shared/ui/input'
import type { EntityFormProps } from '@/widgets/entity-crud'
import { PermissionGrid } from './PermissionGrid'

const EMPTY: RoleFormValues = { name: '', description: '', permissions: [] }

export const RoleForm = ({
  defaultValues,
  isPending,
  onSubmit,
  onCancel,
}: EntityFormProps<RoleCreateInput>) => {
  const { t } = useTranslation()
  const formRef = useRef<HTMLFormElement>(null)

  const form = useForm<RoleFormValues, unknown, RoleCreateInput>({
    resolver: zodResolver(roleCreateSchema),
    defaultValues: { ...EMPTY, ...defaultValues },
  })

  const selectedPermissions = useWatch({ control: form.control, name: 'permissions' })

  const { errors } = form.formState

  return (
    <Form control={form.control} formRef={formRef} onSubmit={form.handleSubmit(onSubmit)}>
      <Field label={t('roles.name')} error={errors.name?.message} required>
        {props => <Input {...props} {...form.register('name')} />}
      </Field>

      <Field label={t('roles.roleDescription')} error={errors.description?.message}>
        {props => <Input {...props} {...form.register('description')} />}
      </Field>

      <Alert>
        <AlertDescription>{t('roles.superAdminNote')}</AlertDescription>
      </Alert>

      <PermissionGrid
        value={selectedPermissions ?? []}
        onChange={next => form.setValue('permissions', next)}
        disabled={isPending}
      />

      <FormActions isPending={isPending} onCancel={onCancel} />
    </Form>
  )
}
