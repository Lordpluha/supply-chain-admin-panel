import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { Input } from './input'

/** Browser-rendered references live directly in this component’s __screenshots__/ directory. */
describe('Input screenshots', () => {
  it('renders its variants', async () => {
    render(
      <div data-testid="subject" className="flex w-80 flex-col gap-3 p-4">
        <Input placeholder="Salzgitter Cathode Lab" />
        <Input defaultValue="Germany" />
        <Input aria-invalid defaultValue="S" />
        <Input disabled defaultValue="Read only" />
      </div>,
    )

    await expect(page.getByTestId('subject')).toMatchScreenshot()
  })
})
