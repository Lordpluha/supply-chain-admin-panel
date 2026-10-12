import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { Typography } from './typography'

const meta = {
  title: 'Primitives/Typography',
  component: Typography,
  parameters: {
    docs: {
      description: {
        component:
          'Every size resolves to a `--typography-*` token stated in `rem`. There is no `px` font size anywhere in this project and no arbitrary value such as `text-[18px]`.',
      },
    },
  },
  args: { children: 'Production by country and product' },
} satisfies Meta<typeof Typography>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/**
 * A heading with no explicit size takes the size matching its level, so the
 * document outline and the visual hierarchy cannot drift apart by accident.
 */
export const Headings: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Typography size="display">Display</Typography>
      <Typography level={1}>Heading 1</Typography>
      <Typography level={2}>Heading 2</Typography>
      <Typography level={3}>Heading 3</Typography>
      <Typography level={4}>Heading 4</Typography>
      <Typography level={5}>Heading 5</Typography>
      <Typography level={6}>Heading 6</Typography>
    </div>
  ),
}

export const Body: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Typography size="bodyLg">Body large</Typography>
      <Typography size="body">Body</Typography>
      <Typography size="bodySm">Body small</Typography>
      <Typography size="label">Label</Typography>
      <Typography size="caption">Caption</Typography>
      <Typography size="overline">Overline</Typography>
      <Typography size="button">Button</Typography>
      <Typography size="code">const unit = &apos;t&apos;</Typography>
    </div>
  ),
}

export const Tones: Story = {
  render: () => (
    <div className="flex flex-col gap-1">
      <Typography tone="default">Default</Typography>
      <Typography tone="muted">Muted</Typography>
      <Typography tone="primary">Primary</Typography>
      <Typography tone="destructive">Destructive</Typography>
      <Typography tone="success">Success</Typography>
      <Typography tone="warning">Warning</Typography>
    </div>
  ),
}

/**
 * Size and semantics are separate on purpose: a paragraph that needs to look
 * like a heading says so without becoming one in the outline.
 */
export const SizeWithoutSemantics: Story = {
  render: () => (
    <Typography as="p" size="h3">
      Looks like a heading, is still a paragraph
    </Typography>
  ),
}
