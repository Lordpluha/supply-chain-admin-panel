import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { useState } from 'react'
import { Button } from '../button'
import { ExportDialog } from './export-dialog'

const meta = {
  title: 'Overlays/ExportDialog',
  component: ExportDialog,
  parameters: {
    docs: {
      description: {
        component:
          'The format choice lives behind the export button rather than beside it: three buttons in a toolbar is three times the width for a decision most operators make once. Whatever the format, the export is exactly what the table is showing — same filters, same sort, same order.',
      },
    },
  },
  args: {
    open: true,
    isExporting: false,
    rowCount: 24,
    onExport: () => {},
    onCancel: () => {},
  },
} satisfies Meta<typeof ExportDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Export
        </Button>
        <ExportDialog
          open={open}
          isExporting={false}
          rowCount={24}
          onExport={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </>
    )
  },
}

export const Exporting: Story = { args: { isExporting: true } }

/** Nothing to write, so the download button refuses rather than producing an
 *  empty file the reader has to open to discover is empty. */
export const NoRows: Story = { args: { rowCount: 0 } }
