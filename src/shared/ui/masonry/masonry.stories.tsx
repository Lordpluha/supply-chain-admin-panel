import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { Card, CardContent, CardHeader, CardTitle } from '../card'
import { Masonry, MasonryItem } from './masonry'

const PANELS = [
  { title: 'Summary', lines: 5 },
  { title: 'Production over time', lines: 2 },
  { title: 'By product', lines: 7 },
  { title: 'By country', lines: 3 },
  { title: 'Peak year', lines: 1 },
  { title: 'Change over range', lines: 2 },
]

const meta = {
  title: 'Layout/Masonry',
  component: Masonry,
  parameters: {
    docs: {
      description: {
        component:
          'CSS multi-column, not the native `grid-template-rows: masonry`, which is still behind a flag outside Safari. The trade-off worth knowing: multi-column flows **top-to-bottom, then across**, so reading order follows each column rather than each row. That is correct for independent panels and wrong for anything sequential — never use it for a form or a list of steps.',
      },
    },
  },
  args: { children: null },
} satisfies Meta<typeof Masonry>

export default meta
type Story = StoryObj<typeof meta>

const panels = () =>
  PANELS.map(panel => (
    <MasonryItem key={panel.title}>
      <Card>
        <CardHeader>
          <CardTitle>{panel.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {Array.from({ length: panel.lines }, (_, line) => (
            <p key={line} className="typo-body-sm text-muted-foreground">
              Line {line + 1}
            </p>
          ))}
        </CardContent>
      </Card>
    </MasonryItem>
  ))

export const TwoColumns: Story = { render: () => <Masonry>{panels()}</Masonry> }

export const ThreeColumns: Story = { render: () => <Masonry columns={3}>{panels()}</Masonry> }

/**
 * The problem it solves: in a plain grid the short card stretches to match its
 * tall neighbour and leaves a block of empty surface.
 */
export const FourColumns: Story = { render: () => <Masonry columns={4}>{panels()}</Masonry> }
