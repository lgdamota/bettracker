'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  Wallet,
  TrendingUp,
  Percent,
  Target,
  Plus,
  Trophy,
  AlertCircle,
} from 'lucide-react'
import { Sidebar } from '@/components/sidebar'
import { KPICard } from '@/components/kpi-card'
import { BetTable } from '@/components/bet-table'
import { BetModal } from '@/components/bet-modal'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Button } from '@/components/ui/button'
import {
  Bet,
  KPIs,
  getBets,
  addBet,
  updateBet,
  deleteBet,
  getKPIs,
} from '@/lib/api-service'

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState('dashboard')
  const [bets, setBets] = useState<Bet[]>([])
  const [kpis, setKpis] = useState<KPIs | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBet, setEditingBet] = useState<Bet | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; betId: string | null }>({
    isOpen: false,
    betId: null,
  })

  const loadData = useCallback(async () => {
    try {
      const [betsData, kpisData] = await Promise.all([getBets(), getKPIs()])
      setBets(betsData)
      setKpis(kpisData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleAddBet = async (betData: Omit<Bet, 'id' | 'profit'>) => {
    try {
      if (editingBet) {
        await updateBet(editingBet.id, betData)
      } else {
        await addBet(betData)
      }
      await loadData()
      setIsModalOpen(false)
      setEditingBet(null)
    } catch (error) {
      console.error('Erro ao salvar aposta:', error)
    }
  }

  const handleEditBet = (bet: Bet) => {
    setEditingBet(bet)
    setIsModalOpen(true)
  }

  const handleDeleteBet = (betId: string) => {
    setDeleteConfirm({ isOpen: true, betId })
  }

  const confirmDelete = async () => {
    if (deleteConfirm.betId) {
      try {
        await deleteBet(deleteConfirm.betId)
        await loadData()
      } catch (error) {
        console.error('Erro ao excluir aposta:', error)
      }
    }
    setDeleteConfirm({ isOpen: false, betId: null })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar fixa na lateral */}
        <div className="flex-none">
          <Sidebar activeItem={activeMenu} onItemClick={setActiveMenu} />
        </div>

        {/* Conteúdo Principal com scroll independente */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-8">
          <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Dashboard
                </h1>
                <p className="text-muted-foreground mt-1">
                  Acompanhe o desempenho das suas apostas
                </p>
              </div>
              <Button
                onClick={() => {
                  setEditingBet(null);
                  setIsModalOpen(true);
                }}
                className="bg-[color:oklch(var(--brand-cyan))] text-[color:oklch(var(--brand-cyan-foreground))] hover:bg-[color:oklch(var(--brand-cyan))]/90 gap-2 font-semibold"
              >
                <Plus className="h-5 w-5" />
                Nova Aposta
              </Button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <KPICard
                title="Banca Atual"
                value={kpis ? formatCurrency(kpis.currentBank) : "---"}
                icon={Wallet}
                trend={kpis && kpis.totalProfit >= 0 ? "positive" : "negative"}
              />
              <KPICard
                title="Lucro Total"
                value={
                  kpis
                    ? `${kpis.totalProfit >= 0 ? "+" : ""}${formatCurrency(kpis.totalProfit)}`
                    : "---"
                }
                icon={TrendingUp}
                trend={kpis && kpis.totalProfit >= 0 ? "positive" : "negative"}
                subtitle={
                  kpis
                    ? `${kpis.greenBets} greens / ${kpis.redBets} reds`
                    : undefined
                }
              />
              <KPICard
                title="ROI"
                value={
                  kpis
                    ? `${kpis.roi >= 0 ? "+" : ""}${kpis.roi.toFixed(2)}%`
                    : "---"
                }
                icon={Percent}
                trend={kpis && kpis.roi >= 0 ? "positive" : "negative"}
              />
              <KPICard
                title="Win Rate"
                value={kpis ? `${kpis.winRate.toFixed(1)}%` : "---"}
                icon={Target}
                trend={
                  kpis && kpis.winRate >= 50
                    ? "positive"
                    : kpis && kpis.winRate > 0
                      ? "negative"
                      : "neutral"
                }
                subtitle={kpis ? `${kpis.totalBets} apostas totais` : undefined}
              />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Trophy className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Greens</p>
                  <p className="text-xl font-bold text-primary">
                    {kpis?.greenBets ?? 0}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/5 border border-destructive/20">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reds</p>
                  <p className="text-xl font-bold text-destructive">
                    {kpis?.redBets ?? 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Bets Table */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground">
                Histórico de Apostas
              </h2>
              <BetTable
                bets={bets}
                onEdit={handleEditBet}
                onDelete={handleDeleteBet}
                isLoading={isLoading}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <BetModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBet(null);
        }}
        onSave={handleAddBet}
        editBet={editingBet}
      />

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Excluir Aposta"
        message="Tem certeza que deseja excluir esta aposta? Esta ação não pode ser desfeita."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, betId: null })}
      />
    </div>
  );
}