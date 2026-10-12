import type { LucideProps } from 'lucide-react'
import { createElement } from 'react'
import { iconForKind } from '../lib/facilityKind'
import type { FacilityKind } from '../model/facility.schema'

export interface FacilityKindIconProps extends LucideProps {
  kind: FacilityKind | string | null | undefined
}

/**
 * The glyph for a site's kind — a pickaxe for a mine, a factory for a refinery
 * — falling back to a question mark for a kind nobody has drawn yet.
 *
 * Built with `createElement` rather than `const Icon = iconForKind(kind)` in the
 * caller: a capitalised local rendered as JSX reads as a component *defined*
 * during render, which resets state on every pass and which the linter rejects.
 * Looking the component up here, once, keeps every call site a plain element.
 */
export const FacilityKindIcon = ({ kind, ...props }: FacilityKindIconProps) =>
  createElement(iconForKind(kind), props)
