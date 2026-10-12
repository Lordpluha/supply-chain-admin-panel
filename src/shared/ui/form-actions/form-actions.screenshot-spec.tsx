import { describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { renderWithProviders } from '@/shared/lib/test-utils'
import { FormActions } from './form-actions'

/** Browser-rendered references live directly in this component’s __screenshots__/ directory. */
describe('FormActions screenshots', () => {
  it('renders its variants', async () => {
    renderWithProviders(
      <div data-testid="subject" className="flex w-96 flex-col gap-3 p-4">
        <FormActions isPending={false} onCancel={() => {}} />
        <FormActions isPending onCancel={() => {}} />
      </div>,
    )

    await expect(page.getByTestId('subject')).toMatchScreenshot()
  })
})
