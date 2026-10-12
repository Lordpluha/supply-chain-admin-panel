import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs'

const meta = {
  title: 'Primitives/Tabs',
  component: Tabs,
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

/**
 * How the overview uses it — a two-way choice that decides which of the two
 * filters narrows the other.
 */
export const Default: Story = {
  render: () => (
    <Tabs defaultValue="country">
      <TabsList>
        <TabsTrigger value="country">A country first</TabsTrigger>
        <TabsTrigger value="product">A product first</TabsTrigger>
      </TabsList>
      <TabsContent value="country" className="typo-body-sm pt-3">
        The product list narrows to what is actually made in the chosen country.
      </TabsContent>
      <TabsContent value="product" className="typo-body-sm pt-3">
        The country list narrows to those that actually make the chosen product.
      </TabsContent>
    </Tabs>
  ),
}

export const Vertical: Story = {
  render: () => (
    <Tabs defaultValue="light" orientation="vertical" className="flex gap-4">
      <TabsList>
        <TabsTrigger value="light">Light</TabsTrigger>
        <TabsTrigger value="dark">Dark</TabsTrigger>
        <TabsTrigger value="dim">Dim</TabsTrigger>
      </TabsList>
      <TabsContent value="light" className="typo-body-sm">
        The default.
      </TabsContent>
      <TabsContent value="dark" className="typo-body-sm">
        Full contrast.
      </TabsContent>
      <TabsContent value="dim" className="typo-body-sm">
        A dark theme with softer contrast.
      </TabsContent>
    </Tabs>
  ),
}
