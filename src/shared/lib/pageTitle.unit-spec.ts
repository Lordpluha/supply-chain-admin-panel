import { describe, expect, it } from 'vitest'
import { APP_NAME, pageTitle } from './pageTitle'

describe('pageTitle', () => {
  it('names the screen and the product it belongs to', () => {
    expect(pageTitle('Countries')).toBe('Countries · Supply Chain')
  })

  it('always ends with the application name', () => {
    expect(pageTitle('Anything').endsWith(APP_NAME)).toBe(true)
  })
})
