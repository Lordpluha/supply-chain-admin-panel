import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { Typography } from './typography'

/** Browser-rendered references live directly in this component’s __screenshots__/ directory. */
describe('Typography screenshots', () => {
  it('renders its variants', async () => {
    render(
      <div data-testid="subject" className="flex flex-col items-start gap-3 p-4">
        <Typography size="display">Display</Typography>
        <Typography level={1}>Heading 1</Typography>
        <Typography level={3}>Heading 3</Typography>
        <Typography level={6}>Heading 6</Typography>
        <Typography size="body">Body</Typography>
        <Typography size="caption" tone="muted">
          Caption
        </Typography>
        <Typography size="code">const unit = &apos;t&apos;</Typography>
      </div>,
    )

    await expect(page.getByTestId('subject')).toMatchScreenshot()
  })
})
