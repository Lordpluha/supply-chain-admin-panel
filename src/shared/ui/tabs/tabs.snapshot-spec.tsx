import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs'

describe('Tabs snapshots', () => {
  it.each(['horizontal', 'vertical'] as const)('matches snapshot — %s', orientation => {
    const { container } = render(
      <Tabs defaultValue="country" orientation={orientation}>
        <TabsList>
          <TabsTrigger value="country">Country → product</TabsTrigger>
          <TabsTrigger value="product">Product → country</TabsTrigger>
        </TabsList>
        <TabsContent value="country">Products narrow.</TabsContent>
      </Tabs>,
    )

    expect(container.firstChild).toMatchSnapshot()
  })
})
