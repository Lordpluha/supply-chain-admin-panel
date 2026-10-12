import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { Button } from '../button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card'

const meta = {
  title: 'Primitives/Card',
  component: Card,
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Production over time</CardTitle>
        <CardDescription>Total output per year across everything in scope.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="typo-body-sm text-muted-foreground">411,326 t across 2010–2026.</p>
      </CardContent>
    </Card>
  ),
}

export const WithAction: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Facilities</CardTitle>
        <CardAction>
          <Button size="sm" variant="ghost">
            View all
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="typo-body-sm text-muted-foreground">3 sites in Germany.</p>
      </CardContent>
    </Card>
  ),
}

export const WithFooter: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Export</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="typo-body-sm">10 rows, exactly as filtered and sorted on screen.</p>
      </CardContent>
      <CardFooter className="border-t">
        <Button size="sm">Download</Button>
      </CardFooter>
    </Card>
  ),
}

/**
 * `size="sm"` narrows `--card-spacing` from 1.5rem to 1rem. Everything inside
 * reads that one variable, so nothing has to be adjusted per slot.
 */
export const Compact: Story = {
  render: () => (
    <Card size="sm" className="max-w-sm">
      <CardHeader>
        <CardTitle>Peak year</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="typo-h5 tabular-nums">2024</p>
      </CardContent>
    </Card>
  ),
}
