import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/shared/lib/test-utils'
import { FormActions } from './form-actions'

describe('FormActions snapshots', () => {
  it.each([false, true])('matches snapshot — pending: %s', isPending => {
    const { container } = renderWithProviders(
      <FormActions isPending={isPending} onCancel={() => {}} />,
    )

    expect(container.firstChild).toMatchSnapshot()
  })
})
