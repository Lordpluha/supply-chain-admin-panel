import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { Card, CardContent, CardHeader, CardTitle } from '../card'
import { Masonry, MasonryItem } from './masonry'

/** Browser-rendered references live directly in this component’s __screenshots__/ directory. */
describe('Masonry screenshots', () => {
  it('renders its variants', async () => {
    render(
      <div data-testid="subject" className="w-[48rem] p-4">
        <Masonry columns={3} className="w-full">
          {[
            { title: 'Summary', lines: 4 },
            { title: 'Peak year', lines: 1 },
            { title: 'By product', lines: 6 },
          ].map(panel => (
            <MasonryItem key={panel.title}>
              <Card>
                <CardHeader>
                  <CardTitle>{panel.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {Array.from({ length: panel.lines }, (_, line) => (
                    <p key={line}>Line {line + 1}</p>
                  ))}
                </CardContent>
              </Card>
            </MasonryItem>
          ))}
        </Masonry>
      </div>,
    )

    await expect(page.getByTestId('subject')).toMatchScreenshot()
  })
})
