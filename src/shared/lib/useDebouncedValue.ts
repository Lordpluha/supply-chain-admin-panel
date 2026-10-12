import { useEffect, useState } from 'react'

/** How long to wait before a keystroke becomes a request. */
export const SEARCH_DEBOUNCE_MS = 250

/**
 * Holds a value back until it stops changing.
 *
 * Used between a search box and the query that serves it: without it every
 * keystroke is a request, and the answers arrive out of order.
 */
export const useDebouncedValue = <T>(value: T, delay = SEARCH_DEBOUNCE_MS): T => {
  const [settled, setSettled] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setSettled(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return settled
}
