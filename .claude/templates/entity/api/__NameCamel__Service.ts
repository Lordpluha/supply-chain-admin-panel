import type { CrudService, HttpClient } from '@/shared/api'
import { createCrudService, httpClient } from '@/shared/api'
import type {
  __NamePascal__,
  __NamePascal__CreateInput,
  __NamePascal__UpdateInput,
} from '../model/__NameCamel__.schema'

export type __NamePascal__Service = CrudService<
  __NamePascal__,
  __NamePascal__CreateInput,
  __NamePascal__UpdateInput
>

export const create__NamePascal__Service = (http: HttpClient = httpClient): __NamePascal__Service =>
  createCrudService({ http, resource: '__NameKebab__s' })

export const __NameCamel__Service = create__NamePascal__Service()
