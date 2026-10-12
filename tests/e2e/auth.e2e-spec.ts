import { expect, test } from '@playwright/test'
import { signIn } from '../support/auth'

test.describe('authentication and access', () => {
  test('sends an anonymous visitor to the login screen, remembering where they were going', async ({
    page,
  }) => {
    await page.goto('/facilities')

    await expect(page).toHaveURL(/\/login\?redirect=%2Ffacilities/)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('signs in and lands on the supply map', async ({ page }) => {
    await signIn(page)

    await expect(page).toHaveURL(/\/$/)
    await expect(page.getByRole('heading', { name: 'Supply map' })).toBeVisible()
  })

  test('keeps the supply map navigation item active when filters change', async ({ page }) => {
    await signIn(page)

    const supplyMapLink = page.getByRole('navigation').getByRole('link', { name: 'Supply map' })
    await page.getByRole('combobox', { name: 'Country' }).click()
    await page.getByRole('option', { name: 'Germany' }).click()

    await expect(page).toHaveURL(/countryId=de/)
    await expect(supplyMapLink).toHaveAttribute('aria-current', 'page')
  })

  test('refuses the wrong password beside the form, not in a toast', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel(/^Password/).fill('wrong-password')
    await page.getByRole('button', { name: 'Sign in' }).click()

    await expect(page.getByRole('alert')).toContainText(/Invalid email or password/i)
    await expect(page).toHaveURL(/\/login/)
  })

  test('signs out again', async ({ page }) => {
    const errors: Array<string> = []
    page.on('pageerror', error => errors.push(error.message))

    await signIn(page)

    const logout = page.waitForResponse(response => response.url().includes('/auth/logout'))
    await page.getByRole('button', { name: 'Sign out' }).click()

    expect((await logout).status()).toBe(204)
    expect(errors).toEqual([])
    await expect(page).toHaveURL(/\/login/)
  })

  /** A path that matches nothing answers with the panel's own 404. */
  test('answers an unknown path with the 404 screen', async ({ page }) => {
    await signIn(page)
    await page.goto('/no-such-screen')

    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible()
    await expect(page.getByText('/no-such-screen')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Supply map' }).first()).toBeVisible()
  })
})
