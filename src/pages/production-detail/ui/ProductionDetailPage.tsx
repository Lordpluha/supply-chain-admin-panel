import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import type { ProductionRecordRow } from '@/entities/production-record'
import { productionRecordQueries } from '@/entities/production-record'
import { useFormatters } from '@/shared/lib/useFormatters'
import {
  DetailBackLink,
  DetailFields,
  DetailHeader,
  DetailList,
  DetailSection,
  DetailState,
} from '@/shared/ui/detail'
import { Masonry, MasonryItem } from '@/shared/ui/masonry'

export interface ProductionDetailPageProps {
  recordId: string
}

export const ProductionDetailPage = ({ recordId }: ProductionDetailPageProps) => {
  const { t } = useTranslation()
  const fmt = useFormatters()

  const record = useQuery(productionRecordQueries.detailOptions(recordId))

  // The same facility and product across the years, so a single figure can be
  // read against the line it belongs to. Hoisted out of the render callback:
  // a hook inside it would run only once the record has arrived, which is a
  // different number of hooks between renders.
  const siblings = useQuery({
    ...productionRecordQueries.listOptions({
      pageSize: 0,
      sortBy: 'year',
      sortDir: 'desc',
      filters: {
        facilityId: record.data?.facilityId ?? '',
        productId: record.data?.productId ?? '',
      },
    }),
    enabled: Boolean(record.data),
  })

  return (
    <DetailState query={record}>
      {(row: ProductionRecordRow) => {
        return (
          <>
            <DetailHeader
              back={
                <DetailBackLink
                  to="/production"
                  label={t('detail.back', { list: t('production.title') })}
                />
              }
              title={`${row.productName} · ${row.year}`}
              description={`${row.facilityName} · ${row.countryName}`}
            />

            <Masonry>
              <MasonryItem>
                <DetailSection title={t('detail.overview')}>
                  <DetailFields
                    fields={[
                      { label: t('production.year'), value: row.year },
                      { label: t('production.value'), value: fmt.quantity(row.value, row.unit) },
                      { label: t('production.unit'), value: row.unit },
                      {
                        label: t('production.product'),
                        value: (
                          <Link
                            to="/products/$productId"
                            params={{ productId: row.productId }}
                            className="hover:text-primary underline-offset-4 hover:underline"
                          >
                            {row.productName}
                          </Link>
                        ),
                      },
                      {
                        label: t('production.facility'),
                        value: (
                          <Link
                            to="/facilities/$facilityId"
                            params={{ facilityId: row.facilityId }}
                            className="hover:text-primary underline-offset-4 hover:underline"
                          >
                            {row.facilityName}
                          </Link>
                        ),
                      },
                      {
                        label: t('production.country'),
                        value: (
                          <Link
                            to="/countries/$countryId"
                            params={{ countryId: row.countryId }}
                            className="hover:text-primary underline-offset-4 hover:underline"
                          >
                            {row.countryName}
                          </Link>
                        ),
                      },
                    ]}
                  />
                </DetailSection>
              </MasonryItem>

              <MasonryItem>
                <DetailSection title={t('detail.production')} description={row.facilityName}>
                  <DetailList
                    isLoading={siblings.isLoading}
                    items={(siblings.data?.items ?? []).map(sibling => ({
                      id: sibling.id,
                      primary:
                        sibling.id === row.id ? (
                          <span className="font-medium">{sibling.year}</span>
                        ) : (
                          <Link
                            to="/production/$recordId"
                            params={{ recordId: sibling.id }}
                            className="hover:text-primary underline-offset-4 hover:underline"
                          >
                            {sibling.year}
                          </Link>
                        ),
                      trailing: fmt.quantity(sibling.value, sibling.unit),
                    }))}
                  />
                </DetailSection>
              </MasonryItem>
            </Masonry>
          </>
        )
      }}
    </DetailState>
  )
}
