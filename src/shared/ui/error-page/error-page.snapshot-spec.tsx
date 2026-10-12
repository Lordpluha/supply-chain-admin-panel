import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ErrorPage } from './error-page'

const CODES = ['403', '404', '500', 'offline'] as const

describe('ErrorPage snapshots', () => {
  it.each(CODES)('matches snapshot — %s', code => {
    const { container } = render(
      <ErrorPage code={code} title="Something happened" description="And here is what." />,
    )

    expect(container.firstChild).toMatchSnapshot()
  })

  it('matches snapshot — with a detail', () => {
    const { container } = render(
      <ErrorPage
        code="404"
        title="Page not found"
        description="The page you asked for does not exist."
        detail="/facilities/salzgitter"
      />,
    )

    expect(container.firstChild).toMatchSnapshot()
  })
})
