import { act, render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs'

/** Browser-rendered references live directly in this component’s __screenshots__/ directory. */
describe('Tabs screenshots', () => {
  it('renders its variants', async () => {
    await act(async () =>
      render(
        <div data-testid="subject" className="w-96 p-4">
          <Tabs defaultValue="country">
            <TabsList>
              <TabsTrigger value="country">Country → product</TabsTrigger>
              <TabsTrigger value="product">Product → country</TabsTrigger>
            </TabsList>
            <TabsContent value="country">Products narrow.</TabsContent>
          </Tabs>
        </div>,
      ),
    )

    // Base UI finishes its initial panel transition on the next animation frame.
    await act(async () => {
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
    })

    await expect(page.getByTestId('subject')).toMatchScreenshot()
  })
})
