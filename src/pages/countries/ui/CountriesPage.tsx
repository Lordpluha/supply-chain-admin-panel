import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import { parseAsString } from 'nuqs'
import { useTranslation } from 'react-i18next'
import type { Country, CountryCreateInput, CountryUpdateInput } from '@/entities/country'
import { COUNTRY_REGIONS, countryQueries } from '@/entities/country'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import type { DataColumn } from '@/shared/ui/data-table'
import { FilterField } from '@/shared/ui/filter-field'
import { SearchableSelect } from '@/shared/ui/searchable-select'
import type { EntityCrudConfig } from '@/widgets/entity-crud'
import { EntityCrudPage } from '@/widgets/entity-crud'
import { CountryForm } from './CountryForm'

export const CountriesPage = () => {
  const { t } = useTranslation()

  const columns: ReadonlyArray<DataColumn<Country>> = [
    { id: 'name', header: t('countries.name'), cell: row => row.name, sortable: true },
    {
      id: 'iso2',
      header: t('countries.iso2'),
      cell: row => <code className="typo-code">{row.iso2}</code>,
      sortable: true,
    },
    {
      id: 'region',
      header: t('countries.region'),
      cell: row => <Badge variant="secondary">{row.region}</Badge>,
      sortable: true,
    },
    {
      id: 'lat',
      header: t('countries.lat'),
      cell: row => row.lat.toFixed(2),
      align: 'end',
      secondary: true,
    },
    {
      id: 'lng',
      header: t('countries.lng'),
      cell: row => row.lng.toFixed(2),
      align: 'end',
      secondary: true,
    },
  ]

  const config: EntityCrudConfig<Country, CountryCreateInput, CountryUpdateInput> = {
    titleKey: 'countries.title',
    descriptionKey: 'countries.description',
    createTitleKey: 'countries.createTitle',
    editTitleKey: 'countries.editTitle',
    queries: countryQueries,
    readPermission: 'countries:read',
    writePermission: 'countries:write',
    columns,
    filterParsers: { region: parseAsString.withDefault('') },
    renderFilters: ({ values, set }) => (
      <FilterField label={t('countries.region')}>
        <SearchableSelect
          className="w-44"
          aria-label={t('countries.region')}
          value={values.region}
          onChange={value => set('region', value || null)}
          allLabel={t('common.selectAll')}
          placeholder={t('common.selectAll')}
          options={COUNTRY_REGIONS.map(region => ({ value: region, label: region }))}
        />
      </FilterField>
    ),
    exportFileName: 'countries',
    exportColumns: [
      { header: t('countries.name'), value: row => row.name },
      { header: t('countries.iso2'), value: row => row.iso2 },
      { header: t('countries.iso3'), value: row => row.iso3 },
      { header: t('countries.isoNumeric'), value: row => row.isoNumeric },
      { header: t('countries.region'), value: row => row.region },
      { header: t('countries.lat'), value: row => row.lat },
      { header: t('countries.lng'), value: row => row.lng },
    ],
    detailLink: row => (
      <Button
        render={<Link to="/countries/$countryId" params={{ countryId: row.id }} />}
        variant="ghost"
        size="icon"
        className="size-8"
        aria-label={`${t('common.open')} — ${row.name}`}
      >
        <ArrowUpRight aria-hidden="true" />
      </Button>
    ),
    label: row => row.name,
    toFormValues: row => row ?? {},
    Form: CountryForm,
  }

  return <EntityCrudPage config={config} />
}
