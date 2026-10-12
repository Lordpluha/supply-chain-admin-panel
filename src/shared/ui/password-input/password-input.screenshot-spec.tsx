import { describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { renderWithProviders } from '@/shared/lib/test-utils'
import { PasswordInput } from './password-input'

/**
 * Pixels, in a real browser. The baseline lands in `__screenshots__` on the
 * first run.
 */
describe('PasswordInput screenshots', () => {
  it('renders hidden and revealed', async () => {
    renderWithProviders(
      <div data-testid="subject" className="flex w-80 flex-col gap-3 p-4">
        <PasswordInput aria-label="Password" defaultValue="supply-chain" />
      </div>,
    )

    await expect(page.getByTestId('subject')).toMatchScreenshot()
  })
})
