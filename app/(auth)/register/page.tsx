'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, Lock, Loader2 } from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import { AuthCard } from '@/components/ui/auth-card'
import { AuthInput } from '@/components/ui/auth-input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setIsLoading(true)

    // Validações
    if (!name || !email || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos')
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      setIsLoading(false)
      return
    }

    try {
      const success = await register(name, email, password)
      if (success) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
      } else {
        setError('Este email já está em uso')
      }
    } catch (err) {
      setError('Ocorreu um erro ao criar a conta')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthCard 
      title="Crie sua conta" 
      subtitle="Junte-se ao futuro das apostas esportivas"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          type="text"
          placeholder="Seu nome completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          icon={<User className="h-4 w-4" />}
          error={error && !name ? 'Por favor, insira seu nome' : ''}
        />

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

        <AuthInput
          type="password"
          placeholder="Confirme sua senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          icon={<Lock className="h-4 w-4" />}
          error={error && !confirmPassword ? 'Por favor, confirme sua senha' : ''}
        />

        {error && (
          <div className="text-destructive text-sm flex items-center gap-2 bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <span className="text-destructive">•</span>
            {error}
          </div>
        )}

        {success && (
          <div className="text-primary text-sm flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-lg p-3">
            <span className="text-primary">✓</span>
            Conta criada com sucesso! Redirecionando...
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading || success}
          className="w-full neon-button font-semibold text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando conta...
            </>
          ) : success ? (
            'Sucesso!'
          ) : (
            'Criar conta'
          )}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          Já tem uma conta?{' '}
          <Link href="/login" className="neon-link font-medium">
            Entrar
          </Link>
        </div>
      </form>
    </AuthCard>
  )
}