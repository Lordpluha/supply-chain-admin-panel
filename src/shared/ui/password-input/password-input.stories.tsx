import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { Label } from '../label'
import { PasswordInput } from './password-input'

const meta = {
  title: 'Forms/PasswordInput',
  component: PasswordInput,
  parameters: {
    docs: {
      description: {
        component:
          'Typing a password blind is where most sign-in failures come from, and retyping it is worse. Hidden stays the default — the reveal is something the operator asks for. The toggle is a real `<button type="button">`, so it cannot submit the form, and it carries `aria-pressed` so a screen reader can tell whether the password is showing.',
      },
    },
  },
  args: { 'aria-label': 'Password' },
} satisfies Meta<typeof PasswordInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithAValue: Story = { args: { defaultValue: 'supply-chain' } }

export const Labelled: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-1.5">
      <Label htmlFor="password">Password</Label>
      <PasswordInput id="password" autoComplete="current-password" />
    </div>
  ),
}

export const Disabled: Story = { args: { disabled: true, defaultValue: 'supply-chain' } }
