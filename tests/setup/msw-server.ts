import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { handlers } from '../../src/app/mocks/handlers'

/**
 * The mock API, served in Node for the integration project.
 *
 * Integration specs drive real features — a login that posts credentials, a
 * filter bar that narrows one list against another — and those are only worth
 * testing against the API they actually talk to. The same handlers the browser
 * worker registers run here, so a spec cannot pass against a fiction the app
 * would never see.
 *
 * It lives outside `src/` deliberately: the handlers are app-layer, and a file
 * under `src/shared` or `src/features` importing them would invert the layer
 * order that `pnpm lint` enforces. Test infrastructure is not part of the cake.
 */
export const server = setupServer(...handlers)

beforeAll(() => {
  // `error` rather than `bypass`: a request no handler covers is a spec talking
  // to something that does not exist, and it should say so rather than hang.
  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})
