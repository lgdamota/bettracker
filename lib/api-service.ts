// Tipos para a aplicação de apostas
export type BetStatus = 'Pendente' | 'Green' | 'Red' | 'Devolvida'
export type BetType = 'Simples' | 'Múltipla'

export interface Bet {
  id: string
  date: string
  event: string
  market: string
  type: BetType
  odd: number
  stake: number
  status: BetStatus
  profit: number
}

export interface KPIs {
  currentBank: number
  totalProfit: number
  roi: number
  winRate: number
  totalBets: number
  greenBets: number
  redBets: number
}

// Dados mockados iniciais
let mockBets: Bet[] = [
  {
    id: '1',
    date: '2024-03-20',
    event: 'Flamengo x Palmeiras',
    market: 'Over 2.5 Gols',
    type: 'Simples',
    odd: 1.95,
    stake: 100,
    status: 'Green',
    profit: 95,
  },
  {
    id: '2',
    date: '2024-03-19',
    event: 'Real Madrid x Barcelona',
    market: 'Ambas Marcam',
    type: 'Simples',
    odd: 1.80,
    stake: 150,
    status: 'Green',
    profit: 120,
  },
  {
    id: '3',
    date: '2024-03-18',
    event: 'Liverpool x Man City',
    market: 'Handicap -1',
    type: 'Simples',
    odd: 2.10,
    stake: 80,
    status: 'Red',
    profit: -80,
  },
  {
    id: '4',
    date: '2024-03-17',
    event: 'PSG x Lyon',
    market: 'Vitória PSG',
    type: 'Simples',
    odd: 1.45,
    stake: 200,
    status: 'Green',
    profit: 90,
  },
  {
    id: '5',
    date: '2024-03-16',
    event: 'Bayern x Dortmund',
    market: 'Empate',
    type: 'Simples',
    odd: 3.50,
    stake: 50,
    status: 'Red',
    profit: -50,
  },
  {
    id: '6',
    date: '2024-03-15',
    event: 'Corinthians x São Paulo',
    market: 'Under 2.5 Gols',
    type: 'Simples',
    odd: 1.75,
    stake: 120,
    status: 'Green',
    profit: 90,
  },
  {
    id: '7',
    date: '2024-03-21',
    event: 'Inter x Milan',
    market: 'Vitória Inter',
    type: 'Simples',
    odd: 2.00,
    stake: 100,
    status: 'Pendente',
    profit: 0,
  },
  {
    id: '8',
    date: '2024-03-14',
    event: 'Atlético MG x Cruzeiro',
    market: 'Ambas Marcam',
    type: 'Simples',
    odd: 1.90,
    stake: 75,
    status: 'Devolvida',
    profit: 0,
  },
  {
    id: '9',
    date: '2024-03-13',
    event: 'Arsenal x Chelsea + Juventus x Napoli',
    market: 'Combo Vitória Casa',
    type: 'Múltipla',
    odd: 3.25,
    stake: 60,
    status: 'Green',
    profit: 135,
  },
  {
    id: '10',
    date: '2024-03-12',
    event: 'Santos x Botafogo',
    market: 'Over 1.5 Gols',
    type: 'Simples',
    odd: 1.50,
    stake: 100,
    status: 'Green',
    profit: 50,
  },
]

const INITIAL_BANK = 1000

// Simula delay de rede
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Funções de API simuladas
export async function getBets(): Promise<Bet[]> {
  await delay(300)
  return [...mockBets].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function addBet(betData: Omit<Bet, 'id' | 'profit'>): Promise<Bet> {
  await delay(300)
  
  let profit = 0
  if (betData.status === 'Green') {
    profit = betData.stake * (betData.odd - 1)
  } else if (betData.status === 'Red') {
    profit = -betData.stake
  }
  
  const newBet: Bet = {
    ...betData,
    id: Date.now().toString(),
    profit: Math.round(profit * 100) / 100,
  }
  
  mockBets = [newBet, ...mockBets]
  return newBet
}

export async function updateBet(betId: string, betData: Partial<Omit<Bet, 'id'>>): Promise<Bet> {
  await delay(300)
  
  const index = mockBets.findIndex((bet) => bet.id === betId)
  if (index === -1) {
    throw new Error('Aposta não encontrada')
  }
  
  const updatedBet = { ...mockBets[index], ...betData }
  
  // Recalcula o lucro se stake, odd ou status mudou
  if (updatedBet.status === 'Green') {
    updatedBet.profit = Math.round(updatedBet.stake * (updatedBet.odd - 1) * 100) / 100
  } else if (updatedBet.status === 'Red') {
    updatedBet.profit = -updatedBet.stake
  } else {
    updatedBet.profit = 0
  }
  
  mockBets[index] = updatedBet
  return updatedBet
}

export async function deleteBet(betId: string): Promise<void> {
  await delay(300)
  mockBets = mockBets.filter((bet) => bet.id !== betId)
}

export async function getKPIs(): Promise<KPIs> {
  await delay(200)
  
  const bets = mockBets
  const completedBets = bets.filter((bet) => bet.status === 'Green' || bet.status === 'Red')
  const greenBets = bets.filter((bet) => bet.status === 'Green').length
  const redBets = bets.filter((bet) => bet.status === 'Red').length
  
  const totalProfit = bets.reduce((sum, bet) => sum + bet.profit, 0)
  const totalStaked = completedBets.reduce((sum, bet) => sum + bet.stake, 0)
  
  const roi = totalStaked > 0 ? (totalProfit / totalStaked) * 100 : 0
  const winRate = completedBets.length > 0 ? (greenBets / completedBets.length) * 100 : 0
  
  return {
    currentBank: Math.round((INITIAL_BANK + totalProfit) * 100) / 100,
    totalProfit: Math.round(totalProfit * 100) / 100,
    roi: Math.round(roi * 100) / 100,
    winRate: Math.round(winRate * 100) / 100,
    totalBets: bets.length,
    greenBets,
    redBets,
  }
}

// Lista de mercados disponíveis
export const MARKETS = [
  'Vitória Casa',
  'Vitória Fora',
  'Empate',
  'Ambas Marcam',
  'Over 0.5 Gols',
  'Over 1.5 Gols',
  'Over 2.5 Gols',
  'Over 3.5 Gols',
  'Under 0.5 Gols',
  'Under 1.5 Gols',
  'Under 2.5 Gols',
  'Under 3.5 Gols',
  'Handicap -1',
  'Handicap +1',
  'Handicap -2',
  'Handicap +2',
  'Dupla Chance',
  'Combo',
]
