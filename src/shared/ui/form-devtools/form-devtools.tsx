import { lazy, Suspense } from 'react'
import type { Control, FieldValues } from 'react-hook-form'

/**
 * react-hook-form's devtools panel, in development only.
 *
 * `import.meta.env.DEV` is replaced with a literal `false` by Vite at build
 * time, so in production this collapses to `const DevTool = null`, the dynamic
 * `import()` becomes unreachable, and `@hookform/devtools` is dropped from the
 * bundle entirely — not merely tree-shaken down, but never pulled in.
 *
 * Keep the check a bare `import.meta.env.DEV`: wrapping it in a variable or a
 * helper defeats the static replacement and the dependency ships.
 */
const DevTool = import.meta.env.DEV
  ? lazy(async () => {
      const devtools = await import('@hookform/devtools')
      return { default: devtools.DevTool }
    })
  : null

export interface FormDevtoolsProps<T extends FieldValues> {
  control: Control<T>
}

export const FormDevtools = <T extends FieldValues>({ control }: FormDevtoolsProps<T>) => {
  if (!DevTool) return null

  return (
    <Suspense fallback={null}>
      {/* The panel's own `control` type is invariant across RHF generics. */}
      <DevTool control={control as never} />
    </Suspense>
  )
}
