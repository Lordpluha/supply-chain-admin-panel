import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { Input } from '../input'
import { Field } from './field'

/** Browser-rendered references live directly in this component’s __screenshots__/ directory. */
describe('Field screenshots', () => {
  it('renders its variants', async () => {
    render(
      <div data-testid="subject" className="flex w-80 flex-col gap-4 p-4">
        <Field label="Name">{props => <Input {...props} defaultValue="Germany" />}</Field>
        <Field label="Capacity" hint="Nameplate capacity, per year." required>
          {props => <Input {...props} defaultValue="22000" />}
        </Field>
        <Field label="ISO-2" error="Exactly 2 letters" required>
          {props => <Input {...props} defaultValue="D" />}
        </Field>
      </div>,
    )

    await expect(page.getByTestId('subject')).toMatchScreenshot()
  })
})
