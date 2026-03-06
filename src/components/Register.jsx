import { useState } from 'react'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import { authAPI } from '../api'
import { useAuth } from '../auth'
import './Register.css'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  // if already logged in, send home
  const auth = useAuth()
  if (auth.isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      await authAPI.register({ email, password })
      setSuccess(true)
      // after a short delay or immediately navigate to login
      navigate('/login')
    } catch (err) {
      setError('Registration failed: ' + (err.response?.data?.message || 'try again'))
      console.error(err)
    }
  }

  return (
    <div className="auth-container">
      <h2>Register</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  )
}
