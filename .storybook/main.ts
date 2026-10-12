import path from 'node:path'
import type { StorybookConfig } from '@storybook/tanstack-react'

const ROUTER_COMPAT = path.join(import.meta.dirname, 'router-compat.ts')

const config: StorybookConfig = {
  stories: ['./**/*.mdx', '../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],

  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    // Exposes this Storybook over MCP at /mcp so an agent can read the kit
    // instead of guessing at it. Wired in .mcp.json.
    '@storybook/addon-mcp',
  ],

  framework: '@storybook/tanstack-react',

  /**
   * Storybook builds the app's own Vite config, which carries a plugin it has
   * no use for.
   *
   * The Start plugin assumes a server entry and a generated route tree, neither
   * of which exists here — Storybook renders components, not routes.
   */
  viteFinal: async viteConfig => {
    const DROPPED = ['tanstack-start', 'tanstack:devtools']

    // A plugin factory may return an array, so one level of flattening is
    // needed — a nested array has no `name` and would slip straight through
    // the filter. Depth 1 is deliberate: `Infinity` makes TypeScript try to
    // compute the fully-flattened plugin type and it gives up (TS2589).
    viteConfig.plugins = (viteConfig.plugins ?? []).flat().filter(plugin => {
      if (!plugin || typeof plugin !== 'object' || !('name' in plugin)) return true
      const name = String(plugin.name)
      return !DROPPED.some(dropped => name.includes(dropped))
    })

    // See router-compat.ts. The adapter is kept out of dependency pre-bundling,
    // which would otherwise inline its router import past this redirect.
    viteConfig.plugins.unshift({
      name: 'storybook-router-compat',
      enforce: 'pre',
      // The framework aliases the router to its own `export-mocks/react-router.js`,
      // so that path is what the adapter's decorator chunk actually imports.
      // Only that importer is redirected: the shim's own router import resolves
      // to the same file, and redirecting it too would be a cycle.
      resolveId(source, importer) {
        if (!source.endsWith('tanstack-react/dist/export-mocks/react-router.js')) return null
        if (!importer?.includes('tanstack-react/dist/_browser-chunks/')) return null
        return ROUTER_COMPAT
      },
    })

    return viteConfig
  },
}

export default config
