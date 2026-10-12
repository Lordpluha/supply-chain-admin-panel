import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'

/** Browser-rendered references live directly in this component’s __screenshots__/ directory. */
describe('Card screenshots', () => {
  it('renders its variants', async () => {
    render(
      <div data-testid="subject" className="flex flex-col items-start gap-3 p-4">
        <Card className="w-80">
          <CardHeader>
            <CardTitle>Production over time</CardTitle>
            <CardDescription>Total output per year.</CardDescription>
          </CardHeader>
          <CardContent>411,326 t across 2010–2026.</CardContent>
        </Card>
        <Card size="sm" className="w-80">
          <CardHeader>
            <CardTitle>Peak year</CardTitle>
          </CardHeader>
          <CardContent>2024</CardContent>
        </Card>
      </div>,
    )

    await expect(page.getByTestId('subject')).toMatchScreenshot()
  })
})
