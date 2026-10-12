import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs'

const renderTabs = (defaultValue = 'country') =>
  render(
    <Tabs defaultValue={defaultValue}>
      <TabsList>
        <TabsTrigger value="country">Country → product</TabsTrigger>
        <TabsTrigger value="product">Product → country</TabsTrigger>
      </TabsList>
      <TabsContent value="country">Products narrow.</TabsContent>
      <TabsContent value="product">Countries narrow.</TabsContent>
    </Tabs>,
  )

describe('Tabs', () => {
  it('renders a tablist with one tab per trigger', () => {
    renderTabs()

    expect(screen.getByRole('tablist')).toBeInTheDocument()
    expect(screen.getAllByRole('tab')).toHaveLength(2)
  })

  it('marks the default as the selected one', () => {
    renderTabs()

    expect(screen.getByRole('tab', { name: 'Country → product' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(screen.getByRole('tab', { name: 'Product → country' })).toHaveAttribute(
      'aria-selected',
      'false',
    )
  })

  it('shows only the panel belonging to the selected tab', () => {
    renderTabs()

    expect(screen.getByText('Products narrow.')).toBeInTheDocument()
    expect(screen.queryByText('Countries narrow.')).not.toBeInTheDocument()
  })

  /** The orientation is carried by the root, which is what the arrow-key
   *  handling reads; the list inherits its styling from it. */
  it('can be oriented vertically', () => {
    const { container } = render(
      <Tabs defaultValue="light" orientation="vertical">
        <TabsList>
          <TabsTrigger value="light">Light</TabsTrigger>
        </TabsList>
      </Tabs>,
    )

    expect(container.querySelector('[data-orientation="vertical"]')).toBeInTheDocument()
  })
})
