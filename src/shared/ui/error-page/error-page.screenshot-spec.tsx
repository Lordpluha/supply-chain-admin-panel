import { describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { renderWithProviders } from '@/shared/lib/test-utils'
import { Button } from '../button'
import { ErrorPage } from './error-page'

/** Browser-rendered references live directly in this component’s __screenshots__/ directory. */
describe('ErrorPage screenshots', () => {
  it('renders its variants', async () => {
    renderWithProviders(
      <div data-testid="subject" className="w-[32rem] p-4">
        <ErrorPage
          code="404"
          title="Page not found"
          description="The page you asked for does not exist."
          detail="/facilities/salzgitter"
          actions={<Button variant="outline">Supply map</Button>}
        />
      </div>,
    )

    await expect(page.getByTestId('subject')).toMatchScreenshot()
  })
})
