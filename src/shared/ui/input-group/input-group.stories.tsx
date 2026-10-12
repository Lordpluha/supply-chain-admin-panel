import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { Search } from 'lucide-react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from './input-group'

const meta = {
  title: 'Forms/InputGroup',
  component: InputGroup,
  parameters: {
    docs: {
      description: {
        component:
          'An input with something attached to it — an icon, a unit, a button. The addon is decorative and `aria-hidden`; the input keeps its own accessible name.',
      },
    },
  },
} satisfies Meta<typeof InputGroup>

export default meta
type Story = StoryObj<typeof meta>

export const WithIcon: Story = {
  render: () => (
    <div className="w-64">
      <InputGroup>
        <InputGroupAddon>
          <Search aria-hidden="true" />
        </InputGroupAddon>
        <InputGroupInput placeholder="Search" aria-label="Search" />
      </InputGroup>
    </div>
  ),
}

export const WithUnit: Story = {
  render: () => (
    <div className="w-64">
      <InputGroup>
        <InputGroupInput type="number" defaultValue={22000} aria-label="Capacity per year" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>t</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
}

export const WithButton: Story = {
  render: () => (
    <div className="w-72">
      <InputGroup>
        <InputGroupInput placeholder="operator@example.com" aria-label="Email" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton>Invite</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
}
