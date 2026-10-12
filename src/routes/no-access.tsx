import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { NoAccessPage } from '@/pages/errors'
import { pageTitle } from '@/shared/lib/pageTitle'

const searchSchema = z.object({
  /** Named so the operator can quote it when asking for access. */
  permission: z.string().optional(),
})

export const Route = createFileRoute('/no-access')({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: pageTitle('No access') }] }),
  component: NoAccessPage,
})
