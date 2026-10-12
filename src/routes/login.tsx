import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { redirectIfSignedIn } from '@/app/router/guards'
import { LoginPage } from '@/pages/login'
import { pageTitle } from '@/shared/lib/pageTitle'

const searchSchema = z.object({
  /** Where the guard interrupted, so sign-in lands where they meant to go. */
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/login')({
  validateSearch: searchSchema,
  beforeLoad: redirectIfSignedIn,
  head: () => ({ meta: [{ title: pageTitle('Sign in') }] }),
  component: LoginPage,
})
