import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Button } from './button'

const VARIANTS = ['default', 'outline', 'secondary', 'ghost', 'destructive', 'link'] as const
const SIZES = ['xs', 'sm', 'default', 'lg'] as const

describe('Button snapshots', () => {
  it.each(VARIANTS)('matches snapshot — %s variant', variant => {
    const { container } = render(<Button variant={variant}>Press</Button>)

    expect(container.firstChild).toMatchSnapshot()
  })

  it.each(SIZES)('matches snapshot — %s size', size => {
    const { container } = render(<Button size={size}>Press</Button>)

    expect(container.firstChild).toMatchSnapshot()
  })

  it('matches snapshot — disabled', () => {
    const { container } = render(<Button disabled>Press</Button>)

    expect(container.firstChild).toMatchSnapshot()
  })
})
