import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { Alert, AlertDescription, AlertTitle } from './alert'

/** Browser-rendered references live directly in this component’s __screenshots__/ directory. */
describe('Alert screenshots', () => {
  it('renders its variants', async () => {
    render(
      <div data-testid="subject" className="flex w-96 flex-col gap-3 p-4">
        <Alert>
          <AlertTitle>Mixed units</AlertTitle>
          <AlertDescription>There is no honest grand total.</AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <AlertTitle>Not found</AlertTitle>
          <AlertDescription>That record no longer exists.</AlertDescription>
        </Alert>
      </div>,
    )

    await expect(page.getByTestId('subject')).toMatchScreenshot()
  })
})
