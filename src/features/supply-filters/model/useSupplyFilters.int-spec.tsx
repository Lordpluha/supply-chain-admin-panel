import { act, renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it } from 'vitest'
import { Providers } from '@/shared/lib/test-utils'
import { useSupplyFilters } from './useSupplyFilters'

const wrapper = ({ children }: { children: ReactNode }) => <Providers>{children}</Providers>

const search = () => globalThis.location.search

/** nuqs batches its writes, so the URL catches up a tick after the setter. */
const expectSearch = (assert: (value: string) => void) => waitFor(() => assert(search()))

beforeEach(() => {
  globalThis.history.replaceState(null, '', '/')
})

const render = () => renderHook(() => useSupplyFilters(), { wrapper })

describe('useSupplyFilters', () => {
  it('starts on the whole range with nothing chosen', () => {
    const { result } = render()

    expect(result.current.countryId).toBe('')
    expect(result.current.productId).toBe('')
    expect(result.current.yearFrom).toBe(2010)
    expect(result.current.yearTo).toBe(2026)
    expect(result.current.isFiltered).toBe(false)
  })

  /** A filtered view has to survive a reload and a paste into a message. */
  it('puts a choice in the URL', async () => {
    const { result } = render()

    await act(async () => {
      result.current.setCountry('de')
    })

    await expectSearch(value => expect(value).toContain('countryId=de'))
    expect(result.current.countryId).toBe('de')
    expect(result.current.isFiltered).toBe(true)
  })

  it('reads a choice back out of the URL', () => {
    globalThis.history.replaceState(null, '', '/?countryId=de&productId=li-carb')

    const { result } = render()

    expect(result.current.countryId).toBe('de')
    expect(result.current.productId).toBe('li-carb')
  })

  it('drops the key rather than writing an empty one when cleared', async () => {
    globalThis.history.replaceState(null, '', '/?countryId=de')
    const { result } = render()

    await act(async () => {
      result.current.setCountry('')
    })

    await expectSearch(value => expect(value).not.toContain('countryId'))
    expect(result.current.countryId).toBe('')
  })

  /**
   * A facility belongs to one country, so changing the country always
   * invalidates it — keeping it would filter to a site no longer in scope and
   * quietly return nothing.
   */
  it('drops the facility whenever the country changes', async () => {
    globalThis.history.replaceState(null, '', '/?countryId=de&facilityId=erfurt-cell-plant')
    const { result } = render()

    await act(async () => {
      result.current.setCountry('cl')
    })

    expect(result.current.countryId).toBe('cl')
    expect(result.current.facilityId).toBe('')
  })

  /** Product and country are peers: either can narrow the other. */
  it('keeps the product when the country is cleared', async () => {
    globalThis.history.replaceState(null, '', '/?countryId=de&productId=li-carb')
    const { result } = render()

    await act(async () => {
      result.current.setCountry('')
    })

    expect(result.current.productId).toBe('li-carb')
  })

  it('keeps the product when the country merely changes', async () => {
    globalThis.history.replaceState(null, '', '/?countryId=de&productId=li-carb')
    const { result } = render()

    await act(async () => {
      result.current.setCountry('cl')
    })

    expect(result.current.productId).toBe('li-carb')
  })

  /** A pasted link with the ends the wrong way round would return nothing. */
  it('keeps the year range ordered however it is set', async () => {
    const { result } = render()

    await act(async () => {
      result.current.setYearRange(2024, 2016)
    })

    expect(result.current.yearFrom).toBe(2016)
    expect(result.current.yearTo).toBe(2024)
  })

  it('clamps the range to the years the dataset covers', async () => {
    const { result } = render()

    await act(async () => {
      result.current.setYearRange(1990, 2100)
    })

    expect(result.current.yearFrom).toBe(2010)
    expect(result.current.yearTo).toBe(2026)
  })

  it('counts a narrowed range as filtered', async () => {
    const { result } = render()

    await act(async () => {
      result.current.setYearRange(2016, 2024)
    })

    expect(result.current.isFiltered).toBe(true)
  })

  it('empties the URL when reset', async () => {
    globalThis.history.replaceState(null, '', '/?countryId=de&productId=li-carb&yearFrom=2016')
    const { result } = render()

    await act(async () => {
      result.current.reset()
    })

    await expectSearch(value => expect(value).toBe(''))
    expect(result.current.isFiltered).toBe(false)
  })

  /** Ready to hand straight to `analyticsQueries`, with the empties dropped. */
  it('hands the analytics layer only what was actually chosen', async () => {
    const { result } = render()

    expect(result.current.analytics).toEqual({
      countryId: undefined,
      facilityId: undefined,
      productId: undefined,
      yearFrom: 2010,
      yearTo: 2026,
    })

    await act(async () => {
      result.current.setCountry('de')
    })

    await expectSearch(value => expect(value).toContain('countryId=de'))
    expect(result.current.analytics.countryId).toBe('de')
  })
})
