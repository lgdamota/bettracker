'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Somente redireciona QUANDO terminar de carregar
    if (!loading && !isAuthenticated) {
      // Redireciona para login se não estiver autenticado
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  // Enquanto carregando, não mostra nada nem redireciona
  if (loading) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  // Se não estiver autenticado, mostra fallback ou nada
  if (!isAuthenticated) {
    return fallback || null
  }

  return <>{children}</>
}
