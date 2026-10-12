import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { Input } from '../input'
import { Label } from './label'

/** Browser-rendered references live directly in this component’s __screenshots__/ directory. */
describe('Label screenshots', () => {
  it('renders its variants', async () => {
    render(
      <div data-testid="subject" className="flex w-80 flex-col gap-1.5 p-4">
        <Label htmlFor="name">Name</Label>
        <Input id="name" defaultValue="Germany" />
      </div>,
    )

    await expect(page.getByTestId('subject')).toMatchScreenshot()
  })
})
