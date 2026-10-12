import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/shared/lib/test-utils'
import { ExportDialog } from './export-dialog'

describe('ExportDialog snapshots', () => {
  it('matches snapshot — open', () => {
    renderWithProviders(
      <ExportDialog
        open
        isExporting={false}
        rowCount={24}
        onExport={() => {}}
        onCancel={() => {}}
      />,
    )

    expect(document.querySelector('[data-slot="dialog-content"]')).toMatchSnapshot()
  })
})
