import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Toaster } from './sonner'

describe('Toaster snapshots', () => {
  it('matches snapshot — empty', () => {
    const { container } = render(<Toaster position="bottom-right" />)

    expect(container.firstChild).toMatchSnapshot()
  })
})
