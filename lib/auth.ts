// Tipos de autenticação
export interface User {
  id: string
  name: string
  email: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

// Chave para localStorage
const AUTH_TOKEN_KEY = 'bettracker_auth_token'
const USER_DATA_KEY = 'bettracker_user_data'

// Funções de autenticação
export const auth = {
  // Login - armazena token e dados do usuário
  login: (user: User): void => {
    const token = btoa(`${user.email}_${Date.now()}`)
    localStorage.setItem(AUTH_TOKEN_KEY, token)
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user))
  },

  // Logout - remove dados do localStorage
  logout: (): void => {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(USER_DATA_KEY)
  },

  // Verifica se o usuário está autenticado
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    return !!token
  },

  // Obtém os dados do usuário atual
  getCurrentUser: (): User | null => {
    const userData = localStorage.getItem(USER_DATA_KEY)
    if (!userData) return null
    
    try {
      return JSON.parse(userData)
    } catch {
      return null
    }
  },

  // Verifica se pode acessar rotas protegidas
  checkAuth: (): AuthState => {
    const isAuthenticated = auth.isAuthenticated()
    const user = isAuthenticated ? auth.getCurrentUser() : null
    
    return {
      user,
      isAuthenticated
    }
  }
}

// Mock de usuários para teste
const MOCK_USERS = [
  {
    id: '1',
    name: 'Usuário Demo',
    email: 'demo@betracker.com',
    password: 'demo123'
  }
]

// Função de login com validação
export const validateLogin = (email: string, password: string): User | null => {
  const user = MOCK_USERS.find(u => u.email === email && u.password === password)
  return user || null
}

// Função de registro (para demo)
export const registerUser = (name: string, email: string, password: string): User | null => {
  // Verifica se já existe
  const existing = MOCK_USERS.find(u => u.email === email)
  if (existing) return null
  
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password
  }
  
  MOCK_USERS.push(newUser)
  return newUser
}

// Exporta as funções de validação para uso externo
export const authUtils = {
  validateLogin,
  registerUser
}
