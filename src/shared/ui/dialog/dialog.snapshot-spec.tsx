import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './dialog'

describe('Dialog snapshots', () => {
  it('matches snapshot — open', () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this record?</DialogTitle>
            <DialogDescription>This cannot be undone.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    )

    expect(document.querySelector('[data-slot="dialog-content"]')).toMatchSnapshot()
  })
})
