import { useState } from 'react'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import { authAPI } from '../api'
import { useAuth } from '../auth'
import './Login.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const auth = useAuth()

  if (auth.isAuthenticated) {
    // already logged in
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const resp = await authAPI.login({ email, password })
      const token = resp.data.token || resp.data
      auth.login(token)
      navigate('/')
    } catch (err) {
      setError('Login failed: check credentials')
      console.error(err)
    }
  }

  return (
    <div className="auth-container">
      <h2>Log In</h2>
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
        <button type="submit">Log In</button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  )
}
