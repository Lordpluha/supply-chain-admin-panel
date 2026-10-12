import { useNavigate, useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { LoginForm } from '@/features/login-form'
import { SettingsDialog } from '@/features/settings'
import { DEFAULT_CREDENTIALS } from '@/shared/config/constants'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'

export const LoginPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const search = useSearch({ from: '/login' })

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 p-6">
      <div className="absolute top-4 right-4">
        <SettingsDialog />
      </div>

      <Card className="w-full max-w-sm">
        <CardHeader>
          {/* The heading is an `h1` rather than the card's own title element:
              `CardTitle` renders a `<div>`, which left this screen with no
              outline and nothing for a screen reader to land on. The slot stays
              on the wrapper because the card header's grid keys off it. */}
          <CardTitle className="typo-h5 font-heading">
            <h1>{t('auth.title')}</h1>
          </CardTitle>
          <CardDescription>{t('auth.subtitle')}</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <LoginForm
            onSuccess={() => {
              // Back to wherever the guard interrupted, or the map.
              void navigate({ to: search.redirect ?? '/' })
            }}
          />

          <p className="typo-caption text-muted-foreground border-border border-t pt-3">
            {t('auth.demoHint')}
            <br />
            <code className="typo-code">{DEFAULT_CREDENTIALS.email}</code>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
