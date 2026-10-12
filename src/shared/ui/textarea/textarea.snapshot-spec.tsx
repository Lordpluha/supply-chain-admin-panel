import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Textarea } from './textarea'

describe('Textarea snapshots', () => {
  it('matches snapshot — default', () => {
    const { container } = render(<Textarea placeholder="Describe the role" />)

    expect(container.firstChild).toMatchSnapshot()
  })

  it('matches snapshot — invalid', () => {
    const { container } = render(<Textarea aria-invalid />)

    expect(container.firstChild).toMatchSnapshot()
  })
})
