import type { Translation } from '../en'

/** Chrome the operator sees on every screen. */
export const ui: Pick<
  Translation,
  | 'common'
  | 'export'
  | 'detail'
  | 'nav'
  | 'theme'
  | 'language'
  | 'toast'
  | 'deleteDialog'
  | 'errors'
  | 'settings'
> = {
  common: {
    actions: 'Actions',
    apply: 'Appliquer',
    cancel: 'Annuler',
    close: 'Fermer',
    confirm: 'Confirmer',
    create: 'Créer',
    delete: 'Supprimer',
    edit: 'Modifier',
    from: 'De',
    to: 'À',
    export: 'Exporter',
    exporting: 'Export en cours…',
    loading: 'Chargement…',
    next: 'Suivant',
    noResults: 'Aucun résultat pour ces filtres',
    open: 'Ouvrir',
    of: 'sur',
    page: 'Page',
    previous: 'Précédent',
    reset: 'Réinitialiser',
    retry: 'Réessayer',
    rowsPerPage: 'Lignes par page',
    save: 'Enregistrer',
    saving: 'Enregistrement…',
    search: 'Rechercher',
    selectDate: 'Choisir une date',
    showOptions: 'Afficher les options',
    clearDate: 'Effacer la date',
    selectAll: 'Tous',
    showing: '{{from}}–{{to}} sur {{total}}',
    sortAsc: 'Trier par ordre croissant',
    sortDesc: 'Trier par ordre décroissant',
    sortNone: 'Supprimer le tri',
  },
  export: {
    title: 'Exporter',
    format: 'Format de fichier',
    download: 'Télécharger',
    body_one: "{{count}} ligne, exactement telle que filtrée et triée à l'écran.",
    body_few: "{{count}} lignes, exactement telles que filtrées et triées à l'écran.",
    body_many: "{{count}} lignes, exactement telles que filtrées et triées à l'écran.",
    body_other: "{{count}} lignes, exactement telles que filtrées et triées à l'écran.",
    formats: {
      xlsx: {
        label: 'Classeur Excel (.xlsx)',
        hint: 'Le format actuel. Conserve la largeur des colonnes et le type des cellules.',
      },
      xls: {
        label: 'Excel 2003 (.xls)',
        hint: "SpreadsheetML, pour les outils qui exigent encore l'ancienne extension.",
      },
      csv: {
        label: 'CSV (.csv)',
        hint: "Texte UTF-8 brut. S'ouvre partout, sans mise en forme.",
      },
    },
  },
  detail: {
    back: 'Retour à {{list}}',
    overview: "Vue d'ensemble",
    location: 'Emplacement',
    facilities: 'Sites',
    products: 'Produits',
    countries: 'Pays',
    production: 'Enregistrements de production',
    activity: 'Activité récente',
    empty: "Rien n'est encore enregistré ici.",
    coordinates: 'Coordonnées',
    identifiers: 'Identifiants',
  },
  nav: {
    sectionAnalysis: 'Analyse',
    sectionData: 'Données de référence',
    sectionAdmin: 'Administration',
    dashboard: "Carte d'approvisionnement",
    countries: 'Pays',
    products: 'Produits',
    facilities: 'Sites',
    production: 'Production',
    users: 'Utilisateurs',
    roles: 'Rôles et droits',
    audit: "Journal d'activité",
    signOut: 'Se déconnecter',
    skipToContent: 'Aller au contenu principal',
    toggleSidebar: 'Afficher ou masquer la navigation',
  },
  settings: {
    title: 'Paramètres',
    description: 'Comment ce panneau met en forme ce qu’il affiche.',
    open: 'Paramètres',
    appearance: 'Apparence',
    regional: 'Régional',
    timeZone: 'Fuseau horaire',
    timeZoneAuto: 'Suivre mon navigateur ({{zone}})',
    timeZoneHint: 'Tous les horodatages du panneau s’affichent dans ce fuseau.',
    currency: 'Devise',
    currencyHint: 'Indicatif uniquement — converti depuis l’EUR à un taux fixe.',
    done: 'Terminé',
  },
  theme: {
    label: 'Apparence',
    light: 'Clair',
    dark: 'Sombre',
    dim: 'Atténué',
  },
  language: {
    label: 'Langue',
    en: 'English',
    de: 'Deutsch',
    fr: 'Français',
    pl: 'Polski',
  },
  toast: {
    created: 'Créé',
    updated: 'Enregistré',
    deleted: 'Supprimé',
    exported: 'Export prêt',
  },
  deleteDialog: {
    title: 'Supprimer cet enregistrement ?',
    body: "Cette action est irréversible et sera consignée dans le journal d'activité.",
  },
  errors: {
    generic: 'Une erreur est survenue. Veuillez réessayer.',
    appErrorTitle: "Quelque chose s'est mal passé",
    appErrorBody:
      "L'écran n'a pas pu être affiché. Réessayer suffit le plus souvent ; sinon, les détails ci-dessous sont ce qu'un rapport de bogue demande.",
    pathLabel: 'Chemin',
    detailsLabel: 'Détails',
    reload: 'Recharger la page',
    unauthorized: 'Votre session a expiré. Reconnectez-vous.',
    forbidden: "Vous n'avez pas les droits nécessaires.",
    notFound: "Cet enregistrement n'existe plus.",
    notFoundTitle: 'Introuvable',
    conflict: 'Cette modification est en conflit avec des données existantes.',
    validation: 'Vérifiez les champs signalés.',
    pageNotFoundTitle: 'Page introuvable',
    pageNotFoundBody: "La page demandée n'existe pas.",
    noAccessTitle: 'Accès refusé',
    noAccessBody: 'Votre rôle ne donne pas accès à cette page.',
  },
}
