import { HttpResponse, http } from 'msw'
import { env } from '@/shared/config/env'
import { authorize, latency } from '../lib'
import { readFilters } from './filters'
import { buildPoints } from './points'
import { buildSummary } from './summary'

export const analyticsHandlers = [
  http.get(`${env.apiBaseUrl}/analytics/production-points`, async ({ request, cookies }) => {
    await latency()
    const auth = authorize({ cookies }, 'dashboard:read')
    if ('response' in auth) return auth.response

    return HttpResponse.json(buildPoints(readFilters(new URL(request.url))))
  }),

  http.get(`${env.apiBaseUrl}/analytics/summary`, async ({ request, cookies }) => {
    await latency()
    const auth = authorize({ cookies }, 'dashboard:read')
    if ('response' in auth) return auth.response

    return HttpResponse.json(buildSummary(readFilters(new URL(request.url))))
  }),
]

export type { AnalyticsFilterSet } from './filters'
export { readFilters } from './filters'
