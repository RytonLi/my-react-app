import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the hero heading', () => {
    render(<App />)
    expect(screen.getByText('Get started')).toBeTruthy()
  })

  it('updates the count when the button is clicked', () => {
    render(<App />)

    const button = screen.getByRole('button', { name: /count is 0/i })
    fireEvent.click(button)

    expect(screen.getByRole('button', { name: /count is 1/i })).toBeTruthy()
  })
})
