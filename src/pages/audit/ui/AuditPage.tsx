import { useQuery } from '@tanstack/react-query'
import { parseAsString } from 'nuqs'
import { useTranslation } from 'react-i18next'
import { hasPermission } from '@/entities/access'
import type { AuditEntry } from '@/entities/audit-entry'
import { AUDIT_ACTIONS, AUDIT_ENTITY_TYPES, auditEntryQueries } from '@/entities/audit-entry'
import { useSession } from '@/entities/session'
import { useListQuery } from '@/shared/lib/listQuery'
import { useFormatters } from '@/shared/lib/useFormatters'
import { Badge } from '@/shared/ui/badge'
import type { DataColumn } from '@/shared/ui/data-table'
import { DataTable, DataTableToolbar } from '@/shared/ui/data-table'
import { DatePicker } from '@/shared/ui/date-input'
import { ExportDialog } from '@/shared/ui/export-dialog'
import { FilterField } from '@/shared/ui/filter-field'
import { OptionSelect } from '@/shared/ui/option-select'
import { useEntityExport } from '@/widgets/entity-crud'

const filterParsers = {
  action: parseAsString.withDefault(''),
  entityType: parseAsString.withDefault(''),
  dateFrom: parseAsString.withDefault(''),
  dateTo: parseAsString.withDefault(''),
}

/**
 * Read-only by construction. There is no create, edit or delete here — and no
 * endpoint behind one either — because an audit trail somebody can change is
 * not an audit trail. That is why this screen does not use `EntityCrudPage`.
 */
export const AuditPage = () => {
  const { t } = useTranslation()
  const fmt = useFormatters()
  const list = useListQuery(filterParsers)
  const { subject } = useSession()

  // The API masks the address for anyone without this, so the column would
  // otherwise be a row of dashes rather than a hidden fact.
  const canSeeIp = hasPermission({ subject, permission: 'audit-ip:read' })

  const rows = useQuery(
    auditEntryQueries.listOptions({ sortBy: 'createdAt', sortDir: 'desc', ...list.query }),
  )

  const items = rows.data?.items ?? []

  /**
   * The trail is read-only, but taking a copy of it is not a change — an
   * auditor asked for a filtered window of it, in whatever their tools read.
   * The IP column is omitted for anyone who may not see it, exactly as on
   * screen: the API has already masked it, so the file cannot leak what the
   * table would not show.
   */
  const exporting = useEntityExport({
    rows: items,
    fileName: 'activity-log',
    columns: [
      { header: t('audit.when'), value: row => row.createdAt },
      { header: t('audit.actor'), value: row => row.actorName },
      { header: t('audit.action'), value: row => t(`audit.actions.${row.action}`) },
      { header: t('audit.entityType'), value: row => t(`audit.entities.${row.entityType}`) },
      { header: t('audit.entity'), value: row => row.entityLabel },
      ...(canSeeIp ? [{ header: t('audit.ip'), value: (row: AuditEntry) => row.ipAddress }] : []),
    ],
  })

  const ipColumn: DataColumn<AuditEntry> = {
    id: 'ipAddress',
    header: t('audit.ip'),
    cell: row => <code className="typo-code">{row.ipAddress ?? '—'}</code>,
    secondary: true,
  }

  const columns: ReadonlyArray<DataColumn<AuditEntry>> = [
    {
      id: 'createdAt',
      header: t('audit.when'),
      cell: row => fmt.dateTime(row.createdAt),
      sortable: true,
    },
    { id: 'actorName', header: t('audit.actor'), cell: row => row.actorName, sortable: true },
    {
      id: 'action',
      header: t('audit.action'),
      cell: row => <Badge variant="secondary">{t(`audit.actions.${row.action}`)}</Badge>,
      sortable: true,
    },
    {
      id: 'entityType',
      header: t('audit.entityType'),
      cell: row => t(`audit.entities.${row.entityType}`),
      sortable: true,
      secondary: true,
    },
    {
      id: 'entityLabel',
      header: t('audit.entity'),
      cell: row => <span className="text-muted-foreground">{row.entityLabel ?? '—'}</span>,
    },
    ...(canSeeIp ? [ipColumn] : []),
  ]

  return (
    <>
      <header className="flex flex-col gap-1">
        <h1 className="typo-h4 font-heading">{t('audit.title')}</h1>
        <p className="typo-body-sm text-muted-foreground">{t('audit.description')}</p>
      </header>

      <DataTable
        columns={columns}
        rows={items}
        state={{
          total: rows.data?.total ?? 0,
          page: list.page,
          pageSize: list.pageSize,
          sortBy: list.sortBy || 'createdAt',
          sortDir: list.sortBy ? list.sortDir : 'desc',
          isLoading: rows.isLoading,
          isError: rows.isError,
        }}
        actions={{
          onSort: list.toggleSort,
          onPage: list.setPage,
          onPageSize: list.setPageSize,
        }}
        slots={{
          toolbar: (
            <DataTableToolbar
              search={list.search}
              onSearch={list.setSearch}
              onReset={list.reset}
              isFiltered={list.isFiltered}
              onExport={exporting.onOpen}
              isExporting={exporting.isExporting}
              filters={
                <>
                  <FilterField label={t('audit.dateFrom')} htmlFor="audit-date-from">
                    <DatePicker
                      id="audit-date-from"
                      value={list.filters.dateFrom}
                      max={list.filters.dateTo || undefined}
                      onValueChange={value => list.setFilter('dateFrom', value || null)}
                    />
                  </FilterField>
                  <FilterField label={t('audit.dateTo')} htmlFor="audit-date-to">
                    <DatePicker
                      id="audit-date-to"
                      value={list.filters.dateTo}
                      // The ends cannot cross, the same guarantee the band
                      // filters give by not offering the impossible option.
                      min={list.filters.dateFrom || undefined}
                      onValueChange={value => list.setFilter('dateTo', value || null)}
                    />
                  </FilterField>
                  <FilterField label={t('audit.action')}>
                    <OptionSelect
                      className="w-40"
                      aria-label={t('audit.action')}
                      value={list.filters.action}
                      onChange={value => list.setFilter('action', value || null)}
                      allLabel={t('common.selectAll')}
                      options={AUDIT_ACTIONS.map(action => ({
                        value: action,
                        label: t(`audit.actions.${action}`),
                      }))}
                    />
                  </FilterField>
                  <FilterField label={t('audit.entityType')}>
                    <OptionSelect
                      className="w-44"
                      aria-label={t('audit.entityType')}
                      value={list.filters.entityType}
                      onChange={value => list.setFilter('entityType', value || null)}
                      allLabel={t('common.selectAll')}
                      options={AUDIT_ENTITY_TYPES.map(type => ({
                        value: type,
                        label: t(`audit.entities.${type}`),
                      }))}
                    />
                  </FilterField>
                </>
              }
            />
          ),
        }}
      />

      <ExportDialog
        open={exporting.isOpen}
        isExporting={exporting.isExporting}
        rowCount={items.length}
        onExport={exporting.run}
        onCancel={exporting.close}
      />
    </>
  )
}
