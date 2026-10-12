import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { Skeleton } from './skeleton'

/** Browser-rendered references live directly in this component’s __screenshots__/ directory. */
describe('Skeleton screenshots', () => {
  it('renders its variants', async () => {
    render(
      <div data-testid="subject" className="flex w-80 flex-col gap-3 p-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-5 w-2/5" />
      </div>,
    )

    await expect(page.getByTestId('subject')).toMatchScreenshot()
  })
})
