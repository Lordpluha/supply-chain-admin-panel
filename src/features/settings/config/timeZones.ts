/**
 * A curated list rather than `Intl.supportedValuesOf('timeZone')`.
 *
 * That call returns ~450 zones, and a select with 450 unsearchable options is
 * worse than no setting at all. These cover every country in the dataset plus
 * the usual head-office zones; "follow my browser" remains the default and
 * handles everyone else.
 */
export const TIME_ZONE_GROUPS = [
  {
    region: 'Europe',
    zones: [
      'Europe/London',
      'Europe/Lisbon',
      'Europe/Paris',
      'Europe/Berlin',
      'Europe/Amsterdam',
      'Europe/Zurich',
      'Europe/Prague',
      'Europe/Warsaw',
      'Europe/Budapest',
      'Europe/Stockholm',
      'Europe/Oslo',
      'Europe/Helsinki',
    ],
  },
  {
    region: 'Americas',
    zones: [
      'America/Los_Angeles',
      'America/Denver',
      'America/Chicago',
      'America/New_York',
      'America/Toronto',
      'America/Mexico_City',
      'America/Bogota',
      'America/Sao_Paulo',
      'America/Santiago',
      'America/Argentina/Buenos_Aires',
    ],
  },
  {
    region: 'Asia & Oceania',
    zones: [
      'Asia/Jerusalem',
      'Asia/Kolkata',
      'Asia/Jakarta',
      'Asia/Shanghai',
      'Asia/Seoul',
      'Asia/Tokyo',
      'Australia/Perth',
      'Australia/Sydney',
    ],
  },
  {
    region: 'Africa',
    zones: ['Africa/Casablanca', 'Africa/Lagos', 'Africa/Lubumbashi', 'Africa/Johannesburg'],
  },
  {
    region: 'Universal',
    zones: ['UTC'],
  },
] as const
