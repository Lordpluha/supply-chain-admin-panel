import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { Label } from '../label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './select'

const meta = {
  title: 'Primitives/Select',
  component: Select,
  parameters: {
    docs: {
      description: {
        component:
          'The Base UI primitive. Most screens use `OptionSelect` instead, which wraps this with the "any" entry, the auto-width sizer and the value formatter.',
      },
    },
  },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="flex w-56 flex-col gap-1.5">
      <Label>Region</Label>
      <Select defaultValue="Europe">
        <SelectTrigger aria-label="Region">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Europe">Europe</SelectItem>
          <SelectItem value="Asia">Asia</SelectItem>
          <SelectItem value="Africa">Africa</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
}

export const Grouped: Story = {
  render: () => (
    <div className="w-56">
      <Select defaultValue="li-carb">
        <SelectTrigger aria-label="Product">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Raw material</SelectLabel>
            <SelectItem value="li-carb">Lithium Carbonate</SelectItem>
            <SelectItem value="co-sulf">Cobalt Sulfate</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Cell</SelectLabel>
            <SelectItem value="cell-21700">Cylindrical Cell 21700</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="w-56">
      <Select disabled defaultValue="Europe">
        <SelectTrigger aria-label="Region">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Europe">Europe</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
}
