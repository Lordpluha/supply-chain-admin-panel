import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { Badge } from './badge'

describe('Badge screenshots', () => {
  it('renders its variants', async () => {
    render(
      <div data-testid="subject" className="flex flex-col items-start gap-3 p-4">
        <Badge>Active</Badge>
        <Badge variant="secondary">Planned</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="destructive">Suspended</Badge>
        <Badge variant="ghost">Ghost</Badge>
      </div>,
    )

    await expect(page.getByTestId('subject')).toMatchScreenshot()
  })
})
