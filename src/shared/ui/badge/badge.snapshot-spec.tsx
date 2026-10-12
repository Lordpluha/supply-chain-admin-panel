import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Badge } from './badge'

const VARIANTS = ['default', 'secondary', 'outline', 'destructive', 'ghost'] as const

describe('Badge snapshots', () => {
  it.each(VARIANTS)('matches snapshot — %s', variant => {
    const { container } = render(<Badge variant={variant}>Active</Badge>)

    expect(container.firstChild).toMatchSnapshot()
  })
})
