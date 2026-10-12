import type { Meta, StoryObj } from '@storybook/tanstack-react'
import { Badge } from '@/shared/ui/badge'
import { Masonry, MasonryItem } from '@/shared/ui/masonry'
import { DetailFields } from './DetailFields'
import { DetailHeader } from './DetailHeader'
import { DetailList } from './DetailList'
import { DetailSection } from './DetailSection'
import { DetailState } from './DetailState'

const meta = {
  title: 'Data/Detail',
  component: DetailHeader,
  parameters: {
    docs: {
      description: {
        component:
          'The pieces a record page is assembled from. Fields are a `<dl>`, so a label and its value are announced as a term and its definition. Related records are a plain list, not a table: a handful of rows whose job is to be clicked through do not need sort, search and pagination chrome around them.',
      },
    },
  },
  args: { title: 'Germany' },
} satisfies Meta<typeof DetailHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Header: Story = {
  args: { title: '🇩🇪 Germany', description: 'Europe' },
}

export const Fields: Story = {
  render: () => (
    <DetailFields
      fields={[
        { label: 'ISO-2', value: <code className="typo-code">DE</code> },
        { label: 'ISO-3', value: <code className="typo-code">DEU</code> },
        { label: 'Region', value: <Badge variant="secondary">Europe</Badge> },
        { label: 'Latitude', value: '51.17' },
      ]}
    />
  ),
}

export const List: Story = {
  render: () => (
    <div className="max-w-sm">
      <DetailList
        items={[
          { id: '1', primary: 'Erfurt Cell Plant', secondary: 'Gigafactory', trailing: '120' },
          {
            id: '2',
            primary: 'Ludwigshafen Electrolyte',
            secondary: 'Plant',
            trailing: '34,000',
          },
          { id: '3', primary: 'Salzgitter Cathode Lab', secondary: 'Plant', trailing: '22,000' },
        ]}
      />
    </div>
  ),
}

export const EmptyList: Story = {
  render: () => (
    <div className="max-w-sm">
      <DetailList items={[]} />
    </div>
  ),
}

export const LoadingList: Story = {
  render: () => (
    <div className="max-w-sm">
      <DetailList items={[]} isLoading />
    </div>
  ),
}

/**
 * A finished request with no record says "not found" rather than showing a
 * blank page: an id in the address bar that resolves to nothing is a deleted
 * row or a mistyped link, and both deserve saying.
 */
export const NotFound: Story = {
  render: () => (
    <DetailState query={{ data: undefined, isLoading: false, isError: false }}>
      {() => null}
    </DetailState>
  ),
}

export const WholePage: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <DetailHeader title="🇩🇪 Germany" description="Europe" />

      <Masonry>
        <MasonryItem>
          <DetailSection title="Identifiers">
            <DetailFields
              fields={[
                { label: 'ISO-2', value: <code className="typo-code">DE</code> },
                { label: 'ISO-3', value: <code className="typo-code">DEU</code> },
              ]}
            />
          </DetailSection>
        </MasonryItem>

        <MasonryItem>
          <DetailSection title="Facilities">
            <DetailList
              items={[
                { id: '1', primary: 'Erfurt Cell Plant', secondary: 'Gigafactory' },
                { id: '2', primary: 'Salzgitter Cathode Lab', secondary: 'Plant' },
              ]}
            />
          </DetailSection>
        </MasonryItem>
      </Masonry>
    </div>
  ),
}
