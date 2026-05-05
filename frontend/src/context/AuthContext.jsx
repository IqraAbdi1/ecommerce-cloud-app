import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [viewMode, setViewMode] = useState('customer')

  useEffect(() => {
    if (token) {
      const userData = localStorage.getItem('user')
      if (userData) {
        const parsed = JSON.parse(userData)
        setUser(parsed)
        setViewMode(parsed.role === 'admin' ? 'admin' : 'customer')
      }
    }
  }, [token])

  const login = (userData, userToken) => {
    setUser(userData)
    setToken(userToken)
    setViewMode(userData.role === 'admin' ? 'admin' : 'customer')
    localStorage.setItem('token', userToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    setViewMode('customer')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const isAdmin = () => user?.role === 'admin'
  const isAdminView = () => viewMode === 'admin'
  const toggleView = () => setViewMode(v => v === 'admin' ? 'customer' : 'admin')

  return (
    <AuthContext.Provider value={{
      user, token, login, logout,
      isAdmin, isAdminView, toggleView, viewMode
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)