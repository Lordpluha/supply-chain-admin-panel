import type { ProductCategory } from '@/entities/product'

export interface ProductSeed {
  sku: string
  name: string
  category: ProductCategory
  unit: string
  /**
   * Indicative EUR per `unit`. Mock figures, frozen so the dataset stays
   * deterministic. Real sourcing prices move weekly and would carry the date
   * they were quoted on.
   */
  unitPrice: number
}

export const PRODUCT_SEED: ReadonlyArray<ProductSeed> = [
  {
    sku: 'LI-CARB',
    name: 'Lithium Carbonate',
    category: 'Raw material',
    unit: 't',
    unitPrice: 12_400,
  },
  {
    sku: 'CO-SULF',
    name: 'Cobalt Sulfate',
    category: 'Raw material',
    unit: 't',
    unitPrice: 5_600,
  },
  {
    sku: 'NI-SULF',
    name: 'Nickel Sulfate',
    category: 'Raw material',
    unit: 't',
    unitPrice: 3_850,
  },
  {
    sku: 'GR-ANODE',
    name: 'Graphite Anode Material',
    category: 'Anode',
    unit: 't',
    unitPrice: 6_500,
  },
  {
    sku: 'NMC-811',
    name: 'NMC 811 Cathode',
    category: 'Cathode',
    unit: 't',
    unitPrice: 28_200,
  },
  {
    sku: 'LFP-CAT',
    name: 'LFP Cathode',
    category: 'Cathode',
    unit: 't',
    unitPrice: 9_400,
  },
  {
    sku: 'SEP-FILM',
    name: 'Separator Film',
    category: 'Component',
    unit: 'km²',
    // ~0.78 EUR/m², so a square kilometre is a large number by construction.
    unitPrice: 780_000,
  },
  {
    sku: 'ELYTE-LP',
    name: 'Electrolyte LiPF6',
    category: 'Electrolyte',
    unit: 't',
    unitPrice: 7_150,
  },
  {
    sku: 'CELL-21700',
    name: 'Cylindrical Cell 21700',
    category: 'Cell',
    unit: 'M cells',
    // ~4.10 EUR per cell, priced per million to match the production unit.
    unitPrice: 4_100_000,
  },
  {
    sku: 'PACK-EV',
    name: 'EV Battery Pack',
    category: 'Pack',
    unit: 'packs',
    unitPrice: 7_800,
  },
]
