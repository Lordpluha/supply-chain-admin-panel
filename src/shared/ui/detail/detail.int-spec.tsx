import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/shared/lib/test-utils'
import { DetailList } from './DetailList'
import { DetailState } from './DetailState'

describe('Detail integration', () => {
  /** A related list exists to be clicked through — each entry is a real link. */
  it('lets a related record be reached and followed by keyboard', async () => {
    const onFollow = vi.fn(event => event.preventDefault())
    renderWithProviders(
      <DetailList
        items={[
          {
            id: 'erfurt',
            primary: (
              <a href="/facilities/erfurt" onClick={onFollow}>
                Erfurt Cell Plant
              </a>
            ),
            secondary: 'Gigafactory',
          },
        ]}
      />,
    )

    await userEvent.tab()
    expect(screen.getByRole('link', { name: 'Erfurt Cell Plant' })).toHaveFocus()

    await userEvent.keyboard('{Enter}')
    expect(onFollow).toHaveBeenCalled()
  })

  it('swaps the wait for the record when it arrives', () => {
    const { rerender } = renderWithProviders(
      <DetailState query={{ data: undefined, isLoading: true, isError: false }}>
        {(value: { name: string }) => <p>{value.name}</p>}
      </DetailState>,
    )

    expect(screen.queryByText('Germany')).not.toBeInTheDocument()

    rerender(
      <DetailState query={{ data: { name: 'Germany' }, isLoading: false, isError: false }}>
        {(value: { name: string }) => <p>{value.name}</p>}
      </DetailState>,
    )

    expect(screen.getByText('Germany')).toBeInTheDocument()
  })
})
