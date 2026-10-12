import { expect, test } from '@playwright/test'
import { open } from '../support/auth'
import {
  choose,
  deleteRow,
  editRow,
  fillField,
  openCreateDialog,
  row,
  save,
  search,
  unique,
} from '../support/crud'

/**
 * The full round trip for one entity: create it, find it, change it, remove it.
 *
 * Driven through the screen rather than the API, because what is being tested
 * is the wiring — the form's schema, the mutation's invalidation, the table's
 * refresh — and none of the four is visible to a unit test.
 */
test.describe('countries CRUD', () => {
  test('creates, edits and deletes a country', async ({ page }) => {
    const name = unique('Testland')
    const renamed = `${name} renamed`

    await open(page, '/countries')

    await openCreateDialog(page)
    await fillField(page, 'Name', name)
    await fillField(page, 'ISO-2', 'TL')
    await fillField(page, 'ISO-3', 'TLD')
    await fillField(page, 'ISO numeric', '999')
    await choose(page, 'Region', 'Europe')
    await fillField(page, 'Latitude', '52.5')
    await fillField(page, 'Longitude', '13.4')
    await save(page)

    // Read: the list refreshed by itself, through `meta.invalidates`.
    await search(page, name)
    await expect(row(page, 'TL')).toBeVisible()

    await editRow(page, name)
    await fillField(page, 'Name', renamed)
    await save(page)

    await search(page, renamed)
    await expect(row(page, renamed)).toBeVisible()

    await deleteRow(page, renamed)
    await expect(row(page, renamed)).toBeHidden()
  })

  test('refuses a country whose codes are the wrong length', async ({ page }) => {
    await open(page, '/countries')
    await openCreateDialog(page)

    await fillField(page, 'Name', 'X')
    await fillField(page, 'ISO-2', 'T')
    await page.getByRole('button', { name: 'Save' }).click()

    // The message lands beside its field, never in a toast.
    await expect(page.getByText('At least 2 characters')).toBeVisible()
    await expect(page.getByText('Exactly 2 letters')).toBeVisible()
    await expect(page.getByRole('dialog')).toBeVisible()
  })

  /** Referential integrity: a country with facilities cannot simply vanish. */
  test('refuses to delete a country that still has facilities', async ({ page }) => {
    await open(page, '/countries')
    await search(page, 'Germany')

    await page.getByRole('button', { name: 'Delete — Germany' }).click()
    await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click()

    await expect(page.getByText(/Remove the facilities/i)).toBeVisible()
    await expect(row(page, 'Germany')).toBeVisible()
  })

  test('opens a country’s own page from its row', async ({ page }) => {
    await open(page, '/countries')
    await search(page, 'Germany')

    await page.getByRole('link', { name: 'Open — Germany' }).click()

    await expect(page).toHaveURL(/\/countries\/de$/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Germany')
    await expect(page.locator('[data-slot="card-title"]', { hasText: 'Facilities' })).toBeVisible()
  })
})
