'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Bet, BetStatus, BetType, MARKETS } from '@/lib/api-service'
import { cn } from '@/lib/utils'

interface BetModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (bet: Omit<Bet, 'id' | 'profit'>) => void
  editBet?: Bet | null
}

export function BetModal({ isOpen, onClose, onSave, editBet }: BetModalProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    event: '',
    market: '',
    type: 'Simples' as BetType,
    odd: '',
    stake: '',
    status: 'Pendente' as BetStatus,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (editBet) {
      setFormData({
        date: editBet.date,
        event: editBet.event,
        market: editBet.market,
        type: editBet.type,
        odd: editBet.odd.toString(),
        stake: editBet.stake.toString(),
        status: editBet.status,
      })
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        event: '',
        market: '',
        type: 'Simples',
        odd: '',
        stake: '',
        status: 'Pendente',
      })
    }
    setErrors({})
  }, [editBet, isOpen])

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.date) newErrors.date = 'Data é obrigatória'
    if (!formData.event.trim()) newErrors.event = 'Evento é obrigatório'
    if (!formData.market) newErrors.market = 'Mercado é obrigatório'
    if (!formData.odd || parseFloat(formData.odd) <= 1) {
      newErrors.odd = 'Odd deve ser maior que 1.00'
    }
    if (!formData.stake || parseFloat(formData.stake) <= 0) {
      newErrors.stake = 'Stake deve ser maior que 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    onSave({
      date: formData.date,
      event: formData.event.trim(),
      market: formData.market,
      type: formData.type,
      odd: parseFloat(formData.odd),
      stake: parseFloat(formData.stake),
      status: formData.status,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg mx-4 bg-card border border-border rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">
            {editBet ? 'Editar Aposta' : 'Nova Aposta'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Data */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium text-foreground">
              Data
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={cn('bg-input', errors.date && 'border-destructive')}
            />
            {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
          </div>

          {/* Evento */}
          <div className="space-y-2">
            <Label htmlFor="event" className="text-sm font-medium text-foreground">
              Evento
            </Label>
            <Input
              id="event"
              placeholder="Ex: Flamengo x Palmeiras"
              value={formData.event}
              onChange={(e) => setFormData({ ...formData, event: e.target.value })}
              className={cn('bg-input', errors.event && 'border-destructive')}
            />
            {errors.event && <p className="text-xs text-destructive">{errors.event}</p>}
          </div>

          {/* Mercado */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Mercado</Label>
            <Select
              value={formData.market}
              onValueChange={(value) => setFormData({ ...formData, market: value })}
            >
              <SelectTrigger className={cn('bg-input', errors.market && 'border-destructive')}>
                <SelectValue placeholder="Selecione o mercado" />
              </SelectTrigger>
              <SelectContent>
                {MARKETS.map((market) => (
                  <SelectItem key={market} value={market}>
                    {market}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.market && <p className="text-xs text-destructive">{errors.market}</p>}
          </div>

          {/* Tipo e Odd */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Tipo</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as BetType })}
              >
                <SelectTrigger className="bg-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Simples">Simples</SelectItem>
                  <SelectItem value="Múltipla">Múltipla</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="odd" className="text-sm font-medium text-foreground">
                Odd
              </Label>
              <Input
                id="odd"
                type="number"
                step="0.01"
                min="1.01"
                placeholder="Ex: 1.95"
                value={formData.odd}
                onChange={(e) => setFormData({ ...formData, odd: e.target.value })}
                className={cn('bg-input', errors.odd && 'border-destructive')}
              />
              {errors.odd && <p className="text-xs text-destructive">{errors.odd}</p>}
            </div>
          </div>

          {/* Stake e Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stake" className="text-sm font-medium text-foreground">
                Stake (R$)
              </Label>
              <Input
                id="stake"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="Ex: 100.00"
                value={formData.stake}
                onChange={(e) => setFormData({ ...formData, stake: e.target.value })}
                className={cn('bg-input', errors.stake && 'border-destructive')}
              />
              {errors.stake && <p className="text-xs text-destructive">{errors.stake}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as BetStatus })}
              >
                <SelectTrigger className="bg-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Green">Green</SelectItem>
                  <SelectItem value="Red">Red</SelectItem>
                  <SelectItem value="Devolvida">Devolvida</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {editBet ? 'Salvar Alterações' : 'Adicionar Aposta'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
