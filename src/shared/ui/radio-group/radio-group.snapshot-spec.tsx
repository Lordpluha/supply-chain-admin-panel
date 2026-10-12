import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Radio, RadioGroup } from './radio-group'

describe('RadioGroup snapshots', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <RadioGroup defaultValue="xlsx" aria-label="File format">
        {['xlsx', 'xls', 'csv'].map(option => (
          <Radio key={option} value={option} aria-label={option} />
        ))}
      </RadioGroup>,
    )

    expect(container.firstChild).toMatchSnapshot()
  })
})
