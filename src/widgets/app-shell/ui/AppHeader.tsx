import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { LogOut, PanelLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { sessionQueries, useSession } from '@/entities/session'
import { SettingsDialog } from '@/features/settings'
import { useUiStore } from '@/shared/store/uiStore'
import { Button } from '@/shared/ui/button'
import { Separator } from '@/shared/ui/separator'

export const AppHeader = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useSession()
  const toggleSidebar = useUiStore(state => state.toggleSidebar)
  const queryClient = useQueryClient()

  const signOut = useMutation({
    ...sessionQueries.logoutOptions(),
    onSuccess: () => {
      /**
       * Cleared from the cache here rather than left to `meta.invalidates`.
       *
       * Invalidation is asynchronous, and `/login`'s own guard reads the
       * session through `ensureQueryData` — which hands back the *stale*
       * session that is still sitting there and throws a redirect to `/`. The
       * operator pressed sign out and stayed exactly where they were.
       *
       * This is the mirror of what `LoginForm` does on the way in, and for the
       * same reason: a guard that runs on the next tick must not read a session
       * this one has already ended.
       */
      queryClient.setQueryData(sessionQueries.keys.current(), null)
      void navigate({ to: '/login' })
    },
  })

  return (
    <header className="border-border bg-background/95 sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b px-4 backdrop-blur">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        aria-label={t('nav.toggleSidebar')}
      >
        <PanelLeft aria-hidden="true" />
      </Button>

      <span className="typo-label font-heading">{t('auth.title')}</span>

      <div className="ms-auto flex h-full items-center gap-1">
        {user ? (
          <span className="typo-caption text-muted-foreground hidden sm:inline">
            {t('auth.signedInAs', { name: user.name })} · {user.roleName}
          </span>
        ) : null}

        {/* Full height, edge to edge: a short centred dash beside 36px buttons
            reads as a stray mark rather than a division. */}
        <Separator orientation="vertical" className="mx-2 h-full" />

        <SettingsDialog />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => signOut.mutate()}
          disabled={signOut.isPending}
          aria-label={t('nav.signOut')}
        >
          <LogOut aria-hidden="true" />
        </Button>
      </div>
    </header>
  )
}
