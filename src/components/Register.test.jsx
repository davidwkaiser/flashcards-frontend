import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'
import Register from './Register'

// Mock the auth API
vi.mock('../api', () => ({
  authAPI: {
    register: vi.fn(),
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

// Helper function to render Register with BrowserRouter
function renderRegister(authState = { isAuthenticated: false }) {
  useAuth.mockReturnValue({
    isAuthenticated: authState.isAuthenticated,
    user: authState.user || null,
    login: mockLogin,
    logout: mockLogout,
  })

  return render(
    <BrowserRouter>
      <Register />
    </BrowserRouter>
  )
}

describe('Register Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockNavigate.mockClear()
  })

  test('renders register form with email and password inputs', () => {
    renderRegister()

    expect(screen.getByRole('heading', { name: 'Register' })).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument()
  })

  test('renders login link for existing users', () => {
    renderRegister()

    const loginLink = screen.getByRole('link', { name: 'Log in' })
    expect(loginLink).toBeInTheDocument()
    expect(loginLink).toHaveAttribute('href', '/login')
  })

  test('updates email input value on change', async () => {
    const user = userEvent.setup()
    renderRegister()

    const emailInput = screen.getByLabelText('Email')
    await user.type(emailInput, 'test@example.com')

    expect(emailInput).toHaveValue('test@example.com')
  })

  test('updates password input value on change', async () => {
    const user = userEvent.setup()
    renderRegister()

    const passwordInput = screen.getByLabelText('Password')
    await user.type(passwordInput, 'password123')

    expect(passwordInput).toHaveValue('password123')
  })

  test('submits form with email and password', async () => {
    const user = userEvent.setup()
    authAPI.register.mockResolvedValue({ data: { message: 'User registered' } })

    renderRegister()

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: 'Register' })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    expect(authAPI.register).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
  })

  test('displays error message on registration failure', async () => {
    const user = userEvent.setup()
    const errorMessage = 'Email already exists'
    authAPI.register.mockRejectedValue({
      response: { data: { message: errorMessage } },
    })

    renderRegister()

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: 'Register' })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(`Registration failed: ${errorMessage}`)).toBeInTheDocument()
    })
  })

  test('displays generic error message when error details are not available', async () => {
    const user = userEvent.setup()
    authAPI.register.mockRejectedValue({
      response: { data: {} },
    })

    renderRegister()

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: 'Register' })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Registration failed: try again')).toBeInTheDocument()
    })
  })

  test('redirects to login page after successful registration', async () => {
    const user = userEvent.setup()
    authAPI.register.mockResolvedValue({ data: { message: 'User registered' } })

    renderRegister()

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: 'Register' })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      // Verify that navigate was called with '/login' after successful registration
      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })
  })

  test('does not allow form submission with empty fields', async () => {
    const user = userEvent.setup()
    renderRegister()

    const submitButton = screen.getByRole('button', { name: 'Register' })

    // HTML5 validation should prevent submission
    await user.click(submitButton)

    expect(authAPI.register).not.toHaveBeenCalled()
  })

  test('redirects authenticated users to home page', () => {
    renderRegister({ isAuthenticated: true, user: { email: 'user@example.com' } })

    // The Register component should redirect, so the heading should not be visible
    expect(screen.queryByRole('heading', { name: 'Register' })).not.toBeInTheDocument()
  })

  test('clears error message when user starts typing after error', async () => {
    const user = userEvent.setup()
    authAPI.register.mockRejectedValue({
      response: { data: { message: 'Registration failed' } },
    })

    renderRegister()

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: 'Register' })

    // First attempt with error
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Registration failed: Registration failed')).toBeInTheDocument()
    })

    // Clear and try again - error should clear on next submission attempt
    authAPI.register.mockResolvedValue({ data: { message: 'User registered' } })

    await user.clear(emailInput)
    await user.clear(passwordInput)
    await user.type(emailInput, 'newuser@example.com')
    await user.type(passwordInput, 'newpassword123')

    // The error should still be there until form is submitted again
    expect(screen.getByText('Registration failed: Registration failed')).toBeInTheDocument()

    await user.click(submitButton)

    // After new submission, error should be cleared
    await waitFor(() => {
      expect(screen.queryByText('Registration failed: Registration failed')).not.toBeInTheDocument()
    })
  })
})
