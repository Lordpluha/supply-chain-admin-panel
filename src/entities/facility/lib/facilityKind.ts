import type { LucideIcon } from 'lucide-react'
import { CircleHelp, Droplets, Factory, Package, Pickaxe, Zap } from 'lucide-react'
import type { FacilityKind } from '../model/facility.schema'

/**
 * One icon per kind of site, so a zoomed map reads as a supply chain rather
 * than a field of identical dots.
 *
 * `CircleHelp` is the fallback and it is deliberate: a kind added to the union
 * and forgotten here shows a question mark, which someone will notice, rather
 * than silently borrowing another kind's icon.
 */
const ICONS: Record<FacilityKind, LucideIcon> = {
  mine: Pickaxe,
  brine: Droplets,
  refinery: Factory,
  plant: Factory,
  gigafactory: Zap,
  assembly: Package,
}

export const UNKNOWN_KIND_ICON = CircleHelp

export const iconForKind = (kind: FacilityKind | string | null | undefined): LucideIcon =>
  (kind ? ICONS[kind as FacilityKind] : undefined) ?? UNKNOWN_KIND_ICON
