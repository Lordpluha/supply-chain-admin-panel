import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'

describe('Select snapshots', () => {
  it('matches snapshot — closed trigger', () => {
    const { container } = render(
      <Select defaultValue="Europe">
        <SelectTrigger aria-label="Region">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Europe">Europe</SelectItem>
        </SelectContent>
      </Select>,
    )

    expect(container.firstChild).toMatchSnapshot()
  })
})
