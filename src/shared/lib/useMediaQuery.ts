import { useSyncExternalStore } from 'react'

/**
 * Subscribes to a media query.
 *
 * `useSyncExternalStore` rather than `useEffect` + `useState`: the server
 * snapshot is explicit (`false`, because there is no viewport to measure), so
 * the first client render agrees with the markup instead of flashing the
 * desktop layout on a phone.
 */
export const useMediaQuery = (query: string): boolean =>
  useSyncExternalStore(
    onChange => {
      const list = globalThis.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    () => globalThis.matchMedia(query).matches,
    () => false,
  )

/** Tailwind's `md` breakpoint, which is where this panel's layout changes. */
export const useIsMobile = (): boolean => useMediaQuery('(max-width: 767px)')
