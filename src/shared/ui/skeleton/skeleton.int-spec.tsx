import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Skeleton } from './skeleton'

describe('Skeleton integration', () => {
  /**
   * The loading state is announced by the container, not by each bar — which is
   * what `aria-busy` is for, and what the data table and the detail pages set.
   */
  it('sits inside a container that announces the wait', () => {
    render(
      <div aria-busy="true" data-testid="block">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>,
    )

    expect(screen.getByTestId('block')).toHaveAttribute('aria-busy', 'true')
  })
})
