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
    actions: 'Aktionen',
    apply: 'Übernehmen',
    cancel: 'Abbrechen',
    close: 'Schließen',
    confirm: 'Bestätigen',
    create: 'Erstellen',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    from: 'Von',
    to: 'Bis',
    export: 'Exportieren',
    exporting: 'Export läuft…',
    loading: 'Wird geladen…',
    next: 'Weiter',
    noResults: 'Keine Treffer für diese Filter',
    open: 'Öffnen',
    of: 'von',
    page: 'Seite',
    previous: 'Zurück',
    reset: 'Zurücksetzen',
    retry: 'Erneut versuchen',
    rowsPerPage: 'Zeilen pro Seite',
    save: 'Speichern',
    saving: 'Wird gespeichert…',
    search: 'Suchen',
    selectDate: 'Datum auswählen',
    showOptions: 'Optionen anzeigen',
    clearDate: 'Datum löschen',
    selectAll: 'Alle',
    showing: '{{from}}–{{to}} von {{total}}',
    sortAsc: 'Aufsteigend sortieren',
    sortDesc: 'Absteigend sortieren',
    sortNone: 'Sortierung aufheben',
  },
  export: {
    title: 'Exportieren',
    format: 'Dateiformat',
    download: 'Herunterladen',
    body_one: '{{count}} Zeile, genau wie gefiltert und sortiert angezeigt.',
    body_few: '{{count}} Zeilen, genau wie gefiltert und sortiert angezeigt.',
    body_many: '{{count}} Zeilen, genau wie gefiltert und sortiert angezeigt.',
    body_other: '{{count}} Zeilen, genau wie gefiltert und sortiert angezeigt.',
    formats: {
      xlsx: {
        label: 'Excel-Arbeitsmappe (.xlsx)',
        hint: 'Das aktuelle Format. Behält Spaltenbreiten und Zelltypen bei.',
      },
      xls: {
        label: 'Excel 2003 (.xls)',
        hint: 'SpreadsheetML, für Werkzeuge, die auf der alten Endung bestehen.',
      },
      csv: {
        label: 'CSV (.csv)',
        hint: 'Reiner UTF-8-Text. Öffnet sich überall, enthält keine Formatierung.',
      },
    },
  },
  detail: {
    back: 'Zurück zu {{list}}',
    overview: 'Überblick',
    location: 'Standort',
    facilities: 'Standorte',
    products: 'Produkte',
    countries: 'Länder',
    production: 'Produktionsdatensätze',
    activity: 'Letzte Aktivität',
    empty: 'Hier ist noch nichts erfasst.',
    coordinates: 'Koordinaten',
    identifiers: 'Kennungen',
  },
  nav: {
    sectionAnalysis: 'Analyse',
    sectionData: 'Stammdaten',
    sectionAdmin: 'Verwaltung',
    dashboard: 'Lieferkarte',
    countries: 'Länder',
    products: 'Produkte',
    facilities: 'Standorte',
    production: 'Produktion',
    users: 'Benutzer',
    roles: 'Rollen & Rechte',
    audit: 'Aktivitätsprotokoll',
    signOut: 'Abmelden',
    skipToContent: 'Zum Hauptinhalt springen',
    toggleSidebar: 'Navigation ein- oder ausblenden',
  },
  settings: {
    title: 'Einstellungen',
    description: 'Wie dieses Panel formatiert, was es anzeigt.',
    open: 'Einstellungen',
    appearance: 'Darstellung',
    regional: 'Regional',
    timeZone: 'Zeitzone',
    timeZoneAuto: 'Browser folgen ({{zone}})',
    timeZoneHint: 'Jeder Zeitstempel im Panel wird in dieser Zone dargestellt.',
    currency: 'Währung',
    currencyHint: 'Nur als Richtwert – aus EUR zu einem festen Kurs umgerechnet.',
    done: 'Fertig',
  },
  theme: {
    label: 'Erscheinungsbild',
    light: 'Hell',
    dark: 'Dunkel',
    dim: 'Gedämpft',
  },
  language: {
    label: 'Sprache',
    en: 'English',
    de: 'Deutsch',
    fr: 'Français',
    pl: 'Polski',
  },
  toast: {
    created: 'Erstellt',
    updated: 'Gespeichert',
    deleted: 'Gelöscht',
    exported: 'Export bereit',
  },
  deleteDialog: {
    title: 'Diesen Datensatz löschen?',
    body: 'Das lässt sich nicht rückgängig machen. Die Aktion wird im Aktivitätsprotokoll erfasst.',
  },
  errors: {
    generic: 'Etwas ist schiefgelaufen. Bitte erneut versuchen.',
    appErrorTitle: 'Etwas ist schiefgelaufen',
    appErrorBody:
      'Die Seite konnte nicht dargestellt werden. Ein erneuter Versuch hilft meistens; andernfalls gehören die Angaben unten in einen Fehlerbericht.',
    pathLabel: 'Pfad',
    detailsLabel: 'Details',
    reload: 'Seite neu laden',
    unauthorized: 'Ihre Sitzung ist abgelaufen. Bitte erneut anmelden.',
    forbidden: 'Ihnen fehlt die Berechtigung dafür.',
    notFound: 'Dieser Datensatz existiert nicht mehr.',
    notFoundTitle: 'Nicht gefunden',
    conflict: 'Diese Änderung steht im Konflikt mit vorhandenen Daten.',
    validation: 'Bitte die markierten Felder prüfen.',
    pageNotFoundTitle: 'Seite nicht gefunden',
    pageNotFoundBody: 'Die angeforderte Seite existiert nicht.',
    noAccessTitle: 'Kein Zugriff',
    noAccessBody: 'Ihre Rolle enthält keine Berechtigung für diese Seite.',
  },
}
