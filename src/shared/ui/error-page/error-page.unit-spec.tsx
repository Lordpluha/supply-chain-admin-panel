import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/shared/lib/test-utils'
import { ErrorPage, FullPageError } from './error-page'

describe('ErrorPage', () => {
  it('names the failure with a heading, so the page has an outline', () => {
    renderWithProviders(
      <ErrorPage code="404" title="Page not found" description="It does not exist." />,
    )

    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument()
    expect(screen.getByText('It does not exist.')).toBeInTheDocument()
  })

  it('shows the code for a bug report', () => {
    renderWithProviders(<ErrorPage code="500" title="Broken" description="Sorry." />)

    expect(screen.getByText('500')).toBeInTheDocument()
  })

  it('renders the detail only when there is one', () => {
    const { rerender } = renderWithProviders(
      <ErrorPage code="403" title="No access" description="Ask for it." />,
    )

    expect(screen.queryByText('audit:read')).not.toBeInTheDocument()

    rerender(
      <ErrorPage code="403" title="No access" description="Ask for it." detail="audit:read" />,
    )

    expect(screen.getByText('audit:read')).toBeInTheDocument()
  })

  it('renders the actions it is given, because a dead end is not an error page', () => {
    renderWithProviders(
      <ErrorPage
        code="404"
        title="Page not found"
        description="It does not exist."
        actions={<button type="button">Supply map</button>}
      />,
    )

    expect(screen.getByRole('button', { name: 'Supply map' })).toBeInTheDocument()
  })

  /**
   * A tab still naming the screen the operator came from is its own small lie,
   * and `notFoundComponent` has no route `head` to set it.
   */
  it('puts the failure in the document title', () => {
    renderWithProviders(<ErrorPage code="404" title="Page not found" description="Gone." />)

    expect(document.title).toBe('Page not found · Supply Chain')
  })

  it('renders an unrecognised code rather than crashing on the missing icon', () => {
    // A code added to the union and forgotten in the icon table must still
    // produce a readable screen.
    renderWithProviders(
      <ErrorPage code={'418' as never} title="Teapot" description="Short and stout." />,
    )

    expect(screen.getByRole('heading', { level: 1, name: 'Teapot' })).toBeInTheDocument()
    expect(screen.getByText('418')).toBeInTheDocument()
  })
})

describe('FullPageError', () => {
  it('is a landmark, so the screen is navigable on its own', () => {
    renderWithProviders(<FullPageError code="500" title="Broken" description="Sorry." />)

    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'Broken' })).toBeInTheDocument()
  })
})
