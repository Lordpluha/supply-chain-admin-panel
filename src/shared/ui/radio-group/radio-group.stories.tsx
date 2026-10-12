import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { Radio, RadioGroup } from './radio-group'

const meta = {
  title: 'Primitives/RadioGroup',
  component: RadioGroup,
  parameters: {
    docs: {
      description: {
        component:
          'For a small set of mutually exclusive choices whose descriptions matter — the export dialog is the panel’s use of it.',
      },
    },
  },
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="xlsx" aria-label="File format">
      {['xlsx', 'xls', 'csv'].map(option => (
        <label key={option} className="flex cursor-pointer items-center gap-2">
          <Radio value={option} />
          <span className="typo-body-sm">.{option}</span>
        </label>
      ))}
    </RadioGroup>
  ),
}

export const WithDescriptions: Story = {
  render: () => (
    <RadioGroup defaultValue="xlsx" aria-label="File format" className="max-w-sm">
      {[
        { value: 'xlsx', label: 'Excel workbook (.xlsx)', hint: 'Keeps column widths and types.' },
        { value: 'xls', label: 'Excel 2003 (.xls)', hint: 'SpreadsheetML, for older tools.' },
        { value: 'csv', label: 'CSV (.csv)', hint: 'Plain UTF-8 text, no formatting.' },
      ].map(option => (
        <label
          key={option.value}
          className="border-border hover:bg-accent/50 has-data-checked:border-primary has-data-checked:bg-primary/5 flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors"
        >
          <Radio value={option.value} className="mt-0.5" />
          <span className="flex flex-col gap-0.5">
            <span className="typo-label">{option.label}</span>
            <span className="typo-caption text-muted-foreground">{option.hint}</span>
          </span>
        </label>
      ))}
    </RadioGroup>
  ),
}
