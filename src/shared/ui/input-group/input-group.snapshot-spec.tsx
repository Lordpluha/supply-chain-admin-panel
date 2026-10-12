import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from './input-group'

describe('InputGroup snapshots', () => {
  it('matches snapshot — with a trailing unit', () => {
    const { container } = render(
      <InputGroup>
        <InputGroupInput aria-label="Capacity" defaultValue={22000} />
        <InputGroupAddon align="inline-end">
          <InputGroupText>t</InputGroupText>
        </InputGroupAddon>
      </InputGroup>,
    )

    expect(container.firstChild).toMatchSnapshot()
  })
})
