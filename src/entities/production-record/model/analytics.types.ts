/** One product's contribution within a country, for the map tooltip. */
export interface ProductionPointProduct {
  id: string
  name: string
  total: number
  unit: string
}

/** One dot on the world map: a country's aggregated output for the filters in force. */
export interface ProductionPoint {
  countryId: string
  countryName: string
  iso2: string
  isoNumeric: string
  region: string
  lat: number
  lng: number
  total: number
  unit: string
  facilityCount: number
  /** Share of the largest country's total, 0..1 — drives dot radius. */
  intensity: number
  /** Worth of `total` in the base currency; comparable across mixed units. */
  value: number
  /** This country's share of everything in scope, by value, 0..1. */
  share: number
  /** First and last year this country reported under the active filters. */
  firstYear: number
  lastYear: number
  /** What it makes, biggest first — at most the top few. */
  topProducts: Array<ProductionPointProduct>
}

export interface ProductionSeriesPoint {
  year: number
  total: number
}

export interface ProductionBreakdownItem {
  id: string
  label: string
  total: number
  unit: string
  share: number
  /** Indicative worth of `total`, in the base currency. */
  value: number
}

export interface ProductionSummary {
  total: number
  unit: string
  /**
   * Output valued at each product's `unitPrice`, summed, in the base currency.
   *
   * This is the one figure that stays meaningful when the units are mixed:
   * tonnes and cells do not add up, but euros do. The UI labels it indicative,
   * because both the prices and the FX rates behind it are mock data.
   */
  totalValue: number
  countryCount: number
  productCount: number
  facilityCount: number
  recordCount: number
  yearFrom: number
  yearTo: number
  peakYear: ProductionSeriesPoint | null
  /** Change between the first and last year in range, as a ratio (-1..∞). */
  growth: number | null
  series: Array<ProductionSeriesPoint>
  byProduct: Array<ProductionBreakdownItem>
  byCountry: Array<ProductionBreakdownItem>
}

export interface AnalyticsFilters {
  countryId?: string
  productId?: string
  facilityId?: string
  yearFrom?: number
  yearTo?: number
}
