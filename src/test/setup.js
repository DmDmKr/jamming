import '@testing-library/jest-dom'

// Mock global fetch
global.fetch = vi.fn()

// Setup localStorage for tests
beforeEach(() => {
  // Set up valid token in localStorage before each test
  localStorage.setItem('spotify_access_token', 'mock-token')
  localStorage.setItem('spotify_token_expires_at', String(Date.now() + 3600000))

  global.fetch.mockReset()
})

afterEach(() => {
  localStorage.clear()
})
