import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { Button } from '../button'
import { ErrorPage } from './error-page'

const meta = {
  title: 'Feedback/ErrorPage',
  component: ErrorPage,
  parameters: {
    docs: {
      description: {
        component:
          'The block every full-screen failure is built from, so a 404 and a crash are recognisably the same family rather than two people’s idea of a sad face. It sets no height of its own — dropped into the panel’s content area it fills what is there, and `FullPageError` wraps it for the screens that stand alone.\n\nEvery one of them offers a way out. A dead end is not an error page.',
      },
    },
  },
  args: {
    code: '404',
    title: 'Page not found',
    description: 'The page you asked for does not exist.',
  },
} satisfies Meta<typeof ErrorPage>

export default meta
type Story = StoryObj<typeof meta>

/** No route matched. The path that missed is shown, because the usual cause is
 *  a stale link someone was sent — and being able to quote it is the difference
 *  between "it's broken" and a fixable report. */
export const NotFound: Story = {
  args: {
    detail: '/facilities/salzgitter-cathode-lab',
    actions: <Button variant="outline">Supply map</Button>,
  },
}

/** Signed in, page exists, permission missing. Naming the permission is what
 *  lets the operator ask for the right thing. */
export const NoAccess: Story = {
  args: {
    code: '403',
    title: 'No access',
    description: 'Your role does not include permission to view this page.',
    detail: 'audit-ip:read',
    actions: <Button variant="outline">Supply map</Button>,
  },
}

/** A route threw. "Try again" resets the boundary and invalidates the router,
 *  so a request that has since recovered actually re-runs. */
export const Crashed: Story = {
  args: {
    code: '500',
    title: 'Something went wrong',
    description:
      'The screen could not be rendered. Trying again often clears it; if it does not, the details below are what a bug report needs.',
    detail: "Cannot read properties of undefined (reading 'items')",
    actions: (
      <>
        <Button>Try again</Button>
        <Button variant="outline">Reload the page</Button>
      </>
    ),
  },
}

/** The app could not start — i18n or the mock service worker failed. This is
 *  the one screen whose copy is not translated, because `initI18n()` is one of
 *  the two things that may have failed. */
export const StartupFailure: Story = {
  args: {
    code: 'offline',
    title: 'The panel could not start',
    description:
      'Its mock API runs in a service worker, which needs a secure context — localhost or HTTPS. Reloading often clears a failed registration.',
    actions: <Button>Reload the page</Button>,
  },
}

/** No detail and no actions is still a readable screen, though every real use
 *  gives at least one way out. */
export const Bare: Story = { args: { detail: undefined, actions: undefined } }
