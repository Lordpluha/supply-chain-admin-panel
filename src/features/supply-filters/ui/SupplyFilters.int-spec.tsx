import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { authService } from '@/entities/session'
import { DEFAULT_CREDENTIALS } from '@/shared/config/constants'
import { renderWithProviders } from '@/shared/lib/test-utils'
import { useSupplyFilters } from '../model/useSupplyFilters'
import { SupplyFilters } from './SupplyFilters'

/**
 * The lists behind these selects are permission-checked, so the spec signs in
 * first — exactly as the panel does. MSW keeps the cookie it issued and replays
 * it, so the requests that follow are authenticated.
 */
beforeEach(async () => {
  globalThis.history.replaceState(null, '', '/')
  await authService.login(DEFAULT_CREDENTIALS)
})

const Harness = () => {
  const filters = useSupplyFilters()
  return <SupplyFilters filters={filters} />
}

const openSelect = async (name: string) => {
  const input = screen.getByRole('combobox', { name })
  const trigger = input.closest('[data-slot="input-group"]')?.querySelector('button')
  await userEvent.click(trigger as HTMLElement)
}

const optionNames = () =>
  screen.getAllByRole('option').map(option => option.textContent?.trim() ?? '')

describe('SupplyFilters', () => {
  it('lists every country it can offer', async () => {
    renderWithProviders(<Harness />)

    await openSelect('Country')

    await waitFor(() => expect(optionNames()).toContain('Germany'))
    expect(optionNames()).toContain('Any country')
  })

  /**
   * The requirement that shapes the data model: the join runs through
   * facilities and production records, so the narrowing is real rather than a
   * hard-coded table.
   */
  it('narrows the product list to what the chosen country makes', async () => {
    renderWithProviders(<Harness />)

    await openSelect('Country')
    await userEvent.click(await screen.findByRole('option', { name: 'Germany' }))

    await waitFor(() => expect(globalThis.location.search).toContain('countryId=de'))

    await openSelect('Product')

    await waitFor(() => {
      const names = optionNames()
      expect(names).toContain('NMC 811 Cathode')
      expect(names).not.toContain('Lithium Carbonate')
    })
  })

  it('narrows the country list to those that make the chosen product', async () => {
    renderWithProviders(<Harness />)

    await openSelect('Product')
    await userEvent.click(await screen.findByRole('option', { name: 'Lithium Carbonate' }))

    await waitFor(() => expect(globalThis.location.search).toContain('productId=li-carb'))
    await openSelect('Country')

    await waitFor(() => {
      const names = optionNames()
      expect(names).toContain('Chile')
      expect(names).not.toContain('Germany')
    })
  })

  // Each German site makes one product, so a list that ignored the site would
  // still offer all three.
  it('narrows the product list again to what the chosen facility makes', async () => {
    renderWithProviders(<Harness />)

    await openSelect('Country')
    await userEvent.click(await screen.findByRole('option', { name: 'Germany' }))
    await openSelect('Facility')
    await userEvent.click(await screen.findByRole('option', { name: 'Erfurt Cell Plant' }))

    await waitFor(() =>
      expect(globalThis.location.search).toContain('facilityId=erfurt-cell-plant'),
    )
    await openSelect('Product')

    await waitFor(() => {
      const names = optionNames()
      expect(names).toContain('Cylindrical Cell 21700')
      expect(names).not.toContain('NMC 811 Cathode')
    })
  })

  it('narrows the facility list to the sites that make the chosen product', async () => {
    renderWithProviders(<Harness />)

    await openSelect('Country')
    await userEvent.click(await screen.findByRole('option', { name: 'Germany' }))
    await openSelect('Product')
    await userEvent.click(await screen.findByRole('option', { name: 'NMC 811 Cathode' }))

    await waitFor(() => expect(globalThis.location.search).toContain('productId=nmc-811'))
    await openSelect('Facility')

    await waitFor(() => {
      const names = optionNames()
      expect(names).toContain('Salzgitter Cathode Lab')
      expect(names).not.toContain('Erfurt Cell Plant')
    })
  })

  /** The facility level is offered only once a country narrows it down. */
  it('offers a facility only after a country is chosen', async () => {
    renderWithProviders(<Harness />)

    expect(screen.queryByRole('combobox', { name: 'Facility' })).not.toBeInTheDocument()

    await openSelect('Country')
    await userEvent.click(await screen.findByRole('option', { name: 'Germany' }))

    expect(await screen.findByRole('combobox', { name: 'Facility' })).toBeInTheDocument()
  })

  it('offers to clear only once something is filtered', async () => {
    renderWithProviders(<Harness />)

    expect(screen.queryByRole('button', { name: /Clear filters/ })).not.toBeInTheDocument()

    await openSelect('Country')
    await userEvent.click(await screen.findByRole('option', { name: 'Germany' }))

    const clear = await screen.findByRole('button', { name: /Clear filters/ })
    await userEvent.click(clear)

    await waitFor(() => expect(globalThis.location.search).toBe(''))
  })
})
