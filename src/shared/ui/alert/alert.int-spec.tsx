import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Alert, AlertAction, AlertDescription, AlertTitle } from './alert'

describe('Alert integration', () => {
  it('lets an action inside it be reached and pressed by keyboard', async () => {
    const onRetry = vi.fn()
    render(
      <Alert>
        <AlertTitle>Could not load</AlertTitle>
        <AlertDescription>The request failed.</AlertDescription>
        <AlertAction>
          <button type="button" onClick={onRetry}>
            Try again
          </button>
        </AlertAction>
      </Alert>,
    )

    await userEvent.tab()
    expect(screen.getByRole('button', { name: 'Try again' })).toHaveFocus()

    await userEvent.keyboard('{Enter}')
    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})
