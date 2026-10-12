import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Label } from './label'

describe('Label snapshots', () => {
  it('matches snapshot', () => {
    const { container } = render(<Label htmlFor="name">Name</Label>)

    expect(container.firstChild).toMatchSnapshot()
  })
})
