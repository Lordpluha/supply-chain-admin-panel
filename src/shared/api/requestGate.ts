/**
 * A promise every request waits on before it is sent.
 *
 * The mock API is a service worker: a request that leaves before it has
 * registered escapes to the network, where nothing is listening. Route
 * `beforeLoad` hooks fetch during router load, which happens outside the React
 * tree, so gating the render is not enough — the gate has to be on the
 * transport itself.
 *
 * Registered by the app layer, because `shared` may not import `app`. Defaults
 * to a resolved promise so a test or a story pays nothing for it.
 */
let gate: () => Promise<void> = () => Promise.resolve()

export const setRequestGate = (next: () => Promise<void>): void => {
  gate = next
}

export const awaitRequestGate = (): Promise<void> => gate()
