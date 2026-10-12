import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import type { Country } from '@/entities/country'
import { countryQueries } from '@/entities/country'
import { facilityQueries } from '@/entities/facility'
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

export interface CountryDetailPageProps {
  countryId: string
}

export const CountryDetailPage = ({ countryId }: CountryDetailPageProps) => {
  const { t } = useTranslation()
  const fmt = useFormatters()

  const country = useQuery(countryQueries.detailOptions(countryId))

  // Both lists are filtered server-side through the production records, so they
  // say what this country actually does rather than what it could.
  const facilities = useQuery(
    facilityQueries.listOptions({ pageSize: 0, sortBy: 'name', filters: { countryId } }),
  )
  const products = useQuery(
    productQueries.listOptions({ pageSize: 0, sortBy: 'name', filters: { countryId } }),
  )

  return (
    <DetailState query={country}>
      {(row: Country) => (
        <>
          <DetailHeader
            back={
              <DetailBackLink
                to="/countries"
                label={t('detail.back', { list: t('countries.title') })}
              />
            }
            title={
              <>
                <span aria-hidden="true">{flagFor(row.iso2)}</span>
                {row.name}
              </>
            }
            description={row.region}
          />

          <Masonry>
            <MasonryItem>
              <DetailSection title={t('detail.identifiers')}>
                <DetailFields
                  fields={[
                    {
                      label: t('countries.iso2'),
                      value: <code className="typo-code">{row.iso2}</code>,
                    },
                    {
                      label: t('countries.iso3'),
                      value: <code className="typo-code">{row.iso3}</code>,
                    },
                    {
                      label: t('countries.isoNumeric'),
                      value: <code className="typo-code">{row.isoNumeric}</code>,
                    },
                    {
                      label: t('countries.region'),
                      value: <Badge variant="secondary">{row.region}</Badge>,
                    },
                  ]}
                />
              </DetailSection>
            </MasonryItem>

            <MasonryItem>
              <DetailSection title={t('detail.coordinates')}>
                <DetailFields
                  fields={[
                    { label: t('countries.lat'), value: row.lat.toFixed(2) },
                    { label: t('countries.lng'), value: row.lng.toFixed(2) },
                  ]}
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
                    secondary: t(`facilities.kinds.${facility.kind}`),
                    trailing: fmt.number(facility.capacity),
                  }))}
                />
              </DetailSection>
            </MasonryItem>

            <MasonryItem>
              <DetailSection title={t('detail.products')}>
                <DetailList
                  isLoading={products.isLoading}
                  items={(products.data?.items ?? []).map(product => ({
                    id: product.id,
                    primary: (
                      <Link
                        to="/products/$productId"
                        params={{ productId: product.id }}
                        className="hover:text-primary underline-offset-4 hover:underline"
                      >
                        {product.name}
                      </Link>
                    ),
                    secondary: product.category,
                    trailing: product.unit,
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
