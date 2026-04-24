import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import App from './App'

// Mock the auth context to avoid authentication issues in tests
vi.mock('./auth', () => ({
  AuthProvider: ({ children }) => <div>{children}</div>,
  useAuth: () => ({
    isAuthenticated: true,
    user: { username: 'testuser' },
    login: vi.fn(),
    logout: vi.fn(),
  }),
}))

test('renders the app without crashing', () => {
  render(<App />)

  // Check that the app header is rendered
  expect(screen.getByText('📚 Flashcards API')).toBeInTheDocument()
})