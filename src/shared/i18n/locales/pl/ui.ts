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
    actions: 'Akcje',
    apply: 'Zastosuj',
    cancel: 'Anuluj',
    close: 'Zamknij',
    confirm: 'Potwierdź',
    create: 'Utwórz',
    delete: 'Usuń',
    edit: 'Edytuj',
    from: 'Od',
    to: 'Do',
    export: 'Eksportuj',
    exporting: 'Eksportowanie…',
    loading: 'Ładowanie…',
    next: 'Dalej',
    noResults: 'Brak wyników dla tych filtrów',
    open: 'Otwórz',
    of: 'z',
    page: 'Strona',
    previous: 'Wstecz',
    reset: 'Wyczyść',
    retry: 'Spróbuj ponownie',
    rowsPerPage: 'Wierszy na stronę',
    save: 'Zapisz',
    saving: 'Zapisywanie…',
    search: 'Szukaj',
    selectDate: 'Wybierz datę',
    showOptions: 'Pokaż opcje',
    clearDate: 'Wyczyść datę',
    selectAll: 'Wszystkie',
    showing: '{{from}}–{{to}} z {{total}}',
    sortAsc: 'Sortuj rosnąco',
    sortDesc: 'Sortuj malejąco',
    sortNone: 'Usuń sortowanie',
  },
  export: {
    title: 'Eksport',
    format: 'Format pliku',
    download: 'Pobierz',
    body_one: '{{count}} wiersz, dokładnie tak jak przefiltrowano i posortowano na ekranie.',
    body_few: '{{count}} wiersze, dokładnie tak jak przefiltrowano i posortowano na ekranie.',
    body_many: '{{count}} wierszy, dokładnie tak jak przefiltrowano i posortowano na ekranie.',
    body_other: '{{count}} wierszy, dokładnie tak jak przefiltrowano i posortowano na ekranie.',
    formats: {
      xlsx: {
        label: 'Skoroszyt Excela (.xlsx)',
        hint: 'Bieżący format. Zachowuje szerokość kolumn i typy komórek.',
      },
      xls: {
        label: 'Excel 2003 (.xls)',
        hint: 'SpreadsheetML, dla narzędzi wymagających starego rozszerzenia.',
      },
      csv: {
        label: 'CSV (.csv)',
        hint: 'Zwykły tekst UTF-8. Otwiera się wszędzie, bez formatowania.',
      },
    },
  },
  detail: {
    back: 'Powrót do {{list}}',
    overview: 'Przegląd',
    location: 'Lokalizacja',
    facilities: 'Zakłady',
    products: 'Produkty',
    countries: 'Kraje',
    production: 'Rekordy produkcji',
    activity: 'Ostatnia aktywność',
    empty: 'Nic tu jeszcze nie zarejestrowano.',
    coordinates: 'Współrzędne',
    identifiers: 'Identyfikatory',
  },
  nav: {
    sectionAnalysis: 'Analiza',
    sectionData: 'Dane referencyjne',
    sectionAdmin: 'Administracja',
    dashboard: 'Mapa dostaw',
    countries: 'Kraje',
    products: 'Produkty',
    facilities: 'Zakłady',
    production: 'Produkcja',
    users: 'Użytkownicy',
    roles: 'Role i uprawnienia',
    audit: 'Dziennik aktywności',
    signOut: 'Wyloguj się',
    skipToContent: 'Przejdź do treści głównej',
    toggleSidebar: 'Pokaż lub ukryj nawigację',
  },
  settings: {
    title: 'Ustawienia',
    description: 'Jak ten panel formatuje to, co pokazuje.',
    open: 'Ustawienia',
    appearance: 'Wygląd',
    regional: 'Regionalne',
    timeZone: 'Strefa czasowa',
    timeZoneAuto: 'Zgodnie z przeglądarką ({{zone}})',
    timeZoneHint: 'Każdy znacznik czasu w panelu jest pokazywany w tej strefie.',
    currency: 'Waluta',
    currencyHint: 'Wartość orientacyjna — przeliczona z EUR po stałym kursie.',
    done: 'Gotowe',
  },
  theme: {
    label: 'Wygląd',
    light: 'Jasny',
    dark: 'Ciemny',
    dim: 'Przygaszony',
  },
  language: {
    label: 'Język',
    en: 'English',
    de: 'Deutsch',
    fr: 'Français',
    pl: 'Polski',
  },
  toast: {
    created: 'Utworzono',
    updated: 'Zapisano',
    deleted: 'Usunięto',
    exported: 'Eksport gotowy',
  },
  deleteDialog: {
    title: 'Usunąć ten rekord?',
    body: 'Tej operacji nie można cofnąć. Zostanie zapisana w dzienniku aktywności.',
  },
  errors: {
    generic: 'Coś poszło nie tak. Spróbuj ponownie.',
    appErrorTitle: 'Coś poszło nie tak',
    appErrorBody:
      'Nie udało się wyświetlić ekranu. Ponowna próba zwykle wystarcza; jeśli nie, poniższe szczegóły są tym, czego wymaga zgłoszenie błędu.',
    pathLabel: 'Ścieżka',
    detailsLabel: 'Szczegóły',
    reload: 'Odśwież stronę',
    unauthorized: 'Sesja wygasła. Zaloguj się ponownie.',
    forbidden: 'Nie masz uprawnień do tej operacji.',
    notFound: 'Ten rekord już nie istnieje.',
    notFoundTitle: 'Nie znaleziono',
    conflict: 'Ta zmiana jest sprzeczna z istniejącymi danymi.',
    validation: 'Sprawdź zaznaczone pola.',
    pageNotFoundTitle: 'Nie znaleziono strony',
    pageNotFoundBody: 'Żądana strona nie istnieje.',
    noAccessTitle: 'Brak dostępu',
    noAccessBody: 'Twoja rola nie obejmuje dostępu do tej strony.',
  },
}
