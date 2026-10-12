import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AutoWidth } from './auto-width'

describe('AutoWidth snapshots', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <AutoWidth labels={['Mine', 'Brine extraction']}>
        <button type="button">Mine</button>
      </AutoWidth>,
    )

    expect(container.firstChild).toMatchSnapshot()
  })
})
