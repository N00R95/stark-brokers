import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // Start with loading true
  const [error, setError] = useState(null)

  // Check for existing user session on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        // Verify token/session with backend
        const userData = JSON.parse(savedUser)
        // Simulate API call to verify user session
        await new Promise(resolve => setTimeout(resolve, 500))
        setUser(userData)
      }
    } catch (err) {
      console.error('Auth check failed:', err)
      localStorage.removeItem('user') // Clear invalid session
      setError('Session expired. Please login again.')
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    setLoading(true)
    setError(null)
    try {
      // Check if user exists
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')
      const existingUser = existingUsers.find(u => u.email === credentials.email)

      if (existingUser) {
        // User exists, update last login
        const userData = {
          ...existingUser,
          lastLogin: new Date().toISOString()
        }
        
        // Update users in storage
        const updatedUsers = existingUsers.map(u => 
          u.email === userData.email ? userData : u
        )
        localStorage.setItem('users', JSON.stringify(updatedUsers))
        
        // Set current user
        localStorage.setItem('user', JSON.stringify(userData))
        setUser(userData)
      } else {
        throw new Error('User not found')
      }
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    setLoading(true)
    setError(null)
    try {
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')
      if (existingUsers.some(u => u.email === userData.email)) {
        throw new Error('Email already registered')
      }

      // Create new user
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        fullName: userData.name,
        email: userData.email,
        phone: userData.phone,
        type: userData.type,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      }

      // Save to users list
      localStorage.setItem('users', JSON.stringify([...existingUsers, newUser]))
      
      // Set as current user
      localStorage.setItem('user', JSON.stringify(newUser))
      setUser(newUser)
      
      return newUser
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
    setError(null)
  }

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    checkAuth,
  }

  // Show loading state
  if (loading) {
    return <div>Loading...</div> // Or your loading component
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 