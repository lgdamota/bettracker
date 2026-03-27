'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { auth, AuthState, User, authUtils } from '@/lib/auth'

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false
  })

  useEffect(() => {
    // Verifica autenticação ao montar o componente
    const authState = auth.checkAuth()
    setState(authState)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const user = authUtils.validateLogin(email, password)
      if (user) {
        auth.login(user)
        setState({
          user,
          isAuthenticated: true
        })
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const user = authUtils.registerUser(name, email, password)
      if (user) {
        auth.login(user)
        setState({
          user,
          isAuthenticated: true
        })
        return true
      }
      return false
    } catch (error) {
      console.error('Register error:', error)
      return false
    }
  }

  const logout = () => {
    auth.logout()
    setState({
      user: null,
      isAuthenticated: false
    })
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}