import { FileSpreadsheet, FileText, Sheet } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ExportFormat } from '@/shared/lib/export'
import { EXPORT_FORMATS } from '@/shared/lib/export'
import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Radio, RadioGroup } from '@/shared/ui/radio-group'

export interface ExportDialogProps {
  open: boolean
  isExporting: boolean
  /** How many rows will be written, so the operator knows what they are getting. */
  rowCount: number
  onExport: (format: ExportFormat) => void
  onCancel: () => void
}

const ICONS = {
  xlsx: FileSpreadsheet,
  xls: Sheet,
  csv: FileText,
} as const

/**
 * The format choice lives behind the export button rather than beside it: three
 * buttons in a toolbar is three times the width for a decision most operators
 * make once.
 */
export const ExportDialog = ({
  open,
  isExporting,
  rowCount,
  onExport,
  onCancel,
}: ExportDialogProps) => {
  const { t } = useTranslation()
  const [format, setFormat] = useState<ExportFormat>('xlsx')

  return (
    <Dialog open={open} onOpenChange={next => !next && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('export.title')}</DialogTitle>
          <DialogDescription>{t('export.body', { count: rowCount })}</DialogDescription>
        </DialogHeader>

        <RadioGroup
          value={format}
          onValueChange={value => setFormat(value as ExportFormat)}
          aria-label={t('export.format')}
        >
          {EXPORT_FORMATS.map(option => {
            const Icon = ICONS[option]

            return (
              <label
                key={option}
                className="border-border hover:bg-accent/50 has-data-checked:border-primary has-data-checked:bg-primary/5 flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors"
              >
                <Radio value={option} className="mt-0.5" />
                <Icon className="text-muted-foreground mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="typo-label">{t(`export.formats.${option}.label`)}</span>
                  <span className="typo-caption text-muted-foreground">
                    {t(`export.formats.${option}.hint`)}
                  </span>
                </span>
              </label>
            )
          })}
        </RadioGroup>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={isExporting}>
            {t('common.cancel')}
          </Button>
          <Button onClick={() => onExport(format)} disabled={isExporting || rowCount === 0}>
            {isExporting ? t('common.exporting') : t('export.download')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
