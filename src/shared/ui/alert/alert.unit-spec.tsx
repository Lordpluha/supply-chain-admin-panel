import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Alert, AlertDescription, AlertTitle } from './alert'

describe('Alert', () => {
  /** The role is implicit on the element, so assistive tech announces it. */
  it('is an alert to assistive technology', () => {
    render(
      <Alert>
        <AlertTitle>Not found</AlertTitle>
      </Alert>,
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('renders a title and a description', () => {
    render(
      <Alert>
        <AlertTitle>Mixed units</AlertTitle>
        <AlertDescription>There is no honest grand total.</AlertDescription>
      </Alert>,
    )

    expect(screen.getByText('Mixed units')).toBeInTheDocument()
    expect(screen.getByText('There is no honest grand total.')).toBeInTheDocument()
  })

  it('applies the destructive variant', () => {
    render(
      <Alert variant="destructive">
        <AlertTitle>Broken</AlertTitle>
      </Alert>,
    )

    expect(screen.getByRole('alert')).toHaveClass('text-destructive')
  })

  it('works without an icon', () => {
    render(
      <Alert>
        <AlertTitle>Built-in role</AlertTitle>
      </Alert>,
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})
