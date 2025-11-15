-- ============================================
-- SCRIPT SQL PARA SUPABASE
-- Sistema de Calendário São Paulo Skills
-- ============================================

-- 1. CRIAR TABELA DE USUÁRIOS
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CRIAR TABELA DE TIPOS DE EVENTOS
CREATE TABLE IF NOT EXISTS event_types (
    id BIGSERIAL PRIMARY KEY,
    value TEXT UNIQUE NOT NULL,
    label TEXT NOT NULL,
    default_color TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CRIAR TABELA DE EVENTOS
CREATE TABLE IF NOT EXISTS calendar_events (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    type TEXT NOT NULL,
    color TEXT NOT NULL,
    notes TEXT,
    weekday_schedule JSONB DEFAULT '{}',
    created_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. CRIAR TABELA DE CONFIGURAÇÕES DO SISTEMA
CREATE TABLE IF NOT EXISTS system_config (
    id BIGSERIAL PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INSERIR DADOS INICIAIS
-- ============================================

-- 1. INSERIR USUÁRIO ADMIN PADRÃO
INSERT INTO users (username, password, name, role)
VALUES ('adm', 'senaisp@2025', 'Administrador', 'admin')
ON CONFLICT (username) DO NOTHING;

-- 2. INSERIR TIPOS DE EVENTOS PADRÃO
INSERT INTO event_types (value, label, default_color) VALUES
    ('workshop', 'Workshop', '#3b82f6'),
    ('competition', 'Competição', '#ef4444'),
    ('training', 'Treino', '#10b981'),
    ('meeting', 'Reunião', '#f59e0b'),
    ('vacation', 'Férias', '#8b5cf6'),
    ('other', 'Outro', '#6b7280')
ON CONFLICT (value) DO NOTHING;

-- ============================================
-- CRIAR ÍNDICES PARA PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_calendar_events_dates ON calendar_events(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_calendar_events_type ON calendar_events(type);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- ============================================
-- HABILITAR ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CRIAR POLÍTICAS DE ACESSO (POLICIES)
-- ============================================

-- Políticas para USERS (todos podem ler, ninguém pode escrever via API direta)
DROP POLICY IF EXISTS "Permitir leitura de usuários" ON users;
CREATE POLICY "Permitir leitura de usuários"
    ON users FOR SELECT
    USING (true);

-- Políticas para EVENT_TYPES (todos podem ler e escrever)
DROP POLICY IF EXISTS "Permitir leitura de tipos" ON event_types;
CREATE POLICY "Permitir leitura de tipos"
    ON event_types FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Permitir inserção de tipos" ON event_types;
CREATE POLICY "Permitir inserção de tipos"
    ON event_types FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir atualização de tipos" ON event_types;
CREATE POLICY "Permitir atualização de tipos"
    ON event_types FOR UPDATE
    USING (true);

DROP POLICY IF EXISTS "Permitir exclusão de tipos" ON event_types;
CREATE POLICY "Permitir exclusão de tipos"
    ON event_types FOR DELETE
    USING (true);

-- Políticas para CALENDAR_EVENTS (todos podem ler e escrever)
DROP POLICY IF EXISTS "Permitir leitura de eventos" ON calendar_events;
CREATE POLICY "Permitir leitura de eventos"
    ON calendar_events FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Permitir inserção de eventos" ON calendar_events;
CREATE POLICY "Permitir inserção de eventos"
    ON calendar_events FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir atualização de eventos" ON calendar_events;
CREATE POLICY "Permitir atualização de eventos"
    ON calendar_events FOR UPDATE
    USING (true);

DROP POLICY IF EXISTS "Permitir exclusão de eventos" ON calendar_events;
CREATE POLICY "Permitir exclusão de eventos"
    ON calendar_events FOR DELETE
    USING (true);

-- Políticas para SYSTEM_CONFIG (todos podem ler e escrever)
DROP POLICY IF EXISTS "Permitir leitura de config" ON system_config;
CREATE POLICY "Permitir leitura de config"
    ON system_config FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Permitir inserção de config" ON system_config;
CREATE POLICY "Permitir inserção de config"
    ON system_config FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir atualização de config" ON system_config;
CREATE POLICY "Permitir atualização de config"
    ON system_config FOR UPDATE
    USING (true);

-- ============================================
-- FUNÇÃO PARA ATUALIZAR updated_at AUTOMATICAMENTE
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para calendar_events
DROP TRIGGER IF EXISTS update_calendar_events_updated_at ON calendar_events;
CREATE TRIGGER update_calendar_events_updated_at
    BEFORE UPDATE ON calendar_events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger para system_config
DROP TRIGGER IF EXISTS update_system_config_updated_at ON system_config;
CREATE TRIGGER update_system_config_updated_at
    BEFORE UPDATE ON system_config
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FIM DO SCRIPT
-- ============================================

-- Verificar se tudo foi criado corretamente
SELECT 'Tabelas criadas:' AS status;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'event_types', 'calendar_events', 'system_config');

SELECT 'Usuário admin criado:' AS status;
SELECT username, name, role FROM users WHERE username = 'adm';

SELECT 'Tipos de eventos criados:' AS status;
SELECT value, label FROM event_types;
