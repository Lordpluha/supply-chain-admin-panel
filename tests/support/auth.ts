import { expect, type Page } from '@playwright/test'

/** The two things the panel can settle on: the shell, or the sign-in form. */
const panelNav = (page: Page) => page.getByRole('link', { name: 'Supply map' })
const signInButton = (page: Page) => page.getByRole('button', { name: 'Sign in' })

/**
 * Signs in and waits for the panel to be there.
 *
 * The login form arrives pre-filled with the seeded operator, so this presses
 * the button rather than typing credentials — typing them would test the
 * keyboard, which `LoginForm`'s own spec already does.
 *
 * Waiting for the sidebar rather than for the URL: the redirect lands before
 * the session query settles, and a spec that starts clicking in that gap sees
 * a shell with no navigation in it.
 */
export const signIn = async (page: Page): Promise<void> => {
  await page.goto('/login')
  await signInButton(page).click()

  await expect(panelNav(page)).toBeVisible()
}

/**
 * Goes to a screen in the panel, signing in first if the guard sends us away.
 *
 * Waiting on **what rendered**, not on the URL. The guard runs client-side
 * after the prerendered shell hydrates, so the address is still the one that
 * was asked for long after `goto` resolves — a spec that reads `page.url()`
 * there sees `/countries` and carries on, and only later finds itself looking
 * at the sign-in form. Both destinations have an `h1`, so that is no help
 * either; the sidebar is what tells them apart.
 */
/**
 * Moves to another screen **without reloading**.
 *
 * The mock API keeps its dataset in memory in the page, so a `goto` re-seeds
 * it: anything a spec created a moment ago on another screen is gone by the
 * time it looks for it. Clicking through the sidebar is both what an operator
 * does and the only way a spec can follow a change across screens.
 */
export const goToSection = async (page: Page, name: string): Promise<void> => {
  await page.getByRole('link', { name, exact: true }).click()
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
}

export const open = async (page: Page, path: string): Promise<void> => {
  await page.goto(path)

  await expect(panelNav(page).or(signInButton(page)).first()).toBeVisible()

  if (await signInButton(page).isVisible()) {
    // The guard carried the requested path, so signing in lands back on it.
    await signInButton(page).click()
    await expect(panelNav(page)).toBeVisible()
  }

  await expect(page).toHaveURL(new RegExp(`${path}(\\?|$)`))
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
}
