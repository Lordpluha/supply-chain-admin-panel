import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/shared/lib/test-utils'
import { ExportDialog } from './export-dialog'

const base = {
  open: true,
  isExporting: false,
  rowCount: 24,
  onExport: () => {},
  onCancel: () => {},
}

describe('ExportDialog integration', () => {
  it('exports the default format without touching the radios', async () => {
    const onExport = vi.fn()
    renderWithProviders(<ExportDialog {...base} onExport={onExport} />)

    await userEvent.click(screen.getByRole('button', { name: 'Download' }))

    expect(onExport).toHaveBeenCalledWith('xlsx')
  })

  it('exports whichever format was chosen', async () => {
    const onExport = vi.fn()
    renderWithProviders(<ExportDialog {...base} onExport={onExport} />)

    await userEvent.click(screen.getByText('CSV (.csv)'))
    await userEvent.click(screen.getByRole('button', { name: 'Download' }))

    expect(onExport).toHaveBeenCalledWith('csv')
  })

  it('cancels without exporting', async () => {
    const onExport = vi.fn()
    const onCancel = vi.fn()
    renderWithProviders(<ExportDialog {...base} onExport={onExport} onCancel={onCancel} />)

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onExport).not.toHaveBeenCalled()
  })

  /** Each row is a label wrapping its radio, so the whole card is the hit area. */
  it('selects a format by clicking anywhere on its row', async () => {
    renderWithProviders(<ExportDialog {...base} />)

    await userEvent.click(
      screen.getByText('SpreadsheetML, for tools that still insist on the old extension.'),
    )

    expect(screen.getAllByRole('radio')[1]).toBeChecked()
  })
})
