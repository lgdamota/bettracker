'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      // Redireciona para login se não estiver autenticado
      router.push('/login')
    }
  }, [isAuthenticated, router])

  // Se não estiver autenticado, mostra fallback ou nada
  if (!isAuthenticated) {
    return fallback || null
  }

  return <>{children}</>
}