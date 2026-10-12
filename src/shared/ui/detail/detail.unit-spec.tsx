import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/shared/lib/test-utils'
import { DetailFields } from './DetailFields'
import { DetailHeader } from './DetailHeader'
import { DetailList } from './DetailList'
import { DetailSection } from './DetailSection'
import { DetailState } from './DetailState'

describe('DetailHeader', () => {
  it('names the record as the page heading', () => {
    renderWithProviders(<DetailHeader title="Germany" description="Europe" />)

    expect(screen.getByRole('heading', { level: 1, name: 'Germany' })).toBeInTheDocument()
    expect(screen.getByText('Europe')).toBeInTheDocument()
  })

  it('renders the way back when given one', () => {
    renderWithProviders(
      <DetailHeader title="Germany" back={<a href="/countries">Back to Countries</a>} />,
    )

    expect(screen.getByRole('link', { name: 'Back to Countries' })).toBeInTheDocument()
  })
})

describe('DetailFields', () => {
  /**
   * A `<dl>`, not a grid of divs: the label and its value are a term and its
   * definition, and that is the difference between "Region Europe" and two
   * unrelated fragments.
   */
  it('pairs each label with its value as a definition list', () => {
    const { container } = renderWithProviders(
      <DetailFields
        fields={[
          { label: 'ISO-2', value: 'DE' },
          { label: 'Region', value: 'Europe' },
        ]}
      />,
    )

    expect(container.querySelector('dl')).toBeInTheDocument()
    expect(container.querySelectorAll('dt')).toHaveLength(2)
    expect(container.querySelectorAll('dd')).toHaveLength(2)
    expect(screen.getByText('ISO-2')).toBeInTheDocument()
    expect(screen.getByText('DE')).toBeInTheDocument()
  })
})

describe('DetailSection', () => {
  it('titles its block', () => {
    renderWithProviders(
      <DetailSection title="Facilities" description="In this country">
        <p>Erfurt Cell Plant</p>
      </DetailSection>,
    )

    expect(screen.getByText('Facilities')).toBeInTheDocument()
    expect(screen.getByText('In this country')).toBeInTheDocument()
    expect(screen.getByText('Erfurt Cell Plant')).toBeInTheDocument()
  })
})

describe('DetailList', () => {
  it('renders one entry per item', () => {
    renderWithProviders(
      <DetailList
        items={[
          { id: '1', primary: 'Erfurt Cell Plant', secondary: 'Gigafactory', trailing: '120' },
          { id: '2', primary: 'Salzgitter Cathode Lab' },
        ]}
      />,
    )

    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByText('Gigafactory')).toBeInTheDocument()
    expect(screen.getByText('120')).toBeInTheDocument()
  })

  it('says when there is nothing rather than showing an empty list', () => {
    renderWithProviders(<DetailList items={[]} />)

    expect(screen.getByText('Nothing recorded here yet.')).toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('announces the wait while loading', () => {
    const { container } = renderWithProviders(<DetailList items={[]} isLoading />)

    expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument()
  })
})

describe('DetailState', () => {
  it('renders the record once it is there', () => {
    renderWithProviders(
      <DetailState query={{ data: { name: 'Germany' }, isLoading: false, isError: false }}>
        {value => <p>{value.name}</p>}
      </DetailState>,
    )

    expect(screen.getByText('Germany')).toBeInTheDocument()
  })

  it('announces the wait while loading', () => {
    const { container } = renderWithProviders(
      <DetailState query={{ data: undefined, isLoading: true, isError: false }}>
        {() => <p>never</p>}
      </DetailState>,
    )

    expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument()
    expect(screen.queryByText('never')).not.toBeInTheDocument()
  })

  /**
   * A finished request with no record is a deleted row or a mistyped link, and
   * both deserve saying — a blank page says neither.
   */
  it('says "not found" for a finished request with nothing in it', () => {
    renderWithProviders(
      <DetailState query={{ data: undefined, isLoading: false, isError: false }}>
        {() => <p>never</p>}
      </DetailState>,
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Not found')).toBeInTheDocument()
  })

  it('says the same for a failed one', () => {
    renderWithProviders(
      <DetailState query={{ data: undefined, isLoading: false, isError: true }}>
        {() => <p>never</p>}
      </DetailState>,
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})
