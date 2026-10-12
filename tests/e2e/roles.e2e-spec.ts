import { expect, test } from '@playwright/test'
import { open } from '../support/auth'
import {
  deleteRow,
  editRow,
  fillField,
  openCreateDialog,
  row,
  save,
  search,
  unique,
} from '../support/crud'

test.describe('roles CRUD', () => {
  test('creates a role with permissions, edits and deletes it', async ({ page }) => {
    const name = unique('TEST_ROLE')
    const renamed = `${name}_RENAMED`

    await open(page, '/roles')

    await openCreateDialog(page)
    await fillField(page, 'Role', name)
    await fillField(page, 'Description', 'Created by the e2e suite')

    // One checkbox per area and action, built from `PERMISSION_GROUPS`.
    await page.getByRole('checkbox', { name: 'Countries — Read' }).check()
    await page.getByRole('checkbox', { name: 'Products — Read' }).check()
    await save(page)

    await search(page, name)
    await expect(row(page, '2 permissions')).toBeVisible()

    await editRow(page, name)
    await fillField(page, 'Role', renamed)
    await page.getByRole('checkbox', { name: 'Facilities — Read' }).check()
    await save(page)

    await search(page, renamed)
    await expect(row(page, '3 permissions')).toBeVisible()

    await deleteRow(page, renamed)
    await expect(row(page, renamed)).toBeHidden()
  })

  /** A built-in role is the panel's own scaffolding and cannot be removed. */
  test('does not offer to delete a built-in role', async ({ page }) => {
    await open(page, '/roles')
    await search(page, 'ADMIN')

    await expect(page.getByRole('button', { name: 'Delete — ADMIN' })).toBeHidden()
  })

  /**
   * The IP column is behind `audit-ip:read`, and the grid gives that its own
   * row rather than a third column — see SECURITY.md.
   */
  test('offers the IP permission separately from the activity log', async ({ page }) => {
    await open(page, '/roles')
    await openCreateDialog(page)

    await expect(page.getByRole('checkbox', { name: 'Activity log — Read' })).toBeVisible()
    await expect(
      page.getByRole('checkbox', { name: 'Activity log — IP addresses — Read' }),
    ).toBeVisible()
  })
})
