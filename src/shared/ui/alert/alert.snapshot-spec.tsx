import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Alert, AlertDescription, AlertTitle } from './alert'

describe('Alert snapshots', () => {
  it.each(['default', 'destructive'] as const)('matches snapshot — %s', variant => {
    const { container } = render(
      <Alert variant={variant}>
        <AlertTitle>Not found</AlertTitle>
        <AlertDescription>That record no longer exists.</AlertDescription>
      </Alert>,
    )

    expect(container.firstChild).toMatchSnapshot()
  })
})
