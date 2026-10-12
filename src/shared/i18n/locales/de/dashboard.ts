import type { Translation } from '../en'

/** The supply map and its summary. */
export const dashboard: Pick<Translation, 'dashboard'> = {
  dashboard: {
    title: 'Lieferkarte',
    description: 'Produktion nach Land und Produkt, {{from}}–{{to}}.',
    modeHint:
      'Land und Produkt grenzen sich gegenseitig ein; die Länderauswahl zeigt auch Standorte.',
    country: 'Land',
    product: 'Produkt',
    anyCountry: 'Alle Länder',
    anyProduct: 'Alle Produkte',
    yearRangeHint:
      'Beide Enden sind beweglich. Griff ziehen oder fokussieren und die Pfeiltasten nutzen.',
    facility: 'Standort',
    anyFacility: 'Alle Standorte',
    yearRange: 'Jahre',
    clearFilters: 'Filter zurücksetzen',
    filters: 'Filter',
    expandMap: 'Karte vergrößern',
    closeMap: 'Karte schließen',
    showResults_one: '{{count}} Land anzeigen',
    showResults_few: '{{count}} Länder anzeigen',
    showResults_many: '{{count}} Länder anzeigen',
    showResults_other: '{{count}} Länder anzeigen',
    mapTitle: 'Produktionsstandorte',
    mapEmpty: 'Keine Produktion passt zu diesen Filtern.',
    shareOfTotal: 'vom Gesamtwert',
    clickToFilter: 'Auswählen, um die Übersicht auf dieses Land zu filtern.',
    clickToClear: 'Erneut auswählen, um den Filter zu entfernen.',
    mapZoomHint:
      'Auf die Auswahl gezoomt. Grüne Punkte sind ihre Produktionsstandorte — Land erneut auswählen, um herauszuzoomen.',
    mapHint: 'Einen Punkt auswählen, um die Übersicht auf dieses Land zu filtern.',
    summaryInfo: 'Alles hier unten folgt den Filtern oben — Land, Produkt und Zeitraum.',
    growthInfo:
      'Gemessen zwischen dem ersten und letzten Jahr mit Meldungen, nicht den Filtergrenzen.',
    trendInfo:
      'Gesamtausbringung je Jahr über den gesamten Umfang. Die Zahlen werden auch für Screenreader ausgegeben.',
    byProductInfo:
      'Nach Wert sortiert, nicht nach Menge, damit Produkte mit unterschiedlichen Einheiten vergleichbar sind.',
    byCountryInfo:
      'Dieselben Zahlen wie auf der Karte, als Text — die Karte ist nie der einzige Zugang dazu.',
    summaryTitle: 'Übersicht',
    trendTitle: 'Produktion im Zeitverlauf',
    totalOutput: 'Gesamtausbringung',
    estimatedValue: 'Geschätzter Wert',
    valueHint: 'Richtwert – fiktive Preise, zu einem festen Kurs umgerechnet.',
    mixedUnits: 'Gemischte Einheiten – siehe Aufschlüsselung je Produkt',
    countries: 'Länder',
    products: 'Produkte',
    facilities: 'Standorte',
    records: 'Datensätze',
    peakYear: 'Spitzenjahr',
    growth: 'Veränderung im Zeitraum',
    byProduct: 'Nach Produkt',
    byCountry: 'Nach Land',
    facilityCount_one: '{{count}} Standort',
    facilityCount_few: '{{count}} Standorte',
    facilityCount_many: '{{count}} Standorte',
    facilityCount_other: '{{count}} Standorte',
  },
}
