'use client'

import { ReactNode } from 'react'

interface AuthCardProps {
  children: ReactNode
  title: string
  subtitle?: string
  className?: string
}

export function AuthCard({ children, title, subtitle, className = '' }: AuthCardProps) {
  return (
    <div className={`neon-container relative min-h-screen flex items-center justify-center p-4 ${className}`}>
      {/* Gradiente Radial Neon */}
      <div className="neon-gradient"></div>
      
      {/* Conteúdo Principal */}
      <div className="relative w-full max-w-md">
        <div className="neon-card rounded-2xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="neon-title text-3xl font-bold mb-2">{title}</h1>
            {subtitle && (
              <p className="text-muted-foreground text-sm opacity-80">
                {subtitle}
              </p>
            )}
          </div>

          {/* Formulário */}
          <div className="space-y-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}