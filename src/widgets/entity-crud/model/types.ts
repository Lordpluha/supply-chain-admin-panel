import type { ParseKeys } from 'i18next'
import type { ReactNode } from 'react'
import type { Permission } from '@/entities/access'
import type { CrudQueries, Identifiable } from '@/shared/api'
import type { ExportColumn } from '@/shared/lib/export'
import type { FilterParsers } from '@/shared/lib/listQuery'
import type { DataColumn } from '@/shared/ui/data-table'

export interface EntityFormProps<TInput> {
  defaultValues: Partial<TInput>
  isPending: boolean
  onSubmit: (values: TInput) => void
  onCancel: () => void
}

export interface EntityFilterSlot {
  values: Record<string, string>
  set: (key: string, value: string | null) => void
}

/**
 * Everything one CRUD screen needs, expressed as data.
 *
 * A new entity screen is a config object: the table, the toolbar, the dialogs,
 * the export, the permission gating and the delete confirmation are written
 * once in `EntityCrudPage` and never again. This is the same closed-for-
 * modification shape as `createCrudService` and `createResourceHandlers`.
 */
export interface EntityCrudConfig<TEntity extends Identifiable, TCreate, TUpdate> {
  titleKey: ParseKeys
  descriptionKey: ParseKeys
  createTitleKey: ParseKeys
  editTitleKey: ParseKeys

  queries: CrudQueries<TEntity, TCreate, TUpdate>
  readPermission: Permission
  writePermission: Permission

  columns: ReadonlyArray<DataColumn<TEntity>>

  /** Entity-specific narrowing, held in the URL alongside search and sort. */
  filterParsers?: FilterParsers
  renderFilters?: (slot: EntityFilterSlot) => ReactNode

  /** Omit to leave the screen without an export button. */
  exportColumns?: ReadonlyArray<ExportColumn<TEntity>>
  exportFileName?: string

  /**
   * A link to the row's own page, rendered as the first row action.
   *
   * Supplied as a node rather than a route name so the config stays out of
   * the router's typed-path business — each screen knows its own route and
   * gets `params` checked at its own call site.
   */
  detailLink?: (row: TEntity) => ReactNode

  /**
   * Whether this particular row may be deleted.
   *
   * The API refuses some deletes for reasons that are properties of the row —
   * a built-in role is the panel's own scaffolding. Offering a button that is
   * always refused is a worse answer than not offering it.
   */
  canDelete?: (row: TEntity) => boolean

  /** Names the row in the delete confirmation, so nothing goes unseen. */
  label: (row: TEntity) => string
  toFormValues: (row: TEntity | null) => Partial<TCreate>
  Form: (props: EntityFormProps<TCreate>) => ReactNode
}
