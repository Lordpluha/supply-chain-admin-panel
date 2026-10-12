import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/shared/lib/test-utils'
import { Button } from '../button'
import { ErrorPage, FullPageError } from './error-page'

describe('ErrorPage integration', () => {
  /** A dead end is not an error page: there is always something to press. */
  it('offers an action that can be reached and pressed by keyboard', async () => {
    const onRetry = vi.fn()
    renderWithProviders(
      <ErrorPage
        code="500"
        title="Something went wrong"
        description="The screen could not be rendered."
        actions={<Button onClick={onRetry}>Try again</Button>}
      />,
    )

    await userEvent.tab()
    expect(screen.getByRole('button', { name: 'Try again' })).toHaveFocus()

    await userEvent.keyboard('{Enter}')
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('offers each of several actions in order', async () => {
    renderWithProviders(
      <ErrorPage
        code="500"
        title="Something went wrong"
        description="The screen could not be rendered."
        actions={
          <>
            <Button>Try again</Button>
            <Button variant="outline">Reload the page</Button>
          </>
        }
      />,
    )

    await userEvent.tab()
    expect(screen.getByRole('button', { name: 'Try again' })).toHaveFocus()

    await userEvent.tab()
    expect(screen.getByRole('button', { name: 'Reload the page' })).toHaveFocus()
  })

  it('names the screen in the tab title as well as on it', () => {
    renderWithProviders(
      <FullPageError code="404" title="Page not found" description="It does not exist." />,
    )

    expect(document.title).toBe('Page not found · Supply Chain')
    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument()
  })
})
