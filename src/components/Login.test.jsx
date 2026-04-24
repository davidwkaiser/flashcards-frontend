import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'
import Login from './Login'

// Mock the auth API
vi.mock('../api', () => ({
  authAPI: {
    login: vi.fn(),
  },
}))

// Mock the auth context
const mockLogout = vi.fn()
const mockLogin = vi.fn()

vi.mock('../auth', () => ({
  useAuth: vi.fn(),
}))

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

import { useAuth } from '../auth'
import { authAPI } from '../api'

// Helper function to render Login with BrowserRouter
function renderLogin(authState = { isAuthenticated: false }) {
  useAuth.mockReturnValue({
    isAuthenticated: authState.isAuthenticated,
    user: authState.user || null,
    login: mockLogin,
    logout: mockLogout,
  })

  return render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  )
}

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockNavigate.mockClear()
  })

  test('renders register link for new users', () => {
    renderLogin()

    const registerLink = screen.getByRole('link', { name: 'Register' })
    expect(registerLink).toBeInTheDocument()
    expect(registerLink).toHaveAttribute('href', '/register')
  })

  test('calls auth.login with token from response', async () => {
    const user = userEvent.setup()
    const testToken = 'test-jwt-token-xyz'
    authAPI.login.mockResolvedValue({ data: { token: testToken } })

    renderLogin()

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: 'Log In' })

    await user.type(emailInput, 'user@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(testToken)
    })
  })

  test('handles token response when token is directly in data', async () => {
    const user = userEvent.setup()
    const testToken = 'direct-token-response'
    authAPI.login.mockResolvedValue({ data: testToken })

    renderLogin()

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: 'Log In' })

    await user.type(emailInput, 'user@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(testToken)
    })
  })

  test('navigates to home page after successful login', async () => {
    const user = userEvent.setup()
    authAPI.login.mockResolvedValue({ data: { token: 'test-token-123' } })

    renderLogin()

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: 'Log In' })

    await user.type(emailInput, 'user@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  test('does not call auth.login or navigate on failed login', async () => {
    const user = userEvent.setup()
    authAPI.login.mockRejectedValue(new Error('Invalid credentials'))

    renderLogin()

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: 'Log In' })

    await user.type(emailInput, 'user@example.com')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Login failed: check credentials')).toBeInTheDocument()
    })

    expect(mockLogin).not.toHaveBeenCalled()
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
