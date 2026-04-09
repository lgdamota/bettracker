'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from '@/components/auth-provider'

interface NavbarProps {
  className?: string
}

export function Navbar({ className = '' }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated, logout } = useAuth()

  const navigationItems = [
    { name: 'Sobre', href: '/' }
   
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-background border-b border-border backdrop-blur-lg transition-all duration-300 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand - Lado Esquerdo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 text-foreground hover:text-primary transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                BetTracker
              </span>
            </Link>
          </div>

          {/* Navigation Menu - Centro (Desktop) */}
          <div className="hidden md:flex md:items-center md:gap-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors font-medium relative group"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* CTA Button - Lado Direito */}
          <div className="hidden md:flex gap-3">
            {!isAuthenticated ? (
              <>
                <Link 
                  href="/login" 
                  className="bg-transparent border border-primary/30 text-primary px-6 py-2 rounded-lg font-semibold hover:bg-primary/10 transition-all duration-200"
                >
                  Entrar
                </Link>
                <Link 
                  href="/register" 
                  className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Começar Agora
                </Link>
              </>
            ) : (
              <button
                onClick={logout}
                className="bg-destructive text-destructive-foreground px-6 py-2 rounded-lg font-semibold hover:bg-destructive/90 transition-all duration-200"
              >
                Sair
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-accent transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation"
          >
            <div className="space-y-2">
              <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden absolute top-full left-0 right-0 bg-background border-b border-border transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="py-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-4 py-3 text-foreground hover:bg-accent hover:text-foreground transition-colors rounded-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t border-border my-2"></div>
            {!isAuthenticated ? (
              <>
                <Link 
                  href="/login" 
                  className="block mx-4 bg-transparent border border-primary/30 text-primary px-6 py-3 rounded-lg font-semibold text-center hover:bg-primary/10 transition-all duration-200"
                >
                  Entrar
                </Link>
                <Link 
                  href="/register" 
                  className="block mx-4 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold text-center hover:bg-primary/90 transition-all duration-200"
                >
                  Começar Agora
                </Link>
              </>
            ) : (
              <button
                onClick={logout}
                className="block mx-4 bg-destructive text-destructive-foreground px-6 py-3 rounded-lg font-semibold text-center hover:bg-destructive/90 transition-all duration-200"
              >
                Sair
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
