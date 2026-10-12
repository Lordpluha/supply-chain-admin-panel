import { useMutation, useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { hasPermission } from '@/entities/access'
import { useSession } from '@/entities/session'
import type { Identifiable } from '@/shared/api'
import type { FilterParsers } from '@/shared/lib/listQuery'
import { useListQuery } from '@/shared/lib/listQuery'
import { Button } from '@/shared/ui/button'
import { DataTable, DataTableToolbar } from '@/shared/ui/data-table'
import { ExportDialog } from '@/shared/ui/export-dialog'
import { useEntityExport } from '../lib/useEntityExport'
import type { EntityCrudConfig } from '../model/types'
import { DeleteDialog } from './DeleteDialog'
import { EntityFormDialog } from './EntityFormDialog'
import { EntityRowActions } from './EntityRowActions'

// Typed rather than inferred: a bare `{}` narrows `keyof F` to `never`,
// and the filter setter handed to the screen then accepts no key at all.
const NO_FILTERS: FilterParsers = {}

export interface EntityCrudPageProps<TEntity extends Identifiable, TCreate, TUpdate> {
  config: EntityCrudConfig<TEntity, TCreate, TUpdate>
}

export const EntityCrudPage = <TEntity extends Identifiable, TCreate, TUpdate>({
  config,
}: EntityCrudPageProps<TEntity, TCreate, TUpdate>) => {
  const { t } = useTranslation()
  const { subject } = useSession()
  const canWrite = hasPermission({ subject, permission: config.writePermission })

  const parsers = useMemo(() => config.filterParsers ?? NO_FILTERS, [config.filterParsers])
  const list = useListQuery(parsers)

  const [editing, setEditing] = useState<TEntity | null | undefined>(undefined)
  const [deleting, setDeleting] = useState<TEntity | null>(null)

  const rows = useQuery(config.queries.listOptions(list.query))

  const items = rows.data?.items ?? []
  const exporting = useEntityExport({
    rows: items,
    columns: config.exportColumns,
    fileName: config.exportFileName,
  })

  const create = useMutation(config.queries.createOptions())
  const update = useMutation(config.queries.updateOptions())
  const remove = useMutation(config.queries.removeOptions())

  const closeForm = () => setEditing(undefined)

  const submitForm = (values: TCreate) => {
    const onDone = (key: 'toast.created' | 'toast.updated') => () => {
      toast.success(t(key))
      closeForm()
    }

    if (editing) {
      update.mutate(
        { id: editing.id, input: values as unknown as TUpdate },
        { onSuccess: onDone('toast.updated') },
      )
      return
    }
    create.mutate(values, { onSuccess: onDone('toast.created') })
  }

  return (
    <>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="typo-h4 font-heading">{t(config.titleKey)}</h1>
          <p className="typo-body-sm text-muted-foreground">{t(config.descriptionKey)}</p>
        </div>

        {canWrite ? (
          <Button onClick={() => setEditing(null)}>
            <Plus aria-hidden="true" />
            {t('common.create')}
          </Button>
        ) : null}
      </header>

      <DataTable
        columns={config.columns}
        rows={items}
        state={{
          total: rows.data?.total ?? 0,
          page: list.page,
          pageSize: list.pageSize,
          sortBy: list.sortBy,
          sortDir: list.sortDir,
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
              filters={config.renderFilters?.({ values: list.filters, set: list.setFilter })}
              onReset={list.reset}
              isFiltered={list.isFiltered}
              onExport={exporting.onOpen}
              isExporting={exporting.isExporting}
            />
          ),
          rowActions:
            canWrite || config.detailLink
              ? row => (
                  <EntityRowActions
                    label={config.label(row)}
                    detail={config.detailLink?.(row)}
                    can={{ write: canWrite, delete: config.canDelete?.(row) ?? true }}
                    onEdit={() => setEditing(row)}
                    onDelete={() => setDeleting(row)}
                  />
                )
              : undefined,
        }}
      />

      <ExportDialog
        open={exporting.isOpen}
        isExporting={exporting.isExporting}
        rowCount={items.length}
        onExport={exporting.run}
        onCancel={exporting.close}
      />

      <EntityFormDialog
        open={editing !== undefined}
        titleKey={editing ? config.editTitleKey : config.createTitleKey}
        defaultValues={config.toFormValues(editing ?? null)}
        isPending={create.isPending || update.isPending}
        onSubmit={submitForm}
        onCancel={closeForm}
        Form={config.Form}
      />

      <DeleteDialog
        label={deleting ? config.label(deleting) : null}
        isPending={remove.isPending}
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          if (!deleting) return
          remove.mutate(deleting.id, {
            onSuccess: () => {
              toast.success(t('toast.deleted'))
              setDeleting(null)
            },
            // A 409 means the API refused for a stated reason; the global toast
            // already carried it, and the dialog stays open so the row is
            // still in front of the operator.
            onError: () => setDeleting(null),
          })
        }}
      />
    </>
  )
}
