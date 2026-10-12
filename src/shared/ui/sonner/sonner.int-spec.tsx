import { render, screen, waitFor } from '@testing-library/react'
import { toast } from 'sonner'
import { describe, expect, it } from 'vitest'
import { Toaster } from './sonner'

describe('Toaster integration', () => {
  it('shows what it is told to show', async () => {
    render(<Toaster />)

    toast.success('Saved')

    await waitFor(() => expect(screen.getByText('Saved')).toBeInTheDocument())
  })

  /**
   * A 403 or 409 carries a sentence the server wrote for a human — "Remove the
   * facilities in this country first" — and that sentence is more useful than
   * the generic line, so it rides along as the description.
   */
  it('carries the server’s own sentence beside the generic one', async () => {
    render(<Toaster />)

    toast.error('That change conflicts with existing data.', {
      description: 'Remove the facilities in this country first',
    })

    await waitFor(() =>
      expect(screen.getByText('That change conflicts with existing data.')).toBeInTheDocument(),
    )
    expect(screen.getByText('Remove the facilities in this country first')).toBeInTheDocument()
  })
})
