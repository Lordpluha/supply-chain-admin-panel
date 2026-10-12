import type { FetchOptions } from 'ofetch'
import { ofetch } from 'ofetch'
import { env } from '@/shared/config/env'
import { awaitRequestGate } from './requestGate'
import type { ApiErrorBody } from './types'
import { notifyUnauthorized } from './unauthorized'

/**
 * The single abstraction every service depends on. Services are written
 * against this type rather than against `ofetch`, so a service can be unit
 * tested by passing a plain function and the transport can be swapped without
 * touching a single service.
 */
export type HttpClient = <T>(url: string, options?: FetchOptions<'json'>) => Promise<T>

export interface HttpClientConfig {
  baseURL: string
  onUnauthorized?: () => void
}

export class ApiError extends Error {
  readonly status: number
  readonly body: ApiErrorBody | undefined

  constructor(status: number, message: string, body?: ApiErrorBody) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

export const createHttpClient = (config: HttpClientConfig): HttpClient => {
  const instance = ofetch.create({
    baseURL: config.baseURL,
    retry: 1,
    retryStatusCodes: [408, 429, 500, 502, 503, 504],
    timeout: 15_000,
    /**
     * The session rides on a cookie the API issued, which the browser attaches
     * by itself. No token is ever held in JavaScript, so there is nothing for
     * an XSS payload to read out of `localStorage` — see SECURITY.md.
     */
    credentials: 'same-origin',
    onResponseError({ response }) {
      if (response.status === 401) config.onUnauthorized?.()
    },
  })

  return async <T>(url: string, options?: FetchOptions<'json'>): Promise<T> => {
    // Nothing leaves until the app says it is ready — see `requestGate`.
    await awaitRequestGate()

    try {
      return await instance<T>(url, options)
    } catch (error) {
      const failure = error as { status?: number; data?: ApiErrorBody; message: string }
      throw new ApiError(
        failure.status ?? 0,
        failure.data?.message ?? failure.message,
        failure.data,
      )
    }
  }
}

/** The client the application runs on. */
export const httpClient: HttpClient = createHttpClient({
  baseURL: env.apiBaseUrl,
  onUnauthorized: notifyUnauthorized,
})
