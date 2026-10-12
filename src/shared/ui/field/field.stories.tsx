import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { Input } from '../input'
import { Field } from './field'

const meta = {
  title: 'Forms/Field',
  component: Field,
  parameters: {
    docs: {
      description: {
        component:
          'Label, control and the error **beside the control** — never in a toast. The message is tied to the input with `aria-describedby` and the input is marked `aria-invalid`, which is also what `useServerFieldErrors` scrolls to.',
      },
    },
  },
  args: {
    label: 'Name',
    children: props => <Input {...props} />,
  },
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="max-w-sm">
      <Field label="Name">
        {props => <Input {...props} defaultValue="Salzgitter Cathode Lab" />}
      </Field>
    </div>
  ),
}

export const Required: Story = {
  render: () => (
    <div className="max-w-sm">
      <Field label="ISO-2" required>
        {props => <Input {...props} placeholder="DE" />}
      </Field>
    </div>
  ),
}

export const WithHint: Story = {
  render: () => (
    <div className="max-w-sm">
      <Field label="Capacity / year" hint="Nameplate capacity, in the unit of what it makes.">
        {props => <Input {...props} type="number" defaultValue={22000} />}
      </Field>
    </div>
  ),
}

/**
 * Colour is never the only signal: the border changes, an icon appears, **and**
 * the reason is written out.
 */
export const Invalid: Story = {
  render: () => (
    <div className="max-w-sm">
      <Field label="Name" error="At least 2 characters" required>
        {props => <Input {...props} defaultValue="S" />}
      </Field>
    </div>
  ),
}
