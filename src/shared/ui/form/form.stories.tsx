import { zodResolver } from '@hookform/resolvers/zod'
import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Field } from '../field'
import { FormActions } from '../form-actions'
import { Input } from '../input'
import { Form } from './form'

const schema = z.object({
  name: z.string().min(2, 'At least 2 characters'),
  iso2: z.string().length(2, 'Exactly 2 letters'),
})

type Values = z.input<typeof schema>

const meta = {
  title: 'Forms/Form',
  component: Form,
  parameters: {
    docs: {
      description: {
        component:
          '`noValidate` is deliberate: the browser’s own validation bubbles are unstyled, untranslated, and would pre-empt the messages `Field` renders beside the input. The devtools panel is attached here rather than per form, so it is never something a developer has to remember — and never something they can accidentally ship, since `FormDevtools` guards on a literal `import.meta.env.DEV` that Vite replaces with `false` in a production build.\n\n`form-devtools.tsx` has no story of its own for that reason: it does not exist in a built bundle.',
      },
    },
  },
  args: { onSubmit: () => {}, control: undefined as never, children: null },
} satisfies Meta<typeof Form<Values>>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const form = useForm<Values>({
      resolver: zodResolver(schema),
      defaultValues: { name: '', iso2: '' },
    })

    return (
      <div className="max-w-sm">
        <Form control={form.control} onSubmit={form.handleSubmit(() => {})}>
          <Field label="Name" error={form.formState.errors.name?.message} required>
            {props => <Input {...props} {...form.register('name')} placeholder="Germany" />}
          </Field>

          <Field label="ISO-2" error={form.formState.errors.iso2?.message} required>
            {props => <Input {...props} {...form.register('iso2')} placeholder="DE" />}
          </Field>

          <FormActions isPending={false} onCancel={() => form.reset()} />
        </Form>
      </div>
    )
  },
}

/** Submit with both fields empty to see where the messages land. */
export const WithErrors: Story = {
  render: () => {
    const form = useForm<Values>({
      resolver: zodResolver(schema),
      defaultValues: { name: 'S', iso2: 'DEU' },
    })

    return (
      <div className="max-w-sm">
        <Form control={form.control} onSubmit={form.handleSubmit(() => {})}>
          <Field label="Name" error="At least 2 characters" required>
            {props => <Input {...props} {...form.register('name')} />}
          </Field>

          <Field label="ISO-2" error="Exactly 2 letters" required>
            {props => <Input {...props} {...form.register('iso2')} />}
          </Field>

          <FormActions isPending={false} onCancel={() => {}} />
        </Form>
      </div>
    )
  },
}
