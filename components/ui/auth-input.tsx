'use client'

import { ReactNode } from 'react'

interface AuthInputProps {
  type?: 'text' | 'email' | 'password'
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  icon?: ReactNode
  className?: string
}

export function AuthInput({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error, 
  icon,
  className = '' 
}: AuthInputProps) {
  return (
    <div className="space-y-2">
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`neon-input w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary/20 transition-all ${
            icon ? 'pl-10' : 'pl-4'
          } ${error ? 'border-destructive/50' : ''} ${className}`}
        />
      </div>
      {error && (
        <p className="text-destructive text-sm flex items-center gap-2">
          <span className="text-destructive">•</span>
          {error}
        </p>
      )}
    </div>
  )
}