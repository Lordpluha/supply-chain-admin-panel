import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * `clsx` for conditionals, `tailwind-merge` for conflict resolution.
 *
 * The `cn` npm package shadcn vendors alongside its components already does
 * both, and does them correctly for stock Tailwind — `cn('p-2', 'p-4')` really
 * is `'p-4'`. What it cannot know about is **this project's custom utilities**:
 * `typo-label` and `text-lg` both set `font-size`, but to an unconfigured merge
 * they are unrelated classes, so both survive and CSS source order silently
 * decides the winner. That is precisely the "the style did not apply" bug class,
 * relocated from stock classes to ours.
 *
 * `extendTailwindMerge` closes it by declaring the `typo-*` family as members of
 * the groups they actually write to. The vendored components under
 * `src/shared/ui/` keep importing from the `cn` package — they never emit a
 * `typo-*` class, so the stock behaviour is correct for them, and leaving their
 * imports untouched keeps `shadcn add` able to overwrite them cleanly.
 *
 * Everything first-party imports this one.
 */

/** Must stay in step with the `@utility typo-*` block in app/styles/typography.css. */
const TYPOGRAPHY_STEPS = [
  'display',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'body-lg',
  'body',
  'body-sm',
  'label',
  'caption',
  'overline',
  'button',
  'code',
] as const

// The `'typo'` type argument registers a class-group id tailwind-merge does not
// ship with; without it the config below is rejected as an unknown group.
const twMerge = extendTailwindMerge<'typo'>({
  extend: {
    classGroups: {
      // `typo-*` gets one group of its own, so two steps can never both survive:
      // `cn('typo-h1', 'typo-body')` is `'typo-body'`. That collision — a variant
      // step and an override step landing together — is the accident that
      // actually happens.
      //
      // It is deliberately NOT registered under font-size/weight/leading/tracking
      // as well. A class belongs to exactly one group in tailwind-merge, and a
      // `typo-*` utility writes all four properties at once; spreading it across
      // those groups makes `cn('typo-h2', 'leading-none')` resolve to bare
      // `leading-none` and silently drop the font size. Keeping both classes is
      // the safer failure, and `styling.md` forbids the mix outright: a component
      // picks a step, it never writes a raw size beside one.
      typo: [{ typo: [...TYPOGRAPHY_STEPS] }],
    },
  },
})

export const cn = (...inputs: Array<ClassValue>): string => twMerge(clsx(inputs))
