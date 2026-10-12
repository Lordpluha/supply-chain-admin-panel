import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Skeleton } from './skeleton'

describe('Skeleton snapshots', () => {
  it('matches snapshot', () => {
    const { container } = render(<Skeleton className="h-5 w-48" />)

    expect(container.firstChild).toMatchSnapshot()
  })
})
