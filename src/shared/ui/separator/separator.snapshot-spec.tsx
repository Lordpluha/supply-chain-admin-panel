import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Separator } from './separator'

describe('Separator snapshots', () => {
  it.each(['horizontal', 'vertical'] as const)('matches snapshot — %s', orientation => {
    const { container } = render(<Separator orientation={orientation} />)

    expect(container.firstChild).toMatchSnapshot()
  })
})
