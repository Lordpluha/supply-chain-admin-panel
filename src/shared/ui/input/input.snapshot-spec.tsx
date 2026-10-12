import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Input } from './input'

describe('Input snapshots', () => {
  it('matches snapshot — default', () => {
    const { container } = render(<Input placeholder="Germany" />)

    expect(container.firstChild).toMatchSnapshot()
  })

  it('matches snapshot — invalid', () => {
    const { container } = render(<Input aria-invalid defaultValue="S" />)

    expect(container.firstChild).toMatchSnapshot()
  })

  it('matches snapshot — disabled', () => {
    const { container } = render(<Input disabled defaultValue="Read only" />)

    expect(container.firstChild).toMatchSnapshot()
  })
})
