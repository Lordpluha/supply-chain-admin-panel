import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/shared/lib/test-utils'
import { FormActions } from './form-actions'

describe('FormActions integration', () => {
  it('submits the surrounding form when saved', async () => {
    const onSubmit = vi.fn(event => event.preventDefault())
    renderWithProviders(
      <form onSubmit={onSubmit}>
        <FormActions isPending={false} onCancel={() => {}} />
      </form>,
    )

    await userEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('cancels without submitting', async () => {
    const onSubmit = vi.fn(event => event.preventDefault())
    const onCancel = vi.fn()
    renderWithProviders(
      <form onSubmit={onSubmit}>
        <FormActions isPending={false} onCancel={onCancel} />
      </form>,
    )

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('cannot be submitted twice while pending', async () => {
    const onSubmit = vi.fn(event => event.preventDefault())
    renderWithProviders(
      <form onSubmit={onSubmit}>
        <FormActions isPending onCancel={() => {}} />
      </form>,
    )

    await userEvent.click(screen.getByRole('button', { name: 'Saving…' }))

    expect(onSubmit).not.toHaveBeenCalled()
  })
})
