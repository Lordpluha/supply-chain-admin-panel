import type { Translation } from '../en'
import { admin } from './admin'
import { auth } from './auth'
import { catalogue } from './catalogue'
import { dashboard } from './dashboard'
import { ui } from './ui'

export const fr: Translation = {
  ...ui,
  ...auth,
  ...dashboard,
  ...catalogue,
  ...admin,
}
