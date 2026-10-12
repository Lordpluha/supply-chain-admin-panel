import { Settings } from 'lucide-react'
import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'

const SettingsPanel = lazy(async () => {
  const module = await import('./SettingsPanel')
  return { default: module.SettingsPanel }
})

/** The header entry point. The panel itself is reusable outside the dialog. */
export const SettingsDialog = () => {
  const { t } = useTranslation()

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon" aria-label={t('settings.open')}>
            <Settings aria-hidden="true" />
          </Button>
        }
      />
      <Suspense fallback={null}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('settings.title')}</DialogTitle>
            <DialogDescription>{t('settings.description')}</DialogDescription>
          </DialogHeader>
          <SettingsPanel />
        </DialogContent>
      </Suspense>
    </Dialog>
  )
}
