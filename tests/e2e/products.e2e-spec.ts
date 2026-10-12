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

test.describe('products CRUD', () => {
  test('creates, edits and deletes a product', async ({ page }) => {
    const name = unique('Test Cathode')
    const renamed = `${name} renamed`

    await open(page, '/products')

    await openCreateDialog(page)
    await fillField(page, 'Name', name)
    await fillField(page, 'SKU', 'TEST-CAT')
    await fillField(page, 'Unit', 't')
    await choose(page, 'Category', 'Cathode')
    await fillField(page, 'Unit price', '1000')
    await save(page)

    await search(page, name)
    await expect(row(page, 'TEST-CAT')).toBeVisible()

    await editRow(page, name)
    await fillField(page, 'Name', renamed)
    await save(page)

    await search(page, renamed)
    await expect(row(page, renamed)).toBeVisible()

    await deleteRow(page, renamed)
    await expect(row(page, renamed)).toBeHidden()
  })

  test('filters by category, and the filter survives a reload', async ({ page }) => {
    await open(page, '/products')

    await choose(page, 'Category', 'Cathode')

    await expect(page).toHaveURL(/category=Cathode/)
    await expect(row(page, 'NMC 811 Cathode')).toBeVisible()
    await expect(row(page, 'Lithium Carbonate')).toBeHidden()

    await page.reload()

    await expect(row(page, 'NMC 811 Cathode')).toBeVisible()
    await expect(row(page, 'Lithium Carbonate')).toBeHidden()
  })

  /**
   * Three states: ascending, descending, and back to the order the API gave.
   *
   * Asserted through `aria-sort` and the URL rather than by watching which row
   * comes first. Row order depends on the response landing, which makes the
   * assertion a race; the header's state and the address are the contract.
   */
  test('cycles a column through both directions and off again', async ({ page }) => {
    await open(page, '/products')

    const header = page.getByRole('columnheader', { name: /^Name/ })
    const button = page.getByRole('button', { name: /^Name/ })

    await expect(header).toHaveAttribute('aria-sort', 'none')
    await expect(button).toHaveAccessibleName('Name — Sort ascending')

    await button.click()
    await expect(header).toHaveAttribute('aria-sort', 'ascending')
    await expect(page).toHaveURL(/sortBy=name/)

    await button.click()
    await expect(header).toHaveAttribute('aria-sort', 'descending')
    await expect(page).toHaveURL(/sortDir=desc/)

    // The third press clears both keys, so the link is the unsorted view again.
    await button.click()
    await expect(header).toHaveAttribute('aria-sort', 'none')
    await expect(page).not.toHaveURL(/sortBy=/)
  })
})
