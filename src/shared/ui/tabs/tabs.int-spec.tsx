import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs'

const renderTabs = (onValueChange = vi.fn()) => {
  render(
    <Tabs defaultValue="country" onValueChange={onValueChange}>
      <TabsList>
        <TabsTrigger value="country">Country → product</TabsTrigger>
        <TabsTrigger value="product">Product → country</TabsTrigger>
      </TabsList>
      <TabsContent value="country">Products narrow.</TabsContent>
      <TabsContent value="product">Countries narrow.</TabsContent>
    </Tabs>,
  )

  return onValueChange
}

describe('Tabs integration', () => {
  it('swaps the panel when another tab is chosen', async () => {
    const onValueChange = renderTabs()

    await userEvent.click(screen.getByRole('tab', { name: 'Product → country' }))

    expect(screen.getByText('Countries narrow.')).toBeInTheDocument()
    expect(screen.queryByText('Products narrow.')).not.toBeInTheDocument()
    expect(onValueChange).toHaveBeenCalledWith('product', expect.anything())
  })

  /** Arrow keys move between tabs — the ARIA tab pattern, not Tab. */
  it('moves between tabs with the arrow keys', async () => {
    renderTabs()

    act(() => screen.getByRole('tab', { name: 'Country → product' }).focus())
    await userEvent.keyboard('{ArrowRight}')

    expect(screen.getByRole('tab', { name: 'Product → country' })).toHaveFocus()
  })

  it('takes one tab stop for the whole list', async () => {
    render(
      <>
        <button type="button">Before</button>
        <Tabs defaultValue="country">
          <TabsList>
            <TabsTrigger value="country">One</TabsTrigger>
            <TabsTrigger value="product">Two</TabsTrigger>
          </TabsList>
        </Tabs>
        <button type="button">After</button>
      </>,
    )

    await userEvent.tab()
    await userEvent.tab()
    expect(screen.getByRole('tab', { name: 'One' })).toHaveFocus()

    await userEvent.tab()
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus()
  })
})
