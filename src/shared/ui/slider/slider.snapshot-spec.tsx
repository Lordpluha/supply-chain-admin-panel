import { act, render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Slider } from './slider'

describe('Slider snapshots', () => {
  it('matches snapshot — single value', async () => {
    const { container } = await act(async () =>
      render(<Slider defaultValue={50} min={0} max={100} />),
    )

    expect(container.firstChild).toMatchSnapshot()
  })

  it('matches snapshot — range', async () => {
    const { container } = await act(async () =>
      render(<Slider defaultValue={[2016, 2024]} min={2010} max={2026} />),
    )

    expect(container.firstChild).toMatchSnapshot()
  })
})
