/** Shown wherever a flag or an icon cannot be resolved. */
export const UNKNOWN_GLYPH = '❓'

const A = 0x41
const REGIONAL_INDICATOR_A = 0x1f1e6

/**
 * The emoji flag for an ISO 3166-1 alpha-2 code.
 *
 * Built from regional indicator symbols rather than shipping an image set:
 * `DE` → `🇩🇪`. Returns `❓` for anything that is not two ASCII letters, so a
 * missing or malformed code shows as unknown instead of rendering two stray
 * letter blocks.
 *
 * Worth knowing: Windows has no flag glyphs in its emoji font and renders the
 * pair as the letters `DE` instead. That is the platform's choice, not a bug
 * here, and it still reads correctly.
 */
export const flagFor = (iso2: string | null | undefined): string => {
  if (!iso2 || iso2.length !== 2) return UNKNOWN_GLYPH

  const code = iso2.toUpperCase()
  if (!/^[A-Z]{2}$/.test(code)) return UNKNOWN_GLYPH

  return String.fromCodePoint(
    ...[...code].map(letter => REGIONAL_INDICATOR_A + (letter.charCodeAt(0) - A)),
  )
}
