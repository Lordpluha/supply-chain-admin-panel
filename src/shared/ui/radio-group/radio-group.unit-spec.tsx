import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Radio, RadioGroup } from './radio-group'

const renderGroup = (defaultValue = 'xlsx') =>
  render(
    <RadioGroup defaultValue={defaultValue} aria-label="File format">
      {['xlsx', 'xls', 'csv'].map(option => (
        // biome-ignore lint/a11y/noLabelWithoutControl: the radio is the control
        <label key={option}>
          <Radio value={option} />
          <span>.{option}</span>
        </label>
      ))}
    </RadioGroup>,
  )

describe('RadioGroup', () => {
  it('is a radiogroup with the name it is given', () => {
    renderGroup()

    expect(screen.getByRole('radiogroup', { name: 'File format' })).toBeInTheDocument()
  })

  it('renders one radio per option', () => {
    renderGroup()

    expect(screen.getAllByRole('radio')).toHaveLength(3)
  })

  it('checks the default and only the default', () => {
    renderGroup('xls')

    const [xlsx, xls, csv] = screen.getAllByRole('radio')
    expect(xlsx).not.toBeChecked()
    expect(xls).toBeChecked()
    expect(csv).not.toBeChecked()
  })
})
