import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/shared/lib/test-utils'
import { ExportDialog } from './export-dialog'

const props = {
  open: true,
  isExporting: false,
  rowCount: 24,
  onExport: () => {},
  onCancel: () => {},
}

describe('ExportDialog', () => {
  it('renders nothing while closed', () => {
    renderWithProviders(<ExportDialog {...props} open={false} />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('offers all three formats', () => {
    renderWithProviders(<ExportDialog {...props} />)

    expect(screen.getAllByRole('radio')).toHaveLength(3)
    expect(screen.getByText('Excel workbook (.xlsx)')).toBeInTheDocument()
    expect(screen.getByText('Excel 2003 (.xls)')).toBeInTheDocument()
    expect(screen.getByText('CSV (.csv)')).toBeInTheDocument()
  })

  it('starts on the current format', () => {
    renderWithProviders(<ExportDialog {...props} />)

    expect(screen.getAllByRole('radio')[0]).toBeChecked()
  })

  it('says how many rows will be written', () => {
    renderWithProviders(<ExportDialog {...props} rowCount={24} />)

    expect(
      screen.getByText('24 rows, exactly as filtered and sorted on screen.'),
    ).toBeInTheDocument()
  })

  it('shows progress while it writes', () => {
    renderWithProviders(<ExportDialog {...props} isExporting />)

    expect(screen.getByRole('button', { name: 'Exporting…' })).toBeInTheDocument()
  })

  /** Nothing to write, so it refuses rather than producing an empty file. */
  it('cannot be run with no rows', () => {
    renderWithProviders(<ExportDialog {...props} rowCount={0} />)

    expect(screen.getByRole('button', { name: 'Download' })).toBeDisabled()
  })
})
