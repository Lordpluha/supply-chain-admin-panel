import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from './combobox'

interface Option {
  value: string
  label: string
}

const COUNTRIES: ReadonlyArray<Option> = [
  { value: 'de', label: 'Germany' },
  { value: 'cl', label: 'Chile' },
  { value: 'cn', label: 'China' },
]

const Harness = () => {
  const [value, setValue] = useState<Option | null>(null)

  return (
    <Combobox
      items={COUNTRIES}
      value={value}
      onValueChange={next => setValue((next as Option) ?? null)}
      itemToStringLabel={item => (item as Option | null)?.label ?? ''}
    >
      <ComboboxInput aria-label="Country" placeholder="Any country" />
      <ComboboxContent>
        <ComboboxEmpty>Nothing matches</ComboboxEmpty>
        <ComboboxList>
          {(item: Option) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

describe('Combobox integration', () => {
  it('opens from its trigger and offers everything', async () => {
    render(<Harness />)

    await userEvent.click(screen.getByRole('button'))

    await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(3))
  })

  it('narrows the list as the operator types', async () => {
    render(<Harness />)

    await userEvent.type(screen.getByRole('combobox'), 'chi')

    await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(2))
    expect(screen.getByRole('option', { name: 'Chile' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'China' })).toBeInTheDocument()
  })

  it('says so when nothing matches', async () => {
    render(<Harness />)

    await userEvent.type(screen.getByRole('combobox'), 'zzz')

    await waitFor(() => expect(screen.getByText('Nothing matches')).toBeInTheDocument())
  })

  it('writes the chosen label into the field', async () => {
    render(<Harness />)

    await userEvent.click(screen.getByRole('button'))
    await userEvent.click(await screen.findByRole('option', { name: 'Germany' }))

    await waitFor(() => expect(screen.getByRole('combobox')).toHaveValue('Germany'))
  })
})
