import { describe, expect, it } from 'vitest'
import { createCollection } from './collection'

interface Country {
  id: string
  name: string
  iso2: string
  iso3: string
  region: string
  lat: number
}

const seed = (): Array<Country> => [
  { id: 'de', name: 'Germany', iso2: 'DE', iso3: 'DEU', region: 'Europe', lat: 51.17 },
  { id: 'cl', name: 'Chile', iso2: 'CL', iso3: 'CHL', region: 'South America', lat: -35.68 },
  { id: 'cn', name: 'China', iso2: 'CN', iso3: 'CHN', region: 'Asia', lat: 35.86 },
]

const countries = () =>
  createCollection<Country>('country', seed(), {
    searchable: ['name', 'iso2', 'iso3', 'region'],
    filters: { region: (item, value) => item.region === value },
  })

const names = (items: ReadonlyArray<Country>) => items.map(item => item.name)

describe('collection search', () => {
  it('matches on the name', () => {
    expect(names(countries().query({ search: 'germ' }).items)).toEqual(['Germany'])
  })

  /**
   * An operator reaching for a country types what is on the row, and the row
   * shows the ISO code beside the name. Searching only the name would make the
   * visible code unsearchable.
   */
  it('matches on the ISO-2 code', () => {
    expect(names(countries().query({ search: 'DE' }).items)).toEqual(['Germany'])
  })

  it('matches on the ISO-3 code', () => {
    expect(names(countries().query({ search: 'CHL' }).items)).toEqual(['Chile'])
  })

  it('matches on the region', () => {
    expect(names(countries().query({ search: 'Asia' }).items)).toEqual(['China'])
  })

  it('ignores case', () => {
    expect(names(countries().query({ search: 'chl' }).items)).toEqual(['Chile'])
  })

  it('returns nothing rather than everything when nothing matches', () => {
    expect(countries().query({ search: 'zzz' }).items).toEqual([])
  })

  it('returns everything for an empty term', () => {
    expect(countries().query({ search: '' }).items).toHaveLength(3)
  })
})

describe('collection filters, sorting and pagination', () => {
  it('applies a field filter', () => {
    expect(names(countries().query({ filters: { region: 'Asia' } }).items)).toEqual(['China'])
  })

  it('combines a filter with a search', () => {
    const page = countries().query({ search: 'ch', filters: { region: 'Asia' } })

    expect(names(page.items)).toEqual(['China'])
  })

  it('sorts ascending and descending', () => {
    expect(names(countries().query({ sortBy: 'name' }).items)).toEqual([
      'Chile',
      'China',
      'Germany',
    ])
    expect(names(countries().query({ sortBy: 'name', sortDir: 'desc' }).items)).toEqual([
      'Germany',
      'China',
      'Chile',
    ])
  })

  /**
   * Its own table, with values that actually tell the two apart: as text `100`
   * sorts before `51`, which is what comparing every field as a string would
   * have produced.
   */
  it('sorts numbers as numbers, not as text', () => {
    const sizes = createCollection<{ id: string; name: string; size: number }>(
      'size',
      [
        { id: 'a', name: 'A', size: 9 },
        { id: 'b', name: 'B', size: 100 },
        { id: 'c', name: 'C', size: 51 },
      ],
      { searchable: ['name'] },
    )

    expect(sizes.query({ sortBy: 'size' }).items.map(item => item.size)).toEqual([9, 51, 100])
  })

  it('pages, and reports the total before paging', () => {
    const page = countries().query({ sortBy: 'name', page: 2, pageSize: 2 })

    expect(names(page.items)).toEqual(['Germany'])
    expect(page.total).toBe(3)
    expect(page.page).toBe(2)
  })

  /** `pageSize: 0` means "everything" — the selects that list every option. */
  it('treats a page size of zero as no limit', () => {
    expect(countries().query({ pageSize: 0 }).items).toHaveLength(3)
  })
})

describe('collection writes', () => {
  it('inserts with a generated id', () => {
    const table = countries()
    const created = table.insert({
      name: 'Poland',
      iso2: 'PL',
      iso3: 'POL',
      region: 'Europe',
      lat: 51.9,
    })

    expect(created.id).toBeTruthy()
    expect(table.find(created.id)?.name).toBe('Poland')
  })

  it('patches only what it is given', () => {
    const table = countries()

    expect(table.update('de', { name: 'Deutschland' })?.name).toBe('Deutschland')
    expect(table.find('de')?.iso2).toBe('DE')
  })

  it('reports whether a delete removed anything', () => {
    const table = countries()

    expect(table.remove('de')).toBe(true)
    expect(table.remove('de')).toBe(false)
    expect(table.all()).toHaveLength(2)
  })
})
