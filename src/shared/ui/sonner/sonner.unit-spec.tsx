import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Toaster } from './sonner'

describe('Toaster', () => {
  it('mounts without anything to show', () => {
    const { container } = render(<Toaster />)

    expect(container).toBeInTheDocument()
  })

  /** Announcements have to reach a screen reader, so the region is live. */
  it('provides a live region for announcements', () => {
    render(<Toaster />)

    expect(document.querySelector('[aria-live]')).toBeInTheDocument()
  })
})
