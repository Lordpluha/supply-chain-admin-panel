/**
 * Lets `shared/api` tell the app a session has expired without importing the
 * session store from `entities/`, which the layer order forbids. The app layer
 * registers the real handler on boot.
 */
let handler: () => void = () => {}

export const setUnauthorizedHandler = (next: () => void): void => {
  handler = next
}

export const notifyUnauthorized = (): void => {
  handler()
}
