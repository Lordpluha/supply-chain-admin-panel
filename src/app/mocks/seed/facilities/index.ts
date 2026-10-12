import { ASSEMBLY_FACILITIES } from './assembly'
import { COMPONENT_FACILITIES } from './components'
import { RAW_MATERIAL_FACILITIES } from './rawMaterials'
import type { FacilitySeed } from './types'

export type { FacilitySeed } from './types'

/** Ordered upstream to downstream, the way the chain actually runs. */
export const FACILITY_SEED: ReadonlyArray<FacilitySeed> = [
  ...RAW_MATERIAL_FACILITIES,
  ...COMPONENT_FACILITIES,
  ...ASSEMBLY_FACILITIES,
]
