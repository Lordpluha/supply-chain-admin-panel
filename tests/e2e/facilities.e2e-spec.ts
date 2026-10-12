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

test.describe('facilities CRUD', () => {
  test('creates, edits and deletes a facility', async ({ page }) => {
    const name = unique('Test Plant')
    const renamed = `${name} renamed`

    await open(page, '/facilities')

    await openCreateDialog(page)
    await fillField(page, 'Name', name)
    await choose(page, 'Country', 'Germany')
    await fillField(page, 'Latitude', '52.5')
    await fillField(page, 'Longitude', '13.4')
    await choose(page, 'Kind', 'Plant')
    await fillField(page, 'Capacity / year', '1000')
    await choose(page, 'Status', 'Planned')
    await save(page)

    await search(page, name)
    await expect(row(page, 'Germany')).toBeVisible()

    await editRow(page, name)
    await fillField(page, 'Name', renamed)
    await save(page)

    await search(page, renamed)
    await expect(row(page, renamed)).toBeVisible()

    await deleteRow(page, renamed)
    await expect(row(page, renamed)).toBeHidden()
  })

  /**
   * Named rows rather than a loop over whatever is on screen: an assertion that
   * every row mentions Germany passes just as happily when the filter returned
   * nothing at all.
   */
  test('narrows by country and kind together', async ({ page }) => {
    await open(page, '/facilities')

    await choose(page, 'Country', 'Germany')
    await expect(page).toHaveURL(/countryId=de/)
    await expect(row(page, 'Yichun Lithium Refinery')).toBeHidden()

    await choose(page, 'Kind', 'Plant')
    await expect(page).toHaveURL(/kind=plant/)

    await expect(row(page, 'Salzgitter Cathode Lab')).toBeVisible()
    // A gigafactory, so the kind filter excludes it while the country does not.
    await expect(row(page, 'Erfurt Cell Plant')).toBeHidden()
  })

  test('opens a facility’s own page, with what it makes on it', async ({ page }) => {
    await open(page, '/facilities')
    await search(page, 'Erfurt Cell Plant')

    await page.getByRole('link', { name: 'Open — Erfurt Cell Plant' }).click()

    await expect(page).toHaveURL(/\/facilities\/erfurt-cell-plant$/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Erfurt Cell Plant')
    await expect(page.locator('[data-slot="card-title"]', { hasText: 'Makes' })).toBeVisible()
    await expect(
      page.locator('[data-slot="card-title"]', { hasText: 'Production records' }),
    ).toBeVisible()
  })
})
