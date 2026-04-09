'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { auth, AuthState, AppUser, authUtils } from '@/lib/auth'

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    session: null
  })

  useEffect(() => {
    // Verifica autenticação ao montar o componente
    const initializeAuth = async () => {
      const authState = await auth.checkAuth()
      setState(authState)
    }
    
    initializeAuth()

    // Escuta mudanças de autenticação
    const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const user = await auth.getCurrentUser()
        setState({
          user,
          isAuthenticated: true,
          session
        })
      } else if (event === 'SIGNED_OUT') {
        setState({
          user: null,
          isAuthenticated: false,
          session: null
        })
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await authUtils.login(email, password)
      if (result.user && !result.error) {
        setState({
          user: result.user,
          isAuthenticated: true,
          session: await auth.getSession()
        })
        return { success: true }
      }
      return { success: false, error: result.error || 'Credenciais inválidas' }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Erro ao realizar login' }
    }
  }

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await authUtils.register(name, email, password)
      if (result.user && !result.error) {
        setState({
          user: result.user,
          isAuthenticated: true,
          session: await auth.getSession()
        })
        return { success: true }
      }
      return { success: false, error: result.error || 'Erro ao criar conta' }
    } catch (error) {
      console.error('Register error:', error)
      return { success: false, error: 'Erro ao criar conta' }
    }
  }

  const logout = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await authUtils.logout()
      if (!result.error) {
        setState({
          user: null,
          isAuthenticated: false,
          session: null
        })
        return { success: true }
      }
      return { success: false, error: result.error }
    } catch (error) {
      console.error('Logout error:', error)
      return { success: false, error: 'Erro ao realizar logout' }
    }
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
