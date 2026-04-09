-- =============================================
-- MIGRACAO COMPLETA PARA BETRACKER NO SUPABASE
-- Gerado automaticamente após análise completa da aplicação
-- =============================================

-- 1. Criar ENUM TYPES (igual aos tipos TypeScript da aplicação)
CREATE TYPE bet_status AS ENUM ('Pendente', 'Green', 'Red', 'Devolvida');
CREATE TYPE bet_type AS ENUM ('Simples', 'Múltipla');

-- 2. Criar Tabela Principal de Apostas
CREATE TABLE IF NOT EXISTS public.bets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  event TEXT NOT NULL,
  market TEXT NOT NULL,
  type bet_type NOT NULL DEFAULT 'Simples',
  odd NUMERIC(10,2) NOT NULL CHECK (odd > 1.00),
  stake NUMERIC(12,2) NOT NULL CHECK (stake > 0),
  status bet_status NOT NULL DEFAULT 'Pendente',
  profit NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Habilitar Row Level Security
ALTER TABLE public.bets ENABLE ROW LEVEL SECURITY;

-- 4. Criar Politicas de Acesso (cada usuário só vê suas próprias apostas)
-- Politica para LEITURA
CREATE POLICY "Usuários podem ver apenas suas apostas" 
  ON public.bets 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Politica para CRIAÇÃO
CREATE POLICY "Usuários podem criar suas próprias apostas" 
  ON public.bets 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Politica para ATUALIZAÇÃO
CREATE POLICY "Usuários podem atualizar apenas suas apostas" 
  ON public.bets 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Politica para EXCLUSÃO
CREATE POLICY "Usuários podem excluir apenas suas apostas" 
  ON public.bets 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- 5. Índices para Performance
CREATE INDEX idx_bets_user_id ON public.bets(user_id);
CREATE INDEX idx_bets_date ON public.bets(date DESC);
CREATE INDEX idx_bets_status ON public.bets(status);

-- 6. Trigger para atualizar automaticamente updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bets_updated_at
  BEFORE UPDATE ON public.bets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 7. Trigger para calcular automaticamente o PROFIT antes de salvar
CREATE OR REPLACE FUNCTION calculate_profit()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'Green' THEN
    NEW.profit = ROUND((NEW.stake * (NEW.odd - 1)) * 100) / 100;
  ELSIF NEW.status = 'Red' THEN
    NEW.profit = -NEW.stake;
  ELSE
    NEW.profit = 0;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER bets_calculate_profit
  BEFORE INSERT OR UPDATE ON public.bets
  FOR EACH ROW
  EXECUTE FUNCTION calculate_profit();

-- 8. Permitir acesso ao service_role (para operações backend se necessário)
GRANT ALL ON public.bets TO service_role;

-- =============================================
-- INSTRUCOES DE USO:
-- 1. Acesse o painel do Supabase
-- 2. Vá em SQL Editor
-- 3. Cole TODO esse conteudo
-- 4. Clique em Run
--
-- Pronto! Tabelas, RLS, triggers e indices todos configurados.
-- A aplicação ja pode conectar e começar a usar o banco.
-- =============================================