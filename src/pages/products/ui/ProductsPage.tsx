import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import { parseAsString } from 'nuqs'
import { useTranslation } from 'react-i18next'
import type { Product, ProductCreateInput, ProductUpdateInput } from '@/entities/product'
import { PRODUCT_CATEGORIES, productQueries } from '@/entities/product'
import { useFormatters } from '@/shared/lib/useFormatters'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import type { DataColumn } from '@/shared/ui/data-table'
import { FilterField } from '@/shared/ui/filter-field'
import { RangeFilter } from '@/shared/ui/range-filter'
import { SearchableSelect } from '@/shared/ui/searchable-select'
import type { EntityCrudConfig } from '@/widgets/entity-crud'
import { EntityCrudPage } from '@/widgets/entity-crud'
import { ProductForm } from './ProductForm'

/**
 * The bands the price filter offers.
 *
 * Chosen rather than generated: the catalogue spans a raw material at a few
 * thousand and a finished pack in the millions, so an evenly spaced scale would
 * put every raw material in one bucket. These are the places a reader would
 * actually cut the list.
 */
const PRICE_BANDS = [0, 5_000, 10_000, 25_000, 50_000, 100_000, 500_000, 1_000_000, 5_000_000]

export const ProductsPage = () => {
  const { t } = useTranslation()
  const fmt = useFormatters()

  const columns: ReadonlyArray<DataColumn<Product>> = [
    { id: 'name', header: t('products.name'), cell: row => row.name, sortable: true },
    {
      id: 'sku',
      header: t('products.sku'),
      cell: row => <code className="typo-code">{row.sku}</code>,
      sortable: true,
    },
    {
      id: 'category',
      header: t('products.category'),
      cell: row => <Badge variant="secondary">{row.category}</Badge>,
      sortable: true,
    },
    { id: 'unit', header: t('products.unit'), cell: row => row.unit, secondary: true },
    {
      id: 'unitPrice',
      header: t('products.unitPrice'),
      cell: row => fmt.currencyOf(row.unitPrice),
      align: 'end',
      sortable: true,
    },
  ]

  const config: EntityCrudConfig<Product, ProductCreateInput, ProductUpdateInput> = {
    titleKey: 'products.title',
    descriptionKey: 'products.description',
    createTitleKey: 'products.createTitle',
    editTitleKey: 'products.editTitle',
    queries: productQueries,
    readPermission: 'products:read',
    writePermission: 'products:write',
    columns,
    filterParsers: {
      category: parseAsString.withDefault(''),
      priceMin: parseAsString.withDefault(''),
      priceMax: parseAsString.withDefault(''),
    },
    renderFilters: ({ values, set }) => (
      <>
        <FilterField label={t('products.category')}>
          <SearchableSelect
            className="w-44"
            aria-label={t('products.category')}
            value={values.category}
            onChange={value => set('category', value || null)}
            allLabel={t('common.selectAll')}
            placeholder={t('common.selectAll')}
            options={PRODUCT_CATEGORIES.map(category => ({ value: category, label: category }))}
          />
        </FilterField>

        <RangeFilter
          label={t('products.unitPrice')}
          options={PRICE_BANDS.map(band => ({
            value: String(band),
            label: fmt.currencyOf(band),
          }))}
          value={{ from: values.priceMin, to: values.priceMax }}
          onChange={(from, to) => {
            set('priceMin', from)
            set('priceMax', to)
          }}
        />
      </>
    ),
    exportFileName: 'products',
    exportColumns: [
      { header: t('products.name'), value: row => row.name },
      { header: t('products.sku'), value: row => row.sku },
      { header: t('products.category'), value: row => row.category },
      { header: t('products.unit'), value: row => row.unit },
      { header: t('products.unitPrice'), value: row => row.unitPrice },
    ],
    detailLink: row => (
      <Button
        render={<Link to="/products/$productId" params={{ productId: row.id }} />}
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
    Form: ProductForm,
  }

  return <EntityCrudPage config={config} />
}
