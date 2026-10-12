import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import { parseAsString } from 'nuqs'
import { useTranslation } from 'react-i18next'
import { countryQueries } from '@/entities/country'
import { productQueries } from '@/entities/product'
import type {
  ProductionRecordCreateInput,
  ProductionRecordRow,
  ProductionRecordUpdateInput,
} from '@/entities/production-record'
import { productionRecordQueries } from '@/entities/production-record'
import { YEARS } from '@/shared/config/constants'
import { useFormatters } from '@/shared/lib/useFormatters'
import { Button } from '@/shared/ui/button'
import type { DataColumn } from '@/shared/ui/data-table'
import { FilterField } from '@/shared/ui/filter-field'
import { OptionSelect } from '@/shared/ui/option-select'
import { RangeFilter } from '@/shared/ui/range-filter'
import { SearchableSelect } from '@/shared/ui/searchable-select'
import type { EntityCrudConfig } from '@/widgets/entity-crud'
import { EntityCrudPage } from '@/widgets/entity-crud'
import { ProductionForm } from './ProductionForm'

/**
 * Output bands, written compactly because the range is four orders of
 * magnitude — a lab measured in hundreds of tonnes beside a gigafactory
 * measured in hundreds of millions of cells.
 */
const OUTPUT_BANDS = [0, 1_000, 10_000, 100_000, 1_000_000, 10_000_000, 100_000_000]

export const ProductionPage = () => {
  const { t } = useTranslation()
  const fmt = useFormatters()

  const countries = useQuery(countryQueries.listOptions({ pageSize: 0, sortBy: 'name' }))
  const products = useQuery(productQueries.listOptions({ pageSize: 0, sortBy: 'name' }))

  // The API decorates each row with the resolved names, so the table needs one
  // request rather than one per row.
  const columns: ReadonlyArray<DataColumn<ProductionRecordRow>> = [
    {
      id: 'facilityId',
      header: t('production.facility'),
      cell: row => row.facilityName,
      sortable: true,
    },
    {
      id: 'countryName',
      header: t('production.country'),
      cell: row => row.countryName,
      secondary: true,
    },
    {
      id: 'productId',
      header: t('production.product'),
      cell: row => row.productName,
      sortable: true,
    },
    {
      id: 'year',
      header: t('production.year'),
      cell: row => row.year,
      align: 'end',
      sortable: true,
    },
    {
      id: 'value',
      header: t('production.value'),
      cell: row => fmt.quantity(row.value, row.unit),
      align: 'end',
      sortable: true,
    },
  ]

  const config: EntityCrudConfig<
    ProductionRecordRow,
    ProductionRecordCreateInput,
    ProductionRecordUpdateInput
  > = {
    titleKey: 'production.title',
    descriptionKey: 'production.description',
    createTitleKey: 'production.createTitle',
    editTitleKey: 'production.editTitle',
    queries: productionRecordQueries,
    readPermission: 'production:read',
    writePermission: 'production:write',
    columns,
    filterParsers: {
      countryId: parseAsString.withDefault(''),
      productId: parseAsString.withDefault(''),
      year: parseAsString.withDefault(''),
      outputMin: parseAsString.withDefault(''),
      outputMax: parseAsString.withDefault(''),
    },
    renderFilters: ({ values, set }) => (
      <>
        <FilterField label={t('production.country')}>
          <SearchableSelect
            className="w-40"
            aria-label={t('production.country')}
            value={values.countryId}
            onChange={value => set('countryId', value || null)}
            allLabel={t('dashboard.anyCountry')}
            placeholder={t('dashboard.anyCountry')}
            options={(countries.data?.items ?? []).map(c => ({ value: c.id, label: c.name }))}
          />
        </FilterField>
        <FilterField label={t('production.product')}>
          <SearchableSelect
            className="w-40"
            aria-label={t('production.product')}
            value={values.productId}
            onChange={value => set('productId', value || null)}
            allLabel={t('dashboard.anyProduct')}
            placeholder={t('dashboard.anyProduct')}
            options={(products.data?.items ?? []).map(p => ({ value: p.id, label: p.name }))}
          />
        </FilterField>
        <FilterField label={t('production.year')}>
          <OptionSelect
            className="w-28"
            aria-label={t('production.year')}
            value={values.year}
            onChange={value => set('year', value || null)}
            allLabel={t('common.selectAll')}
            options={YEARS.map(year => ({ value: String(year), label: String(year) }))}
          />
        </FilterField>

        <RangeFilter
          label={t('production.value')}
          options={OUTPUT_BANDS.map(band => ({
            value: String(band),
            label: fmt.compact(band),
          }))}
          value={{ from: values.outputMin, to: values.outputMax }}
          onChange={(from, to) => {
            set('outputMin', from)
            set('outputMax', to)
          }}
        />
      </>
    ),
    exportFileName: 'production',
    exportColumns: [
      { header: t('production.facility'), value: row => row.facilityName },
      { header: t('production.country'), value: row => row.countryName },
      { header: t('production.product'), value: row => row.productName },
      { header: t('production.year'), value: row => row.year },
      { header: t('production.value'), value: row => row.value },
      { header: t('production.unit'), value: row => row.unit },
    ],
    detailLink: row => (
      <Button
        render={<Link to="/production/$recordId" params={{ recordId: row.id }} />}
        variant="ghost"
        size="icon"
        className="size-8"
        aria-label={`${t('common.open')} — ${row.facilityName}`}
      >
        <ArrowUpRight aria-hidden="true" />
      </Button>
    ),
    label: row => `${row.facilityName} · ${row.productName} · ${row.year}`,
    toFormValues: row =>
      row
        ? { facilityId: row.facilityId, productId: row.productId, year: row.year, value: row.value }
        : {},
    Form: ProductionForm,
  }

  return <EntityCrudPage config={config} />
}
