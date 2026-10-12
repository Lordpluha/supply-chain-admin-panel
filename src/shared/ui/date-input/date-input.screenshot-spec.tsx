import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
import { renderWithProviders } from '@/shared/lib/test-utils'
import { DatePicker } from './date-input'

describe('DateInput screenshots', () => {
  // The open calendar marks today, so an unfrozen clock made the baseline
  // expire the day after it was taken. Only `Date` is faked: Base UI's
  // positioning still needs real timers and animation frames.
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-09-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  for (const theme of ['light', 'dim', 'dark']) {
    it(`renders empty and selected dates in ${theme}`, async () => {
      document.documentElement.dataset.theme = theme
      // The providers supply i18n: without them the trigger printed the raw
      // `common.selectDate` key instead of its English copy.
      renderWithProviders(
        <div data-testid="subject" className="flex flex-wrap gap-3 bg-background p-4">
          <label className="flex flex-col gap-1.5 typo-label">
            From date
            <DatePicker value="2026-09-01" onValueChange={() => {}} max="2026-09-20" />
          </label>
          <label className="flex flex-col gap-1.5 typo-label">
            To date
            <DatePicker min="2026-09-01" defaultOpen />
          </label>
        </div>,
      )
      await expect(page.getByTestId('subject')).toMatchScreenshot()
      await expect(page.getByRole('dialog', { name: 'Select date' })).toMatchScreenshot()
    })
  }
})
