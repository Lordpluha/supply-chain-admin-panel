/**
 * `@storybook/tanstack-react` 10.6 still calls `interpolatePath({ path, params })`.
 * router-core 1.171 changed it to positional arguments over pre-parsed segments,
 * so every story threw `path.endsWith is not a function` before rendering.
 *
 * `main.ts` redirects only the adapter's own import of the router here; the app
 * and the router itself keep the real function. Delete this file and that
 * redirect once the adapter ships a release built against the new signature.
 */
import { interpolatePath as routerInterpolatePath } from '@tanstack/react-router'

export * from '@tanstack/react-router'

interface LegacyInterpolateOptions {
  path?: string
  params?: Record<string, unknown>
}

// `$id`, `{$id}`, `{-$id}` (optional) and a bare `$` splat — the forms a route path can hold.
const PARAM = /\{-?\$([A-Za-z0-9_]*)\}|\$([A-Za-z0-9_]*)/g

const interpolateLegacy = ({ path = '/', params = {} }: LegacyInterpolateOptions) => {
  const interpolatedPath = path.replace(PARAM, (_match, braced?: string, bare?: string) => {
    const key = (braced ?? bare) || '_splat'
    const value = params[key] ?? (key === '_splat' ? params['*'] : undefined)
    return value == null ? '' : encodeURIComponent(String(value))
  })

  return { interpolatedPath: interpolatedPath.replaceAll(/\/{2,}/g, '/') || '/' }
}

export const interpolatePath = (...args: Parameters<typeof routerInterpolatePath>) => {
  const [first] = args
  if (typeof first === 'object' && first !== null) {
    return interpolateLegacy(first as LegacyInterpolateOptions)
  }
  return routerInterpolatePath(...args)
}
