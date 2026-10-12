import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from '../button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from './card'

describe('Card integration', () => {
  it('lets the action in its header be reached and pressed', async () => {
    const onView = vi.fn()
    render(
      <Card>
        <CardHeader>
          <CardTitle>Facilities</CardTitle>
          <CardAction>
            <Button size="sm" onClick={onView}>
              View all
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>3 sites in Germany.</CardContent>
      </Card>,
    )

    await userEvent.click(screen.getByRole('button', { name: 'View all' }))

    expect(onView).toHaveBeenCalledTimes(1)
  })
})
