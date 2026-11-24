import { createContext, useContext, useState } from 'react'
import { Navigate } from 'react-router-dom'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))

  function login(newToken) {
    localStorage.setItem('token', newToken)
    setToken(newToken)
  }

  function logout() {
    localStorage.removeItem('token')
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth мора да се користи внатре во AuthProvider')
  return ctx
}

// Ги штити страните што бараат најавен корисник (Dashboard, Log Food, Chat, итн.)
export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return children
}
