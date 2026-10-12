/** The supply map and its summary. */
export const dashboard = {
  dashboard: {
    title: 'Supply map',
    description: 'Production by country and product, {{from}}–{{to}}.',
    modeHint: 'Country and product narrow each other; choosing a country also reveals facilities.',
    country: 'Country',
    product: 'Product',
    anyCountry: 'Any country',
    anyProduct: 'Any product',
    yearRangeHint: 'Both ends move. Drag a handle, or focus it and use the arrow keys.',
    facility: 'Facility',
    anyFacility: 'Any facility',
    yearRange: 'Years',
    clearFilters: 'Clear filters',
    filters: 'Filters',
    expandMap: 'Expand map',
    closeMap: 'Close map',
    showResults_one: 'Show {{count}} country',
    showResults_few: 'Show {{count}} countries',
    showResults_many: 'Show {{count}} countries',
    showResults_other: 'Show {{count}} countries',
    mapTitle: 'Production sites',
    mapEmpty: 'No production matches these filters.',
    shareOfTotal: 'of total',
    clickToFilter: 'Select to filter the summary by this country.',
    clickToClear: 'Select again to clear the filter.',
    mapZoomHint:
      'Zoomed to the selection. Green dots are its production sites — select the country again to zoom out.',
    mapHint: 'Select a dot to filter the summary by that country.',
    summaryInfo:
      'Everything below reflects the filters above — country, product and the year range.',
    growthInfo:
      'Measured between the first and last years that actually reported, not the filter bounds.',
    trendInfo:
      'Total output per year across everything in scope. The figures are also read out for screen readers.',
    byProductInfo:
      'Ranked by value, not by quantity, so products measured in different units can be compared.',
    byCountryInfo:
      'The same figures the map shows, in text — the map is never the only way to read them.',
    summaryTitle: 'Summary',
    trendTitle: 'Production over time',
    totalOutput: 'Total output',
    estimatedValue: 'Estimated value',
    valueHint: 'Indicative — mock prices, converted at a fixed rate.',
    mixedUnits: 'Mixed units — see the per-product breakdown',
    countries: 'Countries',
    products: 'Products',
    facilities: 'Facilities',
    records: 'Records',
    peakYear: 'Peak year',
    growth: 'Change over range',
    byProduct: 'By product',
    byCountry: 'By country',
    // Polish needs `few`/`many`; English fills them with its plural so every
    // locale can be typed against this file.
    facilityCount_one: '{{count}} facility',
    facilityCount_few: '{{count}} facilities',
    facilityCount_many: '{{count}} facilities',
    facilityCount_other: '{{count}} facilities',
  },
}
