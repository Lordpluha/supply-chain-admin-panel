import path from 'node:path'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

// WebKit tests Safari's engine; mobile projects emulate a phone viewport.
// These are browser captures, not runs on physical iOS/Android devices.
const SCREENSHOT_VIEWPORTS = {
  desktop: { width: 1280, height: 800 },
  mobile: { width: 390, height: 844 },
} as const

const SCREENSHOT_BROWSERS = ['chromium', 'firefox', 'webkit'] as const

// Optional subset for local iteration; reject typos instead of skipping coverage.
const requestedBrowsers = [
  ...new Set(
    (process.env.SCREENSHOT_BROWSERS ?? SCREENSHOT_BROWSERS.join(','))
      .split(',')
      .map(name => name.trim()),
  ),
]

const selectedBrowsers = requestedBrowsers.map(name => {
  const browser = SCREENSHOT_BROWSERS.find(candidate => candidate === name)
  if (!browser)
    throw new Error(`Unknown SCREENSHOT_BROWSERS entry: "${name}". Use chromium, firefox, webkit.`)
  return browser
})

const SCREENSHOT_INSTANCES = selectedBrowsers.flatMap((browser, browserIndex) =>
  Object.entries(SCREENSHOT_VIEWPORTS).map(([size, viewport], sizeIndex) => ({
    sequence: { groupOrder: browserIndex * 2 + sizeIndex + 1 },
    browser,
    name: `${browser}-${size}`,
    viewport,
    provider: playwright({
      contextOptions: {
        viewport,
        locale: 'en-US',
        timezoneId: 'UTC',
        colorScheme: 'light' as const,
        reducedMotion: 'reduce' as const,
        deviceScaleFactor: 1,
        hasTouch: size === 'mobile',
        ...(browser !== 'firefox' ? { isMobile: size === 'mobile' } : {}),
      },
      launchOptions:
        browser === 'chromium'
          ? {
              args: [
                '--font-render-hinting=none',
                '--disable-font-subpixel-positioning',
                '--disable-lcd-text',
              ],
            }
          : {},
    }),
  })),
)

const config = defineConfig({
  // Sub-path the app is served from. `/` locally and in Docker; the GitHub
  // Pages workflow sets `/<repo>/`. Everything else (router, MSW worker URL)
  // reads it back through `import.meta.env.BASE_URL`.
  base: process.env.BASE_PATH ?? '/',
  resolve: {
    tsconfigPaths: true,
  },
  environments: {
    client: {
      build: {
        rolldownOptions: {
          output: {
            codeSplitting: {
              // Keep atlas data cached across application edits.
              // Do not pull dependencies of lazy features into an eager vendor chunk.
              includeDependenciesRecursively: false,
              groups: [{ name: 'world-atlas', test: /node_modules\/world-atlas\// }],
            },
          },
        },
      },
    },
  },
  plugins: [
    tailwindcss(),
    // Start is kept purely for its Router integration: SPA mode turns off SSR
    // entirely and prerenders a single static shell that hydrates on the client.
    tanstackStart({
      spa: {
        enabled: true,
      },
    }),
    viteReact(),
  ],
  test: {
    projects: [
      /**
       * Four layers, four projects, so each can be run — and re-run — on its
       * own. A snapshot update must not re-execute the integration suite, and
       * a failing interaction must not be buried under a diff of markup.
       */
      {
        // One module in isolation: a schema, a store, a pure helper, a single
        // component's own rendering.
        extends: true,
        test: {
          name: 'unit',
          environment: 'jsdom',
          globals: true,
          include: ['src/**/*.unit-spec.{ts,tsx}'],
          setupFiles: ['./src/shared/config/vitest.setup.ts'],
        },
      },
      {
        // Several units composed: a form that submits, a table that sorts, a
        // route that throws and lands on its error screen.
        extends: true,
        test: {
          name: 'integration',
          environment: 'jsdom',
          globals: true,
          include: ['src/**/*.int-spec.{ts,tsx}'],
          // The mock API runs in Node for this project, so a feature spec talks
          // to the same handlers the browser worker serves.
          setupFiles: ['./src/shared/config/vitest.setup.ts', './tests/setup/msw-server.ts'],
        },
      },
      {
        // Markup, pinned. Catches the class that silently disappears in a
        // refactor — the thing neither an assertion nor a screenshot notices.
        extends: true,
        test: {
          name: 'snapshot',
          environment: 'jsdom',
          globals: true,
          include: ['src/**/*.snapshot-spec.{ts,tsx}'],
          setupFiles: ['./src/shared/config/vitest.setup.ts'],
        },
      },
      {
        // Rendered pixels in all six browser/viewport combinations.
        extends: true,
        test: {
          name: 'screenshot',
          setupFiles: ['./tests/setup/screenshot.ts'],
          globals: true,
          // One worker bounds memory use while files retain test isolation.
          fileParallelism: true,
          maxWorkers: 1,
          testTimeout: 60_000,
          include: ['src/**/*.screenshot-spec.{ts,tsx}'],
          browser: {
            enabled: true,
            headless: true,
            // Allow reference writes only through the loopback-bound runner.
            api: { host: '127.0.0.1', allowWrite: true },
            expect: {
              toMatchScreenshot: {
                resolveScreenshotPath: ({ root, testFileDirectory, arg, project, platform, ext }) =>
                  path.join(
                    root,
                    testFileDirectory,
                    '__screenshots__',
                    `${arg}-${project.name}-${platform}${ext}`,
                  ),
              },
            },
            screenshotFailures: false,
            instances: SCREENSHOT_INSTANCES,
          },
        },
      },
      {
        extends: true,
        plugins: [
          // Every story is also a test: rendered in a real Chromium, with the
          // a11y addon asserting against it. See .storybook/main.ts.
          storybookTest({
            configDir: path.join(import.meta.dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            // Allow reference writes only through the loopback-bound runner.
            api: { host: '127.0.0.1', allowWrite: true },
            provider: playwright({}),
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
        },
      },
    ],
  },
})
export default config
