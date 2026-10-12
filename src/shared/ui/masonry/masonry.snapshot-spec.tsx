import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Masonry, MasonryItem } from './masonry'

describe('Masonry snapshots', () => {
  it.each([2, 3, 4] as const)('matches snapshot — %i columns', columns => {
    const { container } = render(
      <Masonry columns={columns}>
        <MasonryItem>Summary</MasonryItem>
      </Masonry>,
    )

    expect(container.firstChild).toMatchSnapshot()
  })
})
