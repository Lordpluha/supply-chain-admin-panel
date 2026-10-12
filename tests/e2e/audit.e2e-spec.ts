import { expect, test } from '@playwright/test'
import { goToSection, open } from '../support/auth'
import { fillField, search } from '../support/crud'

/**
 * Read-only by construction. There is no create, edit or delete here — and no
 * endpoint behind one either — so the round trip this spec walks is a
 * *mutation elsewhere* appearing in the trail.
 */
test.describe('activity log', () => {
  test('offers no way to change the trail', async ({ page }) => {
    await open(page, '/audit')

    await expect(page.getByRole('button', { name: 'Create' })).toBeHidden()
    await expect(page.getByRole('button', { name: /^Edit — / })).toBeHidden()
    await expect(page.getByRole('button', { name: /^Delete — / })).toBeHidden()
  })

  test('records a change made on another screen', async ({ page }) => {
    const name = `Audited ${Date.now().toString().slice(-6)}`

    await open(page, '/products')
    await page.getByRole('button', { name: 'Create' }).click()
    await fillField(page, 'Name', name)
    await fillField(page, 'SKU', 'AUD-TEST')
    await fillField(page, 'Unit', 't')
    await page.getByRole('combobox', { name: 'Category' }).click()
    await page.getByRole('option', { name: 'Cathode' }).first().click()
    await fillField(page, 'Unit price', '100')
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.getByRole('dialog')).toBeHidden()

    // Navigated, not reloaded: a reload re-seeds the mock dataset and the
    // entry this spec just caused would be gone.
    await goToSection(page, 'Activity log')
    await search(page, name)

    const row = page.getByRole('row').filter({ hasText: name }).first()
    await expect(row).toContainText('Created')
    await expect(row).toContainText('Product')
    await expect(row).toContainText('Ada Marchetti')
  })

  /** ADMIN holds `audit-ip:read`, so the column is there for this operator. */
  test('shows the IP column to an operator who may read it', async ({ page }) => {
    await open(page, '/audit')

    await expect(page.getByRole('columnheader', { name: 'IP address' })).toBeVisible()
  })

  /**
   * Named rows rather than a loop over whatever is on screen: "every row says
   * Signed in" passes just as happily when the filter returned nothing.
   */
  test('narrows by action', async ({ page }) => {
    await open(page, '/audit')

    await expect(page.getByRole('row').filter({ hasText: 'Signed in' }).first()).toBeVisible()

    await page.getByRole('combobox', { name: 'Action' }).click()
    await page.getByRole('option', { name: 'Created' }).first().click()

    await expect(page).toHaveURL(/action=create/)
    await expect(page.getByRole('row').filter({ hasText: 'Signed in' })).toBeHidden()
  })

  test('narrows by date, and the range cannot be inverted', async ({ page }) => {
    await open(page, '/audit')

    const today = new Date().toISOString().slice(0, 10)

    // By id: "From" and "To" are common enough words to match half the table
    // through their labels.
    await page.locator('#audit-date-from').fill(today)
    await expect(page).toHaveURL(new RegExp(`dateFrom=${today}`))

    // The upper end cannot be set below the lower one.
    await expect(page.locator('#audit-date-to')).toHaveAttribute('min', today)
  })
})
