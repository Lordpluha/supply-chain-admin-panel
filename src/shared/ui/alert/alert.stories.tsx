import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { AlertTriangle, Info } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from './alert'

const meta = {
  title: 'Primitives/Alert',
  component: Alert,
  parameters: {
    docs: {
      description: {
        component:
          'An in-place message. A validation failure never goes here — it belongs beside its field. See `.claude/rules/errors.md`.',
      },
    },
  },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Alert>
      <Info aria-hidden="true" />
      <AlertTitle>Mixed units</AlertTitle>
      <AlertDescription>
        More than one product is in scope, so there is no honest grand total.
      </AlertDescription>
    </Alert>
  ),
}

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive">
      <AlertTriangle aria-hidden="true" />
      <AlertTitle>Not found</AlertTitle>
      <AlertDescription>That record no longer exists.</AlertDescription>
    </Alert>
  ),
}

export const WithoutIcon: Story = {
  render: () => (
    <Alert>
      <AlertTitle>Built-in role</AlertTitle>
      <AlertDescription>Built-in roles cannot be renamed or deleted.</AlertDescription>
    </Alert>
  ),
}
