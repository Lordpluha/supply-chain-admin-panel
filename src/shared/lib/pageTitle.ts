import { useEffect } from 'react'

export const APP_NAME = 'Supply Chain'

/**
 * Every route sets a document title through this, so the tab always says which
 * screen it is and which product it belongs to.
 */
export const pageTitle = (title: string): string => `${title} · ${APP_NAME}`

/**
 * Sets the tab title from a component rather than from a route's `head`.
 *
 * `notFoundComponent` and `errorComponent` have no `head` of their own, so
 * without this a 404 keeps the title of wherever the operator came from — a tab
 * reading "Facilities" above a page saying the screen does not exist.
 */
export const useDocumentTitle = (title: string): void => {
  useEffect(() => {
    document.title = pageTitle(title)
  }, [title])
}
