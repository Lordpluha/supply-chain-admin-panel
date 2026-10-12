import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Checkbox } from './checkbox'

describe('Checkbox snapshots', () => {
  it('matches snapshot — unchecked', () => {
    const { container } = render(<Checkbox aria-label="Read" />)

    expect(container.firstChild).toMatchSnapshot()
  })

  it('matches snapshot — checked', () => {
    const { container } = render(<Checkbox defaultChecked aria-label="Read" />)

    expect(container.firstChild).toMatchSnapshot()
  })

  it('matches snapshot — disabled', () => {
    const { container } = render(<Checkbox disabled aria-label="Read" />)

    expect(container.firstChild).toMatchSnapshot()
  })
})
