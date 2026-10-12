import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import type { FacilityRow } from '@/entities/facility'
import { FacilityKindIcon, facilityQueries } from '@/entities/facility'
import { productionRecordQueries } from '@/entities/production-record'
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

export interface FacilityDetailPageProps {
  facilityId: string
}

const statusKey = (status: string) =>
  `facilities.status${status[0].toUpperCase()}${status.slice(1)}` as never

export const FacilityDetailPage = ({ facilityId }: FacilityDetailPageProps) => {
  const { t } = useTranslation()
  const fmt = useFormatters()

  const facility = useQuery(facilityQueries.detailOptions(facilityId))

  // Newest first: what a site is producing now is the question people arrive
  // with, and the archive is one sort click away on the production screen.
  const records = useQuery(
    productionRecordQueries.listOptions({
      pageSize: 12,
      sortBy: 'year',
      sortDir: 'desc',
      filters: { facilityId },
    }),
  )

  return (
    <DetailState query={facility}>
      {(row: FacilityRow) => (
        <>
          <DetailHeader
            back={
              <DetailBackLink
                to="/facilities"
                label={t('detail.back', { list: t('facilities.title') })}
              />
            }
            title={
              <>
                <FacilityKindIcon
                  kind={row.kind}
                  className="text-muted-foreground size-5 shrink-0"
                  aria-hidden="true"
                />
                {row.name}
              </>
            }
            description={`${t(`facilities.kinds.${row.kind}`)} · ${row.countryName}`}
          />

          <Masonry>
            <MasonryItem>
              <DetailSection title={t('detail.overview')}>
                <DetailFields
                  fields={[
                    { label: t('facilities.kind'), value: t(`facilities.kinds.${row.kind}`) },
                    {
                      label: t('facilities.status'),
                      value: (
                        <Badge variant={row.status === 'active' ? 'default' : 'secondary'}>
                          {t(statusKey(row.status))}
                        </Badge>
                      ),
                    },
                    { label: t('facilities.capacity'), value: fmt.number(row.capacity) },
                    {
                      label: t('facilities.country'),
                      value: (
                        <Link
                          to="/countries/$countryId"
                          params={{ countryId: row.countryId }}
                          className="hover:text-primary underline-offset-4 hover:underline"
                        >
                          <span aria-hidden="true">{flagFor(row.countryIso2)}</span>{' '}
                          {row.countryName}
                        </Link>
                      ),
                    },
                  ]}
                />
              </DetailSection>
            </MasonryItem>

            <MasonryItem>
              <DetailSection title={t('detail.coordinates')}>
                <DetailFields
                  fields={[
                    { label: t('facilities.lat'), value: row.lat.toFixed(2) },
                    { label: t('facilities.lng'), value: row.lng.toFixed(2) },
                  ]}
                />
              </DetailSection>
            </MasonryItem>

            <MasonryItem>
              <DetailSection title={t('facilities.products')}>
                <DetailList items={row.productNames.map(name => ({ id: name, primary: name }))} />
              </DetailSection>
            </MasonryItem>

            <MasonryItem>
              <DetailSection title={t('detail.production')}>
                <DetailList
                  isLoading={records.isLoading}
                  items={(records.data?.items ?? []).map(record => ({
                    id: record.id,
                    primary: (
                      <Link
                        to="/production/$recordId"
                        params={{ recordId: record.id }}
                        className="hover:text-primary underline-offset-4 hover:underline"
                      >
                        {record.productName}
                      </Link>
                    ),
                    secondary: String(record.year),
                    trailing: fmt.quantity(record.value, record.unit),
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
