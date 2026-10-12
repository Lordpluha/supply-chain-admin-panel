import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { FormActions } from './form-actions'

const meta = {
  title: 'Forms/FormActions',
  component: FormActions,
  parameters: {
    docs: {
      description: {
        component:
          'The same two buttons every entity dialog ends with. `isPending` comes from the mutation, which is the single source for "do not submit this twice".',
      },
    },
  },
  args: { isPending: false, onCancel: () => {} },
} satisfies Meta<typeof FormActions>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Pending: Story = { args: { isPending: true } }
