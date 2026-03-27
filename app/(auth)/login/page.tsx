'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Loader2 } from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import { AuthCard } from '@/components/ui/auth-card'
import { AuthInput } from '@/components/ui/auth-input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const success = await login(email, password)
      if (success) {
        router.push('/dashboard')
      } else {
        setError('Email ou senha incorretos')
      }
    } catch (err) {
      setError('Ocorreu um erro ao fazer login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthCard 
      title="Bem-vindo de volta" 
      subtitle="Entre para acessar seu painel de apostas"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          type="email"
          placeholder="Seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="h-4 w-4" />}
          error={error && !email ? 'Por favor, insira seu email' : ''}
        />

        <AuthInput
          type="password"
          placeholder="Sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock className="h-4 w-4" />}
          error={error && !password ? 'Por favor, insira sua senha' : ''}
        />

        {error && (
          <div className="text-destructive text-sm flex items-center gap-2 bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <span className="text-destructive">•</span>
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full neon-button font-semibold text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Entrando...
            </>
          ) : (
            'Entrar'
          )}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          Não tem uma conta?{' '}
          <Link href="/register" className="neon-link font-medium">
            Registre-se
          </Link>
        </div>
      </form>
    </AuthCard>
  )
}