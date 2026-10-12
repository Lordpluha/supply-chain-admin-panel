import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { countryQueries } from '@/entities/country'
import { facilityQueries } from '@/entities/facility'
import type { Product } from '@/entities/product'
import { productQueries } from '@/entities/product'
import { flagFor } from '@/shared/lib/flag'
import { useFormatters } from '@/shared/lib/useFormatters'
import { Badge } from '@/shared/ui/badge'
import {
  DetailBackLink,
  DetailFields,
  DetailHeader,
  DetailList,
  DetailSection,
  DetailState,
} from '@/shared/ui/detail'
import { Masonry, MasonryItem } from '@/shared/ui/masonry'

export interface ProductDetailPageProps {
  productId: string
}

export const ProductDetailPage = ({ productId }: ProductDetailPageProps) => {
  const { t } = useTranslation()
  const fmt = useFormatters()

  const product = useQuery(productQueries.detailOptions(productId))

  const countries = useQuery(
    countryQueries.listOptions({ pageSize: 0, sortBy: 'name', filters: { productId } }),
  )
  const facilities = useQuery(
    facilityQueries.listOptions({ pageSize: 0, sortBy: 'name', filters: { productId } }),
  )

  return (
    <DetailState query={product}>
      {(row: Product) => (
        <>
          <DetailHeader
            back={
              <DetailBackLink
                to="/products"
                label={t('detail.back', { list: t('products.title') })}
              />
            }
            title={row.name}
            description={row.category}
          />

          <Masonry>
            <MasonryItem>
              <DetailSection title={t('detail.overview')}>
                <DetailFields
                  fields={[
                    {
                      label: t('products.sku'),
                      value: <code className="typo-code">{row.sku}</code>,
                    },
                    {
                      label: t('products.category'),
                      value: <Badge variant="secondary">{row.category}</Badge>,
                    },
                    { label: t('products.unit'), value: row.unit },
                    { label: t('products.unitPrice'), value: fmt.currencyOf(row.unitPrice) },
                  ]}
                />
              </DetailSection>
            </MasonryItem>

            <MasonryItem>
              <DetailSection title={t('detail.countries')}>
                <DetailList
                  isLoading={countries.isLoading}
                  items={(countries.data?.items ?? []).map(country => ({
                    id: country.id,
                    primary: (
                      <Link
                        to="/countries/$countryId"
                        params={{ countryId: country.id }}
                        className="hover:text-primary underline-offset-4 hover:underline"
                      >
                        <span aria-hidden="true">{flagFor(country.iso2)}</span> {country.name}
                      </Link>
                    ),
                    secondary: country.region,
                  }))}
                />
              </DetailSection>
            </MasonryItem>

            <MasonryItem>
              <DetailSection title={t('detail.facilities')}>
                <DetailList
                  isLoading={facilities.isLoading}
                  items={(facilities.data?.items ?? []).map(facility => ({
                    id: facility.id,
                    primary: (
                      <Link
                        to="/facilities/$facilityId"
                        params={{ facilityId: facility.id }}
                        className="hover:text-primary underline-offset-4 hover:underline"
                      >
                        {facility.name}
                      </Link>
                    ),
                    secondary: facility.countryName,
                    trailing: fmt.number(facility.capacity),
                  }))}
                />
              </DetailSection>
            </MasonryItem>
          </Masonry>
        </>
      )}
    </DetailState>
  )
}
