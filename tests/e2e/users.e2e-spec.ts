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

test.describe('users CRUD', () => {
  test('creates, edits and deletes a user', async ({ page }) => {
    const name = unique('Test Operator')
    const renamed = `${name} renamed`

    await open(page, '/users')

    await openCreateDialog(page)
    await fillField(page, 'Name', name)
    await fillField(page, 'Email', `test-${Date.now()}@example.com`)
    await choose(page, 'Role', 'VIEWER')
    await choose(page, 'Status', 'Active')
    await save(page)

    await search(page, name)
    await expect(row(page, 'VIEWER')).toBeVisible()

    await editRow(page, name)
    await fillField(page, 'Name', renamed)
    await save(page)

    await search(page, renamed)
    await expect(row(page, renamed)).toBeVisible()

    await deleteRow(page, renamed)
    await expect(row(page, renamed)).toBeHidden()
  })

  test('refuses a malformed address', async ({ page }) => {
    await open(page, '/users')
    await openCreateDialog(page)

    await fillField(page, 'Name', 'Someone')
    await fillField(page, 'Email', 'not-an-address')
    await page.getByRole('button', { name: 'Save' }).click()

    // The dialog stays open and the field is marked, which is the refusal —
    // the message is the explanation beside it.
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByRole('dialog').getByLabel(/^Email/)).toHaveAttribute(
      'aria-invalid',
      'true',
    )
    await expect(page.getByRole('dialog').getByText(/valid email/i)).toBeVisible()
  })

  test('opens a user’s own page, with their activity on it', async ({ page }) => {
    await open(page, '/users')
    await search(page, 'Ada Marchetti')

    await page.getByRole('link', { name: 'Open — Ada Marchetti' }).click()

    await expect(page).toHaveURL(/\/users\/u-admin$/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Ada Marchetti')
    await expect(
      page.locator('[data-slot="card-title"]', { hasText: 'Recent activity' }),
    ).toBeVisible()
  })
})
