import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { Credentials } from '@/entities/session'
import { credentialsSchema, sessionQueries } from '@/entities/session'
import { ApiError } from '@/shared/api'
import { DEFAULT_CREDENTIALS } from '@/shared/config/constants'
import { errorDetail, errorMessageKey } from '@/shared/lib/errors'
import { useServerFieldErrors } from '@/shared/lib/useServerFieldErrors'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { Button } from '@/shared/ui/button'
import { Field } from '@/shared/ui/field'
import { Form } from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'
import { PasswordInput } from '@/shared/ui/password-input'

export interface LoginFormProps {
  onSuccess: () => void
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const { t } = useTranslation()
  const formRef = useRef<HTMLFormElement>(null)
  const queryClient = useQueryClient()

  const form = useForm<Credentials>({
    resolver: zodResolver(credentialsSchema),
    // Pre-filled with the seeded operator: the point of the prototype is the
    // supply map, not a login ceremony.
    defaultValues: DEFAULT_CREDENTIALS,
  })

  const applyServerErrors = useServerFieldErrors({ form, formRef })

  const login = useMutation({
    ...sessionQueries.loginOptions(),
    // The form renders its own failure inline, so the global toast stays quiet.
    meta: { ...sessionQueries.loginOptions().meta, silenceErrorToast: true },
    onSuccess: session => {
      // The login response already carries the session, so it is written
      // straight into the cache. Relying on `meta.invalidates` alone races the
      // navigation: the guard on the next route would read the stale `null`
      // and bounce straight back here.
      queryClient.setQueryData(sessionQueries.keys.current(), session)
      onSuccess()
    },
    onError: error => {
      applyServerErrors(error)
    },
  })

  /**
   * A 401 here is a refusal of these credentials, not an expired session — the
   * shared mapping would otherwise tell the operator to sign in again on the
   * screen they are already signing in on. Everything else keeps the common
   * wording, and a 403 (a suspended account) keeps the sentence the server
   * wrote for it.
   */
  const failure = !login.error
    ? null
    : login.error instanceof ApiError && login.error.status === 401
      ? t('auth.invalidCredentials')
      : (errorDetail(login.error) ?? t(errorMessageKey(login.error)))

  return (
    <Form
      control={form.control}
      formRef={formRef}
      onSubmit={form.handleSubmit(values => login.mutate(values))}
    >
      {failure ? (
        <Alert variant="destructive">
          <AlertDescription>{failure}</AlertDescription>
        </Alert>
      ) : null}

      <Field label={t('auth.email')} error={form.formState.errors.email?.message} required>
        {props => (
          <Input {...props} {...form.register('email')} type="email" autoComplete="username" />
        )}
      </Field>

      <Field label={t('auth.password')} error={form.formState.errors.password?.message} required>
        {props => (
          <PasswordInput
            {...props}
            {...form.register('password')}
            autoComplete="current-password"
          />
        )}
      </Field>

      <Button type="submit" disabled={login.isPending} className="mt-1 w-full">
        {login.isPending ? t('auth.signingIn') : t('auth.signIn')}
      </Button>
    </Form>
  )
}
