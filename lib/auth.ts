// Tipos de autenticação
import { createClient, Session } from '@supabase/supabase-js'

export interface AppUser {
  id: string
  name: string
  email: string
}

export interface AuthState {
  user: AppUser | null
  isAuthenticated: boolean
  session: Session | null
}

// Inicializa o cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Funções de autenticação com Supabase
export const auth = {
  // Login com Supabase
  login: async (email: string, password: string): Promise<{ user: AppUser | null; error: string | null }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        return { user: null, error: error.message }
      }

      if (data.user) {
        const userData: AppUser = {
          id: data.user.id,
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || '',
          email: data.user.email || ''
        }
        
        return { user: userData, error: null }
      }

      return { user: null, error: 'Usuário não encontrado' }
    } catch (error) {
      return { user: null, error: 'Erro ao realizar login' }
    }
  },

  // Registro com Supabase
  register: async (name: string, email: string, password: string): Promise<{ user: AppUser | null; error: string | null }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      })

      if (error) {
        return { user: null, error: error.message }
      }

      if (data.user) {
        const userData: AppUser = {
          id: data.user.id,
          name: name,
          email: data.user.email || ''
        }
        
        return { user: userData, error: null }
      }

      return { user: null, error: 'Erro ao criar conta' }
    } catch (error) {
      return { user: null, error: 'Erro ao criar conta' }
    }
  },

  // Logout
  logout: async (): Promise<{ error: string | null }> => {
    try {
      const { error } = await supabase.auth.signOut()
      return { error: error?.message || null }
    } catch (error) {
      return { error: 'Erro ao realizar logout' }
    }
  },

  // Verifica se o usuário está autenticado
  isAuthenticated: async (): Promise<boolean> => {
    try {
      const { data } = await supabase.auth.getSession()
      return !!data.session
    } catch {
      return false
    }
  },

  // Obtém os dados do usuário atual
  getCurrentUser: async (): Promise<AppUser | null> => {
    try {
      const { data } = await supabase.auth.getUser()
      
      if (data.user) {
        return {
          id: data.user.id,
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || '',
          email: data.user.email || ''
        }
      }
      
      return null
    } catch {
      return null
    }
  },

  // Obtém a sessão atual
  getSession: async (): Promise<Session | null> => {
    try {
      const { data } = await supabase.auth.getSession()
      return data.session
    } catch {
      return null
    }
  },

  // Verifica se pode acessar rotas protegidas
  checkAuth: async (): Promise<AuthState> => {
    const isAuthenticated = await auth.isAuthenticated()
    const user = isAuthenticated ? await auth.getCurrentUser() : null
    const session = isAuthenticated ? await auth.getSession() : null
    
    return {
      user,
      isAuthenticated,
      session
    }
  },

  // Escuta mudanças de autenticação
  onAuthStateChange: (callback: (event: string, session: Session | null) => void) => {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session)
    })
  }
}

// Exporta as funções de validação para uso externo
export const authUtils = {
  login: auth.login,
  register: auth.register,
  logout: auth.logout,
  isAuthenticated: auth.isAuthenticated,
  getCurrentUser: auth.getCurrentUser,
  getSession: auth.getSession,
  checkAuth: auth.checkAuth,
  onAuthStateChange: auth.onAuthStateChange
}