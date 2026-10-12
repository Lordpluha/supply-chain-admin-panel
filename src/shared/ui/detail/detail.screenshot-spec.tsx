import { describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { renderWithProviders } from '@/shared/lib/test-utils'
import { Masonry, MasonryItem } from '../masonry'
import { DetailFields } from './DetailFields'
import { DetailHeader } from './DetailHeader'
import { DetailList } from './DetailList'
import { DetailSection } from './DetailSection'

/**
 * A whole record page: header, fields as a definition list, and the related
 * records hanging off it. The baseline lands in `__screenshots__` on the first
 * run — see DEPLOYMENT.md on why that has never happened here.
 */
describe('Detail screenshots', () => {
  it('renders a record page', async () => {
    renderWithProviders(
      <div data-testid="subject" className="flex w-[48rem] flex-col gap-6 p-4">
        <DetailHeader title="🇩🇪 Germany" description="Europe" />

        <Masonry>
          <MasonryItem>
            <DetailSection title="Identifiers">
              <DetailFields
                fields={[
                  { label: 'ISO-2', value: 'DE' },
                  { label: 'ISO-3', value: 'DEU' },
                  { label: 'Region', value: 'Europe' },
                ]}
              />
            </DetailSection>
          </MasonryItem>

          <MasonryItem>
            <DetailSection title="Facilities">
              <DetailList
                items={[
                  {
                    id: '1',
                    primary: 'Erfurt Cell Plant',
                    secondary: 'Gigafactory',
                    trailing: '120',
                  },
                  {
                    id: '2',
                    primary: 'Salzgitter Cathode Lab',
                    secondary: 'Plant',
                    trailing: '22,000',
                  },
                ]}
              />
            </DetailSection>
          </MasonryItem>
        </Masonry>
      </div>,
    )

    await expect(page.getByTestId('subject')).toMatchScreenshot()
  })
})
