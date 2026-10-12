import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { Radio, RadioGroup } from './radio-group'

/** Browser-rendered references live directly in this component’s __screenshots__/ directory. */
describe('RadioGroup screenshots', () => {
  it('renders its variants', async () => {
    render(
      <div data-testid="subject" className="flex flex-col items-start gap-3 p-4">
        <RadioGroup defaultValue="xlsx" aria-label="File format">
          {['xlsx', 'xls', 'csv'].map(option => (
            <Radio key={option} value={option} aria-label={option} />
          ))}
        </RadioGroup>
      </div>,
    )

    await expect(page.getByTestId('subject')).toMatchScreenshot()
  })
})
