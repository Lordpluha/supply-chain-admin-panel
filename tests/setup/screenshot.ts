import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, expect } from 'vitest'
import { cdp, server } from 'vitest/browser'
// oxlint-disable-next-line import/no-unassigned-import -- Load the real application styles.
import '../../src/app/styles/index.css'

// Fail before recording misleading baselines if the runner ignores emulation.
beforeEach(async () => {
  // Chromium screenshot/iframe cleanup can clear touch emulation between files.
  // Restore it before each capture, then verify what the browser exposes.
  if (server.browser === 'chromium') {
    await cdp().send('Emulation.setTouchEmulationEnabled', {
      enabled: server.config.name?.endsWith('-mobile') ?? false,
      maxTouchPoints: 1,
    })
  }
  expect(window.innerWidth).toBe(server.config.browser.viewport.width)
  expect(window.innerHeight).toBe(server.config.browser.viewport.height)
  expect(window.devicePixelRatio).toBe(1)
  expect(navigator.language).toBe('en-US')
  // Firefox exposes touch emulation through pointer media queries, not maxTouchPoints.
  expect(window.matchMedia('(pointer: coarse)').matches).toBe(
    server.config.name?.endsWith('-mobile') ?? false,
  )

  document.documentElement.dataset.theme = 'light'
  document.documentElement.lang = 'en'
  await Promise.all([
    document.fonts.load('400 16px "Roboto Variable"'),
    document.fonts.load('600 24px "Raleway Variable"'),
  ])
  await document.fonts.ready
})

afterEach(cleanup)
