import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

// helper for decoding JWT payload (very simple base64 parse)
function decodeToken(token) {
  try {
    const payload = token.split('.')[1]
    const decoded = atob(payload)
    return JSON.parse(decoded)
  } catch (err) {
    return null
  }
}

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState(() => (token ? decodeToken(token) : null))

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      setUser(decodeToken(token))
    } else {
      localStorage.removeItem('token')
      setUser(null)
    }
  }, [token])

  const login = (tokenValue) => {
    setToken(tokenValue)
  }
  const logout = () => {
    setToken(null)
  }

  const isAuthenticated = !!token

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
