import { describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { renderWithProviders } from '@/shared/lib/test-utils'
import { ExportDialog } from './export-dialog'

/**
 * An overlay renders into a portal, so the screenshot targets the popup itself
 * rather than a wrapper that never contains it. The baseline lands in
 * `__screenshots__` on the first run — see DEPLOYMENT.md on why that has never
 * happened on the machine this was built on.
 */
describe('ExportDialog screenshots', () => {
  it('renders open', async () => {
    renderWithProviders(
      <ExportDialog
        open
        isExporting={false}
        rowCount={24}
        onExport={() => {}}
        onCancel={() => {}}
      />,
    )

    const popup = document.querySelector<HTMLElement>('[data-slot="dialog-content"]')

    expect(popup).not.toBeNull()
    await expect(page.elementLocator(popup as HTMLElement)).toMatchScreenshot()
  })
})
