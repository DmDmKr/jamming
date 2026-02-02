import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ErrorBoundary from '../components/ErrorBoundary'

const ThrowError = () => {
  throw new Error('Test error')
}

const WorkingComponent = () => <div>Working Component</div>

describe('ErrorBoundary tests', () => {
  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <WorkingComponent />
      </ErrorBoundary>
    )

    expect(screen.getByText('Working Component')).toBeInTheDocument()
  })

  it('should display fallback UI when child component throws error', () => {
    const consoleError = console.error
    console.error = vi.fn()

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    expect(screen.getByText(/test error/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reload page/i })).toBeInTheDocument()

    console.error = consoleError
  })
})
