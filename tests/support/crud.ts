import { expect, type Page } from '@playwright/test'

/** Unique per run, so a rerun never collides with a row it left behind. */
export const unique = (prefix: string): string => `${prefix} ${Date.now().toString().slice(-6)}`

/**
 * Whatever is being worked on: the dialog when one is open, the page otherwise.
 *
 * A form field and the row behind it share a name — "Name" is both the column
 * and the input — so a bare `getByLabel` matches two things the moment a dialog
 * is up. Scoping is what keeps the specs strict rather than reaching for
 * `.first()` and hoping.
 */
const scope = async (page: Page) => {
  const dialog = page.getByRole('dialog')
  return (await dialog.count()) > 0 ? dialog : page
}

/**
 * The row carrying this text.
 *
 * Assertions land on the row rather than on a cell because a cell is not
 * unique: the row-actions cell is named after its own buttons — "Open —
 * Germany", "Edit — Germany" — so a country's name matches twice in its own
 * row before it matches anywhere else.
 */
export const row = (page: Page, text: string) => page.getByRole('row').filter({ hasText: text })

/** Narrows the table to one row, so an assertion cannot match a neighbour. */
export const search = async (page: Page, term: string): Promise<void> => {
  await page.getByLabel('Search').fill(term)
  await expect(row(page, term)).toBeVisible()
}

/**
 * Fills a field by its label, inside whatever is currently being worked on.
 *
 * Anchored, because the forms hold labels that are prefixes of each other —
 * "Unit" and "Unit price" — and a substring match fills the wrong one. The
 * optional trailing `*` is the required marker the label carries in its text.
 */
export const fillField = async (page: Page, label: string, value: string): Promise<void> => {
  const escaped = label.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`)

  await (await scope(page)).getByLabel(new RegExp(`^${escaped}\\s*\\*?$`)).fill(value)
}

export const openCreateDialog = async (page: Page): Promise<void> => {
  await page.getByRole('button', { name: 'Create' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
}

export const save = async (page: Page): Promise<void> => {
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByRole('dialog')).toBeHidden()
}

/** Opens the edit dialog for the row whose label is `name`. */
export const editRow = async (page: Page, name: string): Promise<void> => {
  await page.getByRole('button', { name: `Edit — ${name}` }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
}

/**
 * Deletes the row and confirms.
 *
 * The dialog names the row rather than saying "this item", which is what makes
 * the confirmation worth reading — so the assertion checks for it.
 */
export const deleteRow = async (page: Page, name: string): Promise<void> => {
  await page.getByRole('button', { name: `Delete — ${name}` }).click()

  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.getByText(name)).toBeVisible()

  await dialog.getByRole('button', { name: 'Delete' }).click()
  await expect(dialog).toBeHidden()
}

/**
 * Picks an option in one of the panel's comboboxes.
 *
 * Two kinds answer to `combobox` here. A plain select's trigger *is* the
 * combobox and opens on a click. A searchable one's combobox is the text input,
 * which takes the typing — its list opens from the chevron beside it. This
 * reaches for that chevron when there is one, so a spec does not have to know
 * which kind it is looking at.
 */
export const choose = async (page: Page, label: string, option: string): Promise<void> => {
  const control = (await scope(page)).getByRole('combobox', { name: label })
  const chevron = control.locator('xpath=ancestor::*[@data-slot="input-group"]').getByRole('button')

  await ((await chevron.count()) > 0 ? chevron.first() : control).click()
  await page.getByRole('option', { name: option, exact: false }).first().click()
}
