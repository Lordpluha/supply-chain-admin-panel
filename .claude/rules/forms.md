---
name: forms
description: Form conventions — react-hook-form with the zod resolver, schema co-location in the entity, how server field errors map back onto inputs, submit/pending states, and dialog-based CRUD forms. Use whenever building or reviewing a form.
globs:
  - "src/features/**"
  - "src/widgets/**"
  - "src/entities/*/model/*.schema.ts"
license: SEE LICENSE IN LICENSE
metadata:
  author: lordpluha
  version: "1.0.0"
---

# Forms

`react-hook-form` + `@hookform/resolvers/zod`. No other form library, no hand-rolled state.

## Every form goes through `<Form>`

`shared/ui/form.tsx` wraps the `<form>` element and attaches react-hook-form's devtools panel.
Using it means the devtools are never something a developer has to remember to add — and never
something they can accidentally ship.

```tsx
<Form control={form.control} onSubmit={form.handleSubmit(submit)}>
  <Field label={t('countries.name')} error={errors.name?.message} required>
    {props => <Input {...props} {...register('name')} />}
  </Field>
</Form>
```

`noValidate` is set: the browser's own bubbles are unstyled, untranslated, and would pre-empt
the messages `Field` renders.

### The devtools compile away

`FormDevtools` guards on a bare `import.meta.env.DEV`. Vite replaces that with a literal
`false` in a production build, so the ternary collapses to `null`, the dynamic `import()` is
unreachable, and `@hookform/devtools` never enters the bundle. Verified by grepping
`dist/client` after a build: zero occurrences.

**Keep the check literal.** Hoisting it into a variable, a constant, or a helper defeats the
static replacement and the dependency ships to production.

## Schema co-location

A form validates against **the entity's schema**, imported from its barrel. It does not restate
the shape:

```ts
import { countryCreateSchema } from '@/entities/country'

const form = useForm({
  resolver: zodResolver(countryCreateSchema),
  defaultValues,
})
```

A feature declares its own schema only for a shape no entity owns — a filter bar, a search box.

## The same schema runs on both ends

The mock API parses the request body with the *same* schema object. A rule added in one place
therefore applies in both, and the two can never drift.

## Server errors map back onto fields

The API returns `{ message, fields: { name: 'Too short' } }` on a `400`. Replay those onto the
form rather than dropping them into a toast:

```ts
if (error instanceof ApiError && error.body?.fields) {
  for (const [field, message] of Object.entries(error.body.fields)) {
    form.setError(field as keyof FormValues, { message })
  }
}
```

A message with no field goes to the form-level error slot.

## Validation messages are translated

The message lives in the schema, but what renders is a `t()` lookup. Schema messages are keys
or short English defaults; never ship an untranslated sentence to a French operator.

## Pending state

The submit button is disabled and shows `common.saving` while the mutation is in flight. The
form is never submitted twice; `isPending` from the mutation is the single source for that.

## Numbers

Use `z.coerce.number()` — an `<input type="number">` yields a string. Never `parseFloat` by
hand in an `onChange`.

## CRUD dialogs

Create and edit share one form component; the difference is `defaultValues` and which mutation
it calls. The dialog owns open/closed state, the form owns field state, the mutation owns
submission. Three responsibilities, three owners.

On success: close the dialog, show the toast, and let `meta.invalidates` refresh the list.
Never refetch by hand.
