import { expect, test } from '@playwright/test'
import { open } from '../support/auth'
import { choose, fillField, openCreateDialog, save } from '../support/crud'

test.describe('production CRUD', () => {
  /**
   * A production record has no name of its own — it is a facility, a product
   * and a year — so this one is identified by the year it was filed under.
   */
  test('creates, edits and deletes a production record', async ({ page }) => {
    await open(page, '/production')

    await openCreateDialog(page)
    await choose(page, 'Facility', 'Erfurt Cell Plant')
    await choose(page, 'Product', 'Cylindrical Cell 21700')
    await choose(page, 'Year', '2011')
    await fillField(page, 'Output', '4242')
    await save(page)

    await choose(page, 'Year', '2011')
    await choose(page, 'Country', 'Germany')

    const row = page.getByRole('row').filter({ hasText: 'Erfurt Cell Plant' }).first()
    await expect(row).toContainText('4,242')

    const label = 'Erfurt Cell Plant · Cylindrical Cell 21700 · 2011'

    await page.getByRole('button', { name: `Edit — ${label}` }).click()
    await fillField(page, 'Output', '5353')
    await save(page)

    await expect(
      page.getByRole('row').filter({ hasText: 'Erfurt Cell Plant' }).first(),
    ).toContainText('5,353')

    await page.getByRole('button', { name: `Delete — ${label}` }).click()
    await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click()

    await expect(page.getByRole('dialog')).toBeHidden()

    // The row is gone, not the table: Germany reported other output in 2011,
    // and asserting an empty screen would have been asserting the seed.
    await expect(page.getByRole('button', { name: `Edit — ${label}` })).toBeHidden()
  })

  test('refuses an output below zero', async ({ page }) => {
    await open(page, '/production')
    await openCreateDialog(page)

    await choose(page, 'Facility', 'Erfurt Cell Plant')
    await choose(page, 'Product', 'Cylindrical Cell 21700')
    await fillField(page, 'Output', '-1')
    await page.getByRole('button', { name: 'Save' }).click()

    await expect(page.getByText('Must be 0 or more')).toBeVisible()
    await expect(page.getByRole('dialog')).toBeVisible()
  })
})
