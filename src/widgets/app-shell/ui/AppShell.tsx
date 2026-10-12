import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { AppHeader } from './AppHeader'
import { AppSidebar } from './AppSidebar'

export interface AppShellProps {
  children: ReactNode
}

export const AppShell = ({ children }: AppShellProps) => {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-svh flex-col">
      {/* First focusable element on the page, per the accessibility contract. */}
      <a href="#main" className="skip-link">
        {t('nav.skipToContent')}
      </a>

      <AppHeader />

      <div className="flex flex-1">
        <AppSidebar />

        {/* The page itself scrolls, not an inner pane: a nested scroll
            container breaks browser find-in-page and the scroll restoration
            the router does on navigation. */}
        <main id="main" className="min-w-0 flex-1">
          <div className="mx-auto flex w-full max-w-[96rem] flex-col gap-6 p-4 sm:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
