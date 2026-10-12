---
name: styling
description: Tailwind v4 conventions — the three-theme token system, why no colour or size is ever hard-coded, the rem-only typography rule, cva for variants, cn for merging, and the map's own tokens. Use whenever writing JSX classes, adding a token, or touching src/app/styles.
globs:
  - "src/**/*.tsx"
  - "src/app/styles/**"
license: SEE LICENSE IN LICENSE
metadata:
  author: lordpluha
  version: "1.0.0"
---

# Styling

Tailwind v4, configured entirely in CSS. There is no `tailwind.config.js` and there must not be.

## Three themes, one token set

`light` (the default, on `:root`), `dark`, and `dim` (a lower-contrast slate variant). Each
redefines the **same** custom properties in `src/app/styles/theme.css`; `<html data-theme>`
selects one.

The `dark:` variant matches **both** `dark` and `dim` — `dim` is a dark theme with softer
contrast, not a third mode every component has to learn.

```css
@custom-variant dark (&:where([data-theme='dark'], [data-theme='dark'] *, [data-theme='dim'], [data-theme='dim'] *));
```

Adding a colour means adding it to **all three** blocks plus the `@theme inline` mapping.
A token defined in one theme and missing in another is a bug that only shows up on a
theme switch.

## Never hard-code a colour

```tsx
// ❌
<div className="bg-white text-zinc-900 dark:bg-zinc-950" />

// ✅
<div className="bg-card text-card-foreground" />
```

Semantic tokens only: `background`, `foreground`, `card`, `popover`, `primary`, `secondary`,
`muted`, `accent`, `destructive`, `success`, `warning`, `border`, `input`, `ring`, `sidebar*`,
`chart-1…5`, `map-*`. If none fits, add one — to all three themes.

The world map has its own tokens (`--map-ocean`, `--map-land`, `--map-land-stroke`,
`--map-graticule`) so an SVG follows the theme like everything else.

## Typography is `rem`, always

Never a `px` font size, and never an arbitrary value like `text-[18px]`. Every size resolves
to a `--typography-*` semantic token through a `typo-*` utility.

```tsx
// ❌
<h2 className="text-[1.875rem] font-bold">…</h2>

// ✅
<Typography level={2}>…</Typography>
// or, when the element is already right:
<span className="typo-label">…</span>
```

Changing the scale happens in `src/app/styles/typography.css` and nowhere else.

## Variants with `cva`

Class logic belongs in a `cva` definition next to the component, not in a ternary inside JSX.

```tsx
const badgeVariants = cva('inline-flex items-center rounded-md typo-caption', {
  variants: {
    tone: {
      neutral: 'bg-muted text-muted-foreground',
      success: 'bg-success/15 text-success',
    },
  },
  defaultVariants: { tone: 'neutral' },
})
```

## `cn()` — always from `@/shared/lib/cn`

First-party code imports `cn` from `@/shared/lib/cn`, never from the `cn` npm package.

Both resolve stock Tailwind conflicts correctly — `cn('p-2', 'p-4')` really is `'p-4'`. The
difference is **this project's own utilities**: `typo-h1` and `typo-body` both set a font size,
but an unconfigured merge sees two unrelated class names, keeps both, and lets CSS source order
decide. `shared/lib/cn.ts` registers the `typo-*` family as its own class group so the later
step wins.

`typo-*` is deliberately *not* registered under `font-size`/`font-weight`/`leading`/`tracking`
as well. A class belongs to exactly one group in tailwind-merge, and a `typo-*` utility writes
all four properties at once — spreading it across them makes `cn('typo-h2', 'leading-none')`
collapse to bare `leading-none` and silently drop the size. Keeping both is the safer failure,
and mixing them is forbidden here anyway: a component picks a step, it never writes a raw size
beside one.

The vendored components in `src/shared/ui/` keep importing from the `cn` package. They never
emit a `typo-*` class, so stock behaviour is correct for them, and leaving those imports alone
keeps `shadcn add` able to overwrite them cleanly.

Adding a step to `typography.css` means adding it to `TYPOGRAPHY_STEPS` in `shared/lib/cn.ts`
in the same commit. `cn.unit-spec.ts` pins the behaviour.

## Spacing and radius

Tailwind's scale and the `--radius-*` tokens. An arbitrary value (`p-[13px]`) needs a comment
saying why the scale did not fit.

## Responsive

Mobile-first. The panel must be usable at 360 px: the sidebar collapses to a sheet, tables
scroll horizontally inside their own container rather than widening the page, and the map keeps
its aspect ratio.
