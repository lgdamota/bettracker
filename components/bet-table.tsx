'use client'

import { useState } from 'react'
import {
  ArrowUpDown,
  Pencil,
  Trash2,
  Filter,
  ChevronDown,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Bet, BetStatus } from '@/lib/api-service'
import { cn } from '@/lib/utils'

interface BetTableProps {
  bets: Bet[]
  onEdit: (bet: Bet) => void
  onDelete: (betId: string) => void
  isLoading?: boolean
}

type SortField = 'date' | 'profit'
type SortOrder = 'asc' | 'desc'

const statusConfig: Record<BetStatus, { icon: typeof Clock; color: string; bgColor: string }> = {
  Pendente: {
    icon: Clock,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
  },
  Green: {
    icon: CheckCircle2,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  Red: {
    icon: XCircle,
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
  },
  Devolvida: {
    icon: RotateCcw,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
  },
}

export function BetTable({ bets, onEdit, onDelete, isLoading }: BetTableProps) {
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [statusFilter, setStatusFilter] = useState<BetStatus | 'Todos'>('Todos')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }

  const filteredAndSortedBets = bets
    .filter((bet) => statusFilter === 'Todos' || bet.status === statusFilter)
    .sort((a, b) => {
      const multiplier = sortOrder === 'asc' ? 1 : -1
      if (sortField === 'date') {
        return (new Date(a.date).getTime() - new Date(b.date).getTime()) * multiplier
      }
      return (a.profit - b.profit) * multiplier
    })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00')
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Status: {statusFilter}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatusFilter('Todos')}>Todos</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('Pendente')}>Pendente</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('Green')}>Green</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('Red')}>Red</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('Devolvida')}>
              Devolvida
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <span className="text-sm text-muted-foreground">
          {filteredAndSortedBets.length} aposta{filteredAndSortedBets.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden [&_[data-slot=table-container]]:overflow-x-auto">
        <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[100px]">
                  <button
                    onClick={() => handleSort('date')}
                    className="flex items-center gap-1 font-semibold hover:text-foreground transition-colors"
                  >
                    Data
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead>Evento</TableHead>
                <TableHead className="hidden sm:table-cell">Mercado</TableHead>
                <TableHead className="hidden lg:table-cell">Tipo</TableHead>
                <TableHead className="text-center">Odd</TableHead>
                <TableHead className="text-right">Stake</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">
                  <button
                    onClick={() => handleSort('profit')}
                    className="flex items-center gap-1 font-semibold hover:text-foreground transition-colors ml-auto"
                  >
                    Lucro
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedBets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                    Nenhuma aposta encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedBets.map((bet) => {
                  const statusInfo = statusConfig[bet.status]
                  const StatusIcon = statusInfo.icon
                  return (
                    <TableRow
                      key={bet.id}
                      className={cn(
                        'transition-colors',
                        bet.status === 'Green' && 'bg-primary/5',
                        bet.status === 'Red' && 'bg-destructive/5'
                      )}
                    >
                      <TableCell className="font-medium text-muted-foreground">
                        {formatDate(bet.date)}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate font-medium" title={bet.event}>
                          {bet.event}
                        </div>
                        <div className="sm:hidden text-xs text-muted-foreground mt-1">
                          {bet.market}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">
                        {bet.market}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span
                          className={cn(
                            'inline-flex items-center px-2 py-1 rounded-md text-xs font-medium',
                            bet.type === 'Múltipla'
                              ? 'bg-accent text-accent-foreground'
                              : 'bg-muted text-muted-foreground'
                          )}
                        >
                          {bet.type}
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-mono font-medium">
                        {bet.odd.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(bet.stake)}
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                            statusInfo.bgColor,
                            statusInfo.color
                          )}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          {bet.status}
                        </span>
                      </TableCell>
                      <TableCell
                        className={cn(
                          'text-right font-mono font-semibold',
                          bet.profit > 0 && 'text-primary',
                          bet.profit < 0 && 'text-destructive',
                          bet.profit === 0 && 'text-muted-foreground'
                        )}
                      >
                        {bet.profit >= 0 ? '+' : ''}
                        {formatCurrency(bet.profit)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(bet)}
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(bet.id)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
        </Table>
      </div>
    </div>
  )
}
