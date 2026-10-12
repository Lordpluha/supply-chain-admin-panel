import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useDocumentTitle } from './pageTitle'

const Screen = ({ title }: { title: string }) => {
  useDocumentTitle(title)
  return null
}

describe('useDocumentTitle', () => {
  it('names the screen in the tab', () => {
    render(<Screen title="Page not found" />)

    expect(document.title).toBe('Page not found · Supply Chain')
  })

  /** A 404 kept the title of wherever the operator came from without this. */
  it('follows the screen when it changes', () => {
    const { rerender } = render(<Screen title="Countries" />)

    expect(document.title).toBe('Countries · Supply Chain')

    rerender(<Screen title="Facilities" />)

    expect(document.title).toBe('Facilities · Supply Chain')
  })
})
