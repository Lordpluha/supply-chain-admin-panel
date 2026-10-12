import { act, render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'

/**
 * An overlay renders into a portal, so the screenshot targets the popup itself
 * rather than a wrapper that never contains it. The baseline lands in
 * `__screenshots__` on the first run — see DEPLOYMENT.md on why that has never
 * happened on the machine this was built on.
 */
describe('Select screenshots', () => {
  it('renders open', async () => {
    await act(async () =>
      render(
        <Select defaultValue="Europe" open>
          <SelectTrigger aria-label="Region">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Europe">Europe</SelectItem>
            <SelectItem value="Asia">Asia</SelectItem>
            <SelectItem value="Africa">Africa</SelectItem>
          </SelectContent>
        </Select>,
      ),
    )

    const popup = document.querySelector<HTMLElement>('[data-slot="select-content"]')

    expect(popup).not.toBeNull()
    await expect(page.elementLocator(popup as HTMLElement)).toMatchScreenshot()
  })
})
