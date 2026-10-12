import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/shared/lib/test-utils'
import { DetailFields } from './DetailFields'
import { DetailHeader } from './DetailHeader'
import { DetailList } from './DetailList'
import { DetailSection } from './DetailSection'

describe('Detail snapshots', () => {
  it('matches snapshot — header', () => {
    const { container } = renderWithProviders(<DetailHeader title="Germany" description="Europe" />)

    expect(container.firstChild).toMatchSnapshot()
  })

  it('matches snapshot — fields', () => {
    const { container } = renderWithProviders(
      <DetailFields
        fields={[
          { label: 'ISO-2', value: 'DE' },
          { label: 'Region', value: 'Europe' },
        ]}
      />,
    )

    expect(container.firstChild).toMatchSnapshot()
  })

  it('matches snapshot — section with a list', () => {
    const { container } = renderWithProviders(
      <DetailSection title="Facilities">
        <DetailList items={[{ id: '1', primary: 'Erfurt Cell Plant', secondary: 'Gigafactory' }]} />
      </DetailSection>,
    )

    expect(container.firstChild).toMatchSnapshot()
  })

  it('matches snapshot — empty list', () => {
    const { container } = renderWithProviders(<DetailList items={[]} />)

    expect(container.firstChild).toMatchSnapshot()
  })
})
