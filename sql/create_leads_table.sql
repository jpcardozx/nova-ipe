-- Criar tabela de leads
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    source VARCHAR(50) DEFAULT 'website' CHECK (source IN ('website', 'facebook', 'google', 'referral', 'phone', 'walk_in')),
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    property_interest TEXT,
    budget_min DECIMAL(15,2),
    budget_max DECIMAL(15,2),
    location_interest VARCHAR(255),
    message TEXT,
    assigned_to UUID REFERENCES auth.users(id),
    created_by UUID REFERENCES auth.users(id),
    score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
    last_contact TIMESTAMP WITH TIME ZONE,
    next_followup TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    tags TEXT[],
    custom_fields JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON public.leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON public.leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_next_followup ON public.leads(next_followup);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_updated_at 
    BEFORE UPDATE ON public.leads 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Política: usuários podem ver todos os leads
CREATE POLICY "Users can view all leads" ON public.leads
    FOR SELECT USING (auth.role() = 'authenticated');

-- Política: usuários podem inserir leads
CREATE POLICY "Users can insert leads" ON public.leads
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política: usuários podem atualizar leads
CREATE POLICY "Users can update leads" ON public.leads
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Política: usuários podem deletar leads
CREATE POLICY "Users can delete leads" ON public.leads
    FOR DELETE USING (auth.role() = 'authenticated');
