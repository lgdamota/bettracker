import { useState } from 'react'
import { 
  TrendingUp, 
  DollarSign, 
  Percent, 
  Target,
  Sparkle,
  ChevronRight
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface KPI {
  title: string
  value: string
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
}

export function AboutSection() {
  const [isChartHovered, setIsChartHovered] = useState(false)

  const kpis: KPI[] = [
    {
      title: 'ROI',
      value: '+23.5%',
      icon: <TrendingUp className="h-5 w-5" />,
      trend: 'up'
    },
    {
      title: 'Lucro Líquido',
      value: 'R$ 2.340,00',
      icon: <DollarSign className="h-5 w-5" />,
      trend: 'up'
    },
    {
      title: 'Win Rate',
      value: '68.2%',
      icon: <Percent className="h-5 w-5" />,
      trend: 'up'
    },
    {
      title: 'Closing EV',
      value: '+15.8%',
      icon: <Target className="h-5 w-5" />,
      trend: 'neutral'
    }
  ]

  const chartData = [
    { month: 'Jan', value: 100 },
    { month: 'Feb', value: 120 },
    { month: 'Mar', value: 90 },
    { month: 'Apr', value: 150 },
    { month: 'May', value: 180 },
    { month: 'Jun', value: 200 }
  ]

  return (
    <section className="min-h-screen bg-background py-20">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          {/* Title with Cyan Gradient */}
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-[color:oklch(var(--brand-cyan-light))] to-[color:oklch(var(--brand-cyan))] bg-clip-text text-transparent">
            Gestão Profissional de{' '}
            <span className="relative">
              Apostas Esportivas
              <Sparkle className="absolute -top-2 -right-6 h-6 w-6 text-[color:oklch(var(--brand-cyan-light))] opacity-80" />
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Abandone o caos das planilhas. A BetTracker é a plataforma profissional 
            que centraliza seus dados, automatiza o registro e revela onde está seu verdadeiro lucro.
          </p>

          {/* CTA Button */}
          <div className="pt-4">
            <Link href="/dashboard">
              <Button 
                className="bg-[color:oklch(var(--brand-cyan-light))] text-[color:oklch(var(--brand-cyan-light-foreground))] hover:bg-[color:oklch(var(--brand-cyan-light))]/90 gap-2 font-semibold text-lg px-8 py-6 text-white shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all duration-300 transform hover:scale-105"
                onMouseEnter={() => setIsChartHovered(true)}
                onMouseLeave={() => setIsChartHovered(false)}
              >
                Ver Apostas
                <ChevronRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Dashboard Mockup */}
        <div className="mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Dashboard Cards */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {kpis.map((kpi, index) => (
                  <Card 
                    key={index}
                    className="bg-white/5 backdrop-blur-sm border border-white/20 hover:border-[color:oklch(var(--brand-cyan-light))]/50 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(0,255,255,0.2)]"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                          <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                          {kpi.trend === 'up' && (
                            <span className="inline-flex items-center gap-1 text-green-400 text-sm">
                              <TrendingUp className="h-4 w-4" />
                              Em alta
                            </span>
                          )}
                        </div>
                        <div className="p-3 bg-[color:oklch(var(--brand-cyan-light))]/20 rounded-xl">
                          {kpi.icon}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Area Chart */}
              <Card className="bg-white/5 backdrop-blur-sm border border-white/20 p-6 hover:border-[color:oklch(var(--brand-cyan-light))]/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,255,0.2)]">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Performance Mensal</h3>
                    <span className="text-sm text-muted-foreground">Últimos 6 meses</span>
                  </div>
                  
                  {/* Simple SVG Chart */}
                  <div className="relative h-48 w-full">
                    <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                      {/* Background Grid */}
                      <defs>
                        <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="rgba(0, 255, 255, 0.6)" />
                          <stop offset="100%" stopColor="rgba(0, 255, 255, 0)" />
                        </linearGradient>
                      </defs>
                      
                      {/* Grid Lines */}
                      {[0, 1, 2, 3, 4].map(i => (
                        <line
                          key={i}
                          x1="0"
                          y1={i * 40}
                          x2="400"
                          y2={i * 40}
                          stroke="rgba(255, 255, 255, 0.1)"
                          strokeWidth="1"
                        />
                      ))}
                      
                      {/* Area Chart */}
                      <path
                        d="M 0 200 L 0 160 L 80 140 L 160 180 L 240 120 L 320 80 L 400 60 L 400 200 Z"
                        fill="url(#cyanGradient)"
                        className="transition-all duration-500"
                      />
                      
                      {/* Line Chart */}
                      <path
                        d="M 0 160 L 80 140 L 160 180 L 240 120 L 320 80 L 400 60"
                        fill="none"
                        stroke="url(#cyanGradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-all duration-500"
                      />
                      
                      {/* Data Points */}
                      {chartData.map((data, index) => {
                        const x = (index * 80) + 40
                        const y = 200 - (data.value * 1.4)
                        return (
                          <circle
                            key={index}
                            cx={x}
                            cy={y}
                            r="4"
                            fill="white"
                            className="transition-all duration-300 hover:r-6 hover:fill-[color:oklch(var(--brand-cyan-light))]"
                          />
                        )
                      })}
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-foreground">Por que escolher a BetTracker?</h2>
                
                <div className="space-y-4 text-muted-foreground">
                  <div className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg hover:border-[color:oklch(var(--brand-cyan-light))]/50 transition-all duration-300">
                    <div className="flex-shrink-0 w-12 h-12 bg-[color:oklch(var(--brand-cyan-light))]/20 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-[color:oklch(var(--brand-cyan-light))]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Análise Profunda</h3>
                      <p className="text-sm">Relatórios detalhados que revelam padrões ocultos e oportunidades de melhoria no seu bankroll.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg hover:border-[color:oklch(var(--brand-cyan-light))]/50 transition-all duration-300">
                    <div className="flex-shrink-0 w-12 h-12 bg-[color:oklch(var(--brand-cyan-light))]/20 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-[color:oklch(var(--brand-cyan-light))]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Gestão Inteligente</h3>
                      <p className="text-sm">Controle de banca, gestão de risco e estratégias baseadas em dados reais.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg hover:border-[color:oklch(var(--brand-cyan-light))]/50 transition-all duration-300">
                    <div className="flex-shrink-0 w-12 h-12 bg-[color:oklch(var(--brand-cyan-light))]/20 rounded-lg flex items-center justify-center">
                      <Percent className="h-6 w-6 text-[color:oklch(var(--brand-cyan-light))]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Precisão Total</h3>
                      <p className="text-sm">Cálculos matemáticos avançados para ROI, EV e outras métricas essenciais.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="bg-gradient-to-r from-[color:oklch(var(--brand-cyan-light))]/20 to-transparent border border-[color:oklch(var(--brand-cyan-light))]/30 rounded-xl p-8 text-center">
                <h3 className="text-2xl font-bold text-foreground mb-4">Pronto para transformar sua banca?</h3>
                <p className="text-muted-foreground mb-6">Junte-se a milhares de apostadores que já confiam na BetTracker para alcançar resultados consistentes.</p>
                <Link href="/dashboard">
                  <Button 
                    className="bg-[color:oklch(var(--brand-cyan-light))] text-white hover:bg-[color:oklch(var(--brand-cyan-light))]/90 font-semibold px-8 py-4 text-lg shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all duration-300"
                  >
                    Começar Agora
                    <Sparkle className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}