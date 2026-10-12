import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import { parseAsString } from 'nuqs'
import { useTranslation } from 'react-i18next'
import { countryQueries } from '@/entities/country'
import type { FacilityCreateInput, FacilityRow, FacilityUpdateInput } from '@/entities/facility'
import { FACILITY_KINDS, facilityQueries, iconForKind } from '@/entities/facility'
import { flagFor } from '@/shared/lib/flag'
import { useFormatters } from '@/shared/lib/useFormatters'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import type { DataColumn } from '@/shared/ui/data-table'
import { FilterField } from '@/shared/ui/filter-field'
import { OptionSelect } from '@/shared/ui/option-select'
import { RangeFilter } from '@/shared/ui/range-filter'
import { SearchableSelect } from '@/shared/ui/searchable-select'
import type { EntityCrudConfig } from '@/widgets/entity-crud'
import { EntityCrudPage } from '@/widgets/entity-crud'
import { FacilityForm } from './FacilityForm'

const STATUS_TONE = {
  active: 'default',
  planned: 'secondary',
  idle: 'outline',
} as const

/**
 * Nameplate capacity bands.
 *
 * The unit differs by what a site makes — tonnes at a refinery, GWh at a cell
 * plant — so these are plain magnitudes rather than quantities. They are the
 * orders of magnitude the dataset actually spans.
 */
const CAPACITY_BANDS = [0, 1_000, 5_000, 10_000, 25_000, 50_000, 100_000]

export const FacilitiesPage = () => {
  const { t } = useTranslation()
  const fmt = useFormatters()

  const countries = useQuery(countryQueries.listOptions({ pageSize: 0, sortBy: 'name' }))

  const columns: ReadonlyArray<DataColumn<FacilityRow>> = [
    { id: 'name', header: t('facilities.name'), cell: row => row.name, sortable: true },
    {
      id: 'kind',
      header: t('facilities.kind'),
      cell: row => {
        const Icon = iconForKind(row.kind)
        return (
          <span className="flex items-center gap-1.5">
            <Icon className="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
            {t(`facilities.kinds.${row.kind}`)}
          </span>
        )
      },
      sortable: true,
    },
    {
      id: 'countryId',
      header: t('facilities.country'),
      cell: row => (
        <span className="flex items-center gap-1.5">
          {/* A question mark when the code cannot be resolved, never two
              stray letters. */}
          <span aria-hidden="true">{flagFor(row.countryIso2)}</span>
          {row.countryName}
        </span>
      ),
      sortable: true,
    },
    {
      id: 'productNames',
      header: t('facilities.products'),
      cell: row => (
        <span className="text-muted-foreground">{row.productNames.join(', ') || '—'}</span>
      ),
      secondary: true,
    },
    {
      id: 'status',
      header: t('facilities.status'),
      cell: row => (
        <Badge variant={STATUS_TONE[row.status]}>
          {t(`facilities.status${row.status[0].toUpperCase()}${row.status.slice(1)}` as never)}
        </Badge>
      ),
      sortable: true,
    },
    {
      id: 'capacity',
      header: t('facilities.capacity'),
      cell: row => fmt.number(row.capacity),
      align: 'end',
      sortable: true,
    },
  ]

  const config: EntityCrudConfig<FacilityRow, FacilityCreateInput, FacilityUpdateInput> = {
    titleKey: 'facilities.title',
    descriptionKey: 'facilities.description',
    createTitleKey: 'facilities.createTitle',
    editTitleKey: 'facilities.editTitle',
    queries: facilityQueries,
    readPermission: 'facilities:read',
    writePermission: 'facilities:write',
    columns,
    filterParsers: {
      countryId: parseAsString.withDefault(''),
      kind: parseAsString.withDefault(''),
      status: parseAsString.withDefault(''),
      capacityMin: parseAsString.withDefault(''),
      capacityMax: parseAsString.withDefault(''),
    },
    renderFilters: ({ values, set }) => (
      <>
        <FilterField label={t('facilities.country')}>
          <SearchableSelect
            className="w-44"
            aria-label={t('facilities.country')}
            value={values.countryId}
            onChange={value => set('countryId', value || null)}
            allLabel={t('dashboard.anyCountry')}
            placeholder={t('dashboard.anyCountry')}
            options={(countries.data?.items ?? []).map(c => ({ value: c.id, label: c.name }))}
          />
        </FilterField>
        <FilterField label={t('facilities.kind')}>
          <OptionSelect
            className="w-40"
            aria-label={t('facilities.kind')}
            value={values.kind}
            onChange={value => set('kind', value || null)}
            allLabel={t('common.selectAll')}
            options={FACILITY_KINDS.map(option => ({
              value: option,
              label: t(`facilities.kinds.${option}`),
            }))}
          />
        </FilterField>
        <FilterField label={t('facilities.status')}>
          <OptionSelect
            className="w-36"
            aria-label={t('facilities.status')}
            value={values.status}
            onChange={value => set('status', value || null)}
            allLabel={t('common.selectAll')}
            options={(['active', 'planned', 'idle'] as const).map(status => ({
              value: status,
              label: t(`facilities.status${status[0].toUpperCase()}${status.slice(1)}` as never),
            }))}
          />
        </FilterField>

        <RangeFilter
          label={t('facilities.capacity')}
          options={CAPACITY_BANDS.map(band => ({
            value: String(band),
            label: fmt.number(band),
          }))}
          value={{ from: values.capacityMin, to: values.capacityMax }}
          onChange={(from, to) => {
            set('capacityMin', from)
            set('capacityMax', to)
          }}
        />
      </>
    ),
    exportFileName: 'facilities',
    exportColumns: [
      { header: t('facilities.name'), value: row => row.name },
      { header: t('facilities.kind'), value: row => row.kind },
      { header: t('facilities.country'), value: row => row.countryName },
      { header: t('facilities.products'), value: row => row.productNames.join(', '), width: 40 },
      { header: t('facilities.status'), value: row => row.status },
      { header: t('facilities.capacity'), value: row => row.capacity },
      { header: t('facilities.lat'), value: row => row.lat },
      { header: t('facilities.lng'), value: row => row.lng },
    ],
    detailLink: row => (
      <Button
        render={<Link to="/facilities/$facilityId" params={{ facilityId: row.id }} />}
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
    Form: FacilityForm,
  }

  return <EntityCrudPage config={config} />
}
