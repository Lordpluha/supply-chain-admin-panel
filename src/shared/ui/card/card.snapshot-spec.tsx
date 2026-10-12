import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Card, CardContent, CardHeader, CardTitle } from './card'

describe('Card snapshots', () => {
  it.each(['default', 'sm'] as const)('matches snapshot — %s size', size => {
    const { container } = render(
      <Card size={size}>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>Totals for the range.</CardContent>
      </Card>,
    )

    expect(container.firstChild).toMatchSnapshot()
  })
})
