import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { hasPermission } from '@/entities/access'
import { auditEntryQueries } from '@/entities/audit-entry'
import { useSession } from '@/entities/session'
import type { UserRow } from '@/entities/user'
import { userQueries } from '@/entities/user'
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

export interface UserDetailPageProps {
  userId: string
}

export const UserDetailPage = ({ userId }: UserDetailPageProps) => {
  const { t } = useTranslation()
  const fmt = useFormatters()
  const { subject } = useSession()

  const user = useQuery(userQueries.detailOptions(userId))

  // The activity trail is a separate permission, and the API refuses the
  // request outright without it — so this does not ask.
  const canReadAudit = hasPermission({ subject, permission: 'audit:read' })

  const activity = useQuery({
    ...auditEntryQueries.listOptions({
      pageSize: 10,
      sortBy: 'createdAt',
      sortDir: 'desc',
      filters: { actorId: userId },
    }),
    enabled: canReadAudit,
  })

  return (
    <DetailState query={user}>
      {(row: UserRow) => (
        <>
          <DetailHeader
            back={
              <DetailBackLink to="/users" label={t('detail.back', { list: t('users.title') })} />
            }
            title={row.name}
            description={row.email}
          />

          <Masonry>
            <MasonryItem>
              <DetailSection title={t('detail.overview')}>
                <DetailFields
                  fields={[
                    { label: t('users.email'), value: row.email },
                    {
                      label: t('users.role'),
                      value: <Badge variant="secondary">{row.roleName}</Badge>,
                    },
                    {
                      label: t('users.status'),
                      value: (
                        <Badge variant={row.status === 'active' ? 'default' : 'secondary'}>
                          {row.status === 'active'
                            ? t('users.statusActive')
                            : t('users.statusSuspended')}
                        </Badge>
                      ),
                    },
                    { label: t('users.createdAt'), value: fmt.dateTime(row.createdAt) },
                    {
                      label: t('users.lastActiveAt'),
                      value: row.lastActiveAt ? fmt.dateTime(row.lastActiveAt) : t('users.never'),
                    },
                  ]}
                />
              </DetailSection>
            </MasonryItem>

            {canReadAudit ? (
              <MasonryItem>
                <DetailSection title={t('detail.activity')}>
                  <DetailList
                    isLoading={activity.isLoading}
                    items={(activity.data?.items ?? []).map(entry => ({
                      id: entry.id,
                      primary: t(`audit.actions.${entry.action}`),
                      secondary: `${t(`audit.entities.${entry.entityType}`)} · ${entry.entityLabel ?? '—'}`,
                      trailing: fmt.dateTime(entry.createdAt),
                    }))}
                  />
                </DetailSection>
              </MasonryItem>
            ) : null}
          </Masonry>
        </>
      )}
    </DetailState>
  )
}
