import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { Button } from '../button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog'

/**
 * An overlay renders into a portal, so the screenshot targets the popup itself
 * rather than a wrapper that never contains it. The baseline lands in
 * `__screenshots__` on the first run — see DEPLOYMENT.md on why that has never
 * happened on the machine this was built on.
 */
describe('Dialog screenshots', () => {
  it('renders open', async () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this record?</DialogTitle>
            <DialogDescription>
              This cannot be undone. The action is written to the activity log.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline">Cancel</Button>
            <Button variant="destructive">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    )

    const popup = document.querySelector<HTMLElement>('[data-slot="dialog-content"]')

    expect(popup).not.toBeNull()
    await expect(page.elementLocator(popup as HTMLElement)).toMatchScreenshot()
  })
})
