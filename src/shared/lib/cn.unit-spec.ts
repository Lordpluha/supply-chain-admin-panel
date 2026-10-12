import { describe, expect, it } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('keeps the last of two conflicting stock utilities', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
    expect(cn('bg-primary', 'bg-destructive')).toBe('bg-destructive')
    expect(cn('text-sm font-medium', 'text-lg')).toBe('font-medium text-lg')
  })

  it('lets a caller override a component default', () => {
    // The reason this file exists: a variant's `px-3` must lose to the
    // `px-6` a consumer passes, not sit beside it and depend on CSS order.
    expect(cn('px-3 py-1', 'px-6')).toBe('py-1 px-6')
  })

  it('resolves two typography steps to the later one', () => {
    // Stock tailwind-merge knows nothing about `typo-*` and would keep both.
    expect(cn('typo-h1', 'typo-body')).toBe('typo-body')
    expect(cn('typo-label', 'typo-caption')).toBe('typo-caption')
  })

  it('leaves a typography step beside a single-property utility', () => {
    // A `typo-*` utility writes four properties at once, so it is registered as
    // its own group. Dropping it because `leading-none` appeared would silently
    // lose the font size — keeping both is the safer failure, and styling.md
    // forbids the mix anyway.
    expect(cn('typo-body', 'font-bold')).toBe('typo-body font-bold')
    expect(cn('typo-h2', 'leading-none')).toBe('typo-h2 leading-none')
  })

  it('handles the conditional forms clsx supports', () => {
    const disabled = false
    expect(cn('base', disabled && 'off', undefined, null, 'on')).toBe('base on')
    expect(cn(['a', 'b'], { c: true, d: false })).toBe('a b c')
  })
})
