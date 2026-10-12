import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import type { ExportColumn, ExportFormat } from '@/shared/lib/export'
import { exportRows, timestampedFileName } from '@/shared/lib/export'

export interface UseEntityExportInput<T> {
  rows: ReadonlyArray<T>
  /** Absent when the screen has no export at all. */
  columns: ReadonlyArray<ExportColumn<T>> | undefined
  fileName: string | undefined
}

export interface UseEntityExportResult {
  isOpen: boolean
  isExporting: boolean
  close: () => void
  run: (format: ExportFormat) => void
  /** `undefined` when there is nothing to export, which hides the button. */
  onOpen: (() => void) | undefined
}

/**
 * Owns the export dialog's state and the write itself.
 *
 * Separate from the screen because the two have nothing to say to each other:
 * the table does not care that a file is being written, and the writer does not
 * care which entity it came from.
 */
export const useEntityExport = <T>({
  rows,
  columns,
  fileName,
}: UseEntityExportInput<T>): UseEntityExportResult => {
  const { t } = useTranslation()
  const [isOpen, setOpen] = useState(false)
  const [isExporting, setExporting] = useState(false)

  const run = async (format: ExportFormat) => {
    if (!columns) return
    setExporting(true)
    try {
      // Exactly what the table is showing: same filters, same sort, same order.
      await exportRows(format, {
        rows,
        columns,
        fileName: timestampedFileName(fileName ?? 'export'),
      })
      toast.success(t('toast.exported'))
      setOpen(false)
    } finally {
      setExporting(false)
    }
  }

  return {
    isOpen,
    isExporting,
    close: () => setOpen(false),
    run: format => void run(format),
    onOpen: columns ? () => setOpen(true) : undefined,
  }
}
