import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { useState } from 'react'
import { Button } from '../button'
import { Field } from '../field'
import { Input } from '../input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog'

const meta = {
  title: 'Overlays/Dialog',
  component: Dialog,
  parameters: {
    docs: {
      description: {
        component:
          'Capped at `85dvh` and scrolls inside itself. A centred, fixed popup taller than the viewport otherwise hangs off both ends with its buttons out of reach — and `dvh` rather than `vh` so a phone’s collapsing URL bar cannot hide the footer.',
      },
    },
  },
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open</Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New country</DialogTitle>
              <DialogDescription>Producing countries and their map coordinates.</DialogDescription>
            </DialogHeader>

            <Field label="Name" required>
              {props => <Input {...props} placeholder="Germany" />}
            </Field>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setOpen(false)}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  },
}

export const Destructive: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          Delete
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Delete this record?</DialogTitle>
              <DialogDescription>
                This cannot be undone. The action is written to the activity log.
              </DialogDescription>
            </DialogHeader>

            {/* The row is named, so nothing goes unseen. */}
            <p className="typo-body-sm border-border bg-muted rounded-md border px-3 py-2">
              Salzgitter Cathode Lab
            </p>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => setOpen(false)}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  },
}

/** Long enough to scroll, which is what the `max-h` exists for. */
export const Scrolling: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open a long form</Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New facility</DialogTitle>
            </DialogHeader>

            {['Name', 'Country', 'Kind', 'Status', 'Capacity', 'Latitude', 'Longitude'].map(
              label => (
                <Field key={label} label={label}>
                  {props => <Input {...props} />}
                </Field>
              ),
            )}

            <DialogFooter>
              <Button onClick={() => setOpen(false)}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  },
}
