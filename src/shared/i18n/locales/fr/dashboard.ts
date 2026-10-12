import type { Translation } from '../en'

/** The supply map and its summary. */
export const dashboard: Pick<Translation, 'dashboard'> = {
  dashboard: {
    title: "Carte d'approvisionnement",
    description: 'Production par pays et par produit, {{from}}–{{to}}.',
    modeHint:
      'Le pays et le produit se filtrent mutuellement ; choisir un pays affiche aussi les sites.',
    country: 'Pays',
    product: 'Produit',
    anyCountry: 'Tous les pays',
    anyProduct: 'Tous les produits',
    yearRangeHint:
      'Les deux extrémités bougent. Faites glisser une poignée, ou activez-la et utilisez les flèches.',
    facility: 'Site',
    anyFacility: 'Tous les sites',
    yearRange: 'Années',
    clearFilters: 'Effacer les filtres',
    filters: 'Filtres',
    expandMap: 'Agrandir la carte',
    closeMap: 'Fermer la carte',
    showResults_one: 'Afficher {{count}} pays',
    showResults_few: 'Afficher {{count}} pays',
    showResults_many: 'Afficher {{count}} pays',
    showResults_other: 'Afficher {{count}} pays',
    mapTitle: 'Sites de production',
    mapEmpty: 'Aucune production ne correspond à ces filtres.',
    shareOfTotal: 'du total',
    clickToFilter: 'Sélectionnez pour filtrer le résumé sur ce pays.',
    clickToClear: 'Sélectionnez à nouveau pour effacer le filtre.',
    mapZoomHint:
      'Zoom sur la sélection. Les points verts sont ses sites de production — resélectionnez le pays pour dézoomer.',
    mapHint: 'Sélectionnez un point pour filtrer le résumé sur ce pays.',
    summaryInfo: 'Tout ce qui suit reflète les filtres ci-dessus — pays, produit et période.',
    growthInfo:
      'Mesuré entre la première et la dernière année ayant déclaré, pas les bornes du filtre.',
    trendInfo:
      'Production totale par an sur tout le périmètre. Les chiffres sont aussi restitués aux lecteurs d’écran.',
    byProductInfo:
      'Classé par valeur et non par quantité, afin de comparer des produits mesurés dans des unités différentes.',
    byCountryInfo:
      'Les mêmes chiffres que la carte, en texte — la carte n’en est jamais le seul accès.',
    summaryTitle: 'Résumé',
    trendTitle: 'Production dans le temps',
    totalOutput: 'Production totale',
    estimatedValue: 'Valeur estimée',
    valueHint: 'Indicatif — prix fictifs, convertis à un taux fixe.',
    mixedUnits: 'Unités mixtes — voir le détail par produit',
    countries: 'Pays',
    products: 'Produits',
    facilities: 'Sites',
    records: 'Enregistrements',
    peakYear: 'Année record',
    growth: 'Évolution sur la période',
    byProduct: 'Par produit',
    byCountry: 'Par pays',
    facilityCount_one: '{{count}} site',
    facilityCount_few: '{{count}} sites',
    facilityCount_many: '{{count}} sites',
    facilityCount_other: '{{count}} sites',
  },
}
