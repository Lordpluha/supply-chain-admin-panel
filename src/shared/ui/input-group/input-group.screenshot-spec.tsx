import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from './input-group'

/** Browser-rendered references live directly in this component’s __screenshots__/ directory. */
describe('InputGroup screenshots', () => {
  it('renders its variants', async () => {
    render(
      <div data-testid="subject" className="flex w-80 flex-col gap-3 p-4">
        <InputGroup>
          <InputGroupInput placeholder="Search" aria-label="Search" />
        </InputGroup>
        <InputGroup>
          <InputGroupInput defaultValue="22000" aria-label="Capacity" />
          <InputGroupAddon align="inline-end">
            <InputGroupText>t</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput placeholder="operator@example.com" aria-label="Email" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton>Invite</InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>,
    )

    await expect(page.getByTestId('subject')).toMatchScreenshot()
  })
})
