import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Input } from '../input'
import { Field } from './field'

describe('Field snapshots', () => {
  it('matches snapshot — plain', () => {
    const { container } = render(<Field label="Name">{props => <Input {...props} />}</Field>)

    expect(container.firstChild).toMatchSnapshot()
  })

  it('matches snapshot — required with a hint', () => {
    const { container } = render(
      <Field label="Capacity" hint="Nameplate capacity, per year." required>
        {props => <Input {...props} />}
      </Field>,
    )

    expect(container.firstChild).toMatchSnapshot()
  })

  it('matches snapshot — invalid', () => {
    const { container } = render(
      <Field label="Name" error="At least 2 characters">
        {props => <Input {...props} />}
      </Field>,
    )

    expect(container.firstChild).toMatchSnapshot()
  })
})
