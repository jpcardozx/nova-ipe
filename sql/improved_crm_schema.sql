-- Esquema SQL para CRM melhorado integrado com documentos

-- Tabela de usuários/corretores
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'broker', -- admin, manager, broker
    phone VARCHAR(20),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela principal de leads
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    source VARCHAR(50) NOT NULL, -- website, facebook, google, referral, walk-in, phone
    status VARCHAR(50) DEFAULT 'new', -- new, contacted, qualified, viewing, proposal, negotiating, closed, lost
    interest VARCHAR(50) NOT NULL, -- buy, sell, rent-tenant, rent-owner
    budget_min DECIMAL(12,2),
    budget_max DECIMAL(12,2),
    property_preferences JSONB DEFAULT '{}',
    assigned_to UUID REFERENCES users(id),
    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high
    score INTEGER DEFAULT 0,
    last_contact TIMESTAMP WITH TIME ZONE,
    next_follow_up TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de atividades do lead
CREATE TABLE IF NOT EXISTS lead_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL, -- call, email, whatsapp, meeting, viewing, document, task
    subject VARCHAR(255) NOT NULL,
    description TEXT,
    outcome VARCHAR(255),
    activity_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de tarefas do lead
CREATE TABLE IF NOT EXISTS lead_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    task_type VARCHAR(50), -- call, email, meeting, document, follow-up
    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, urgent
    status VARCHAR(20) DEFAULT 'pending', -- pending, in_progress, completed, cancelled
    assigned_to UUID REFERENCES users(id),
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de notas do lead
CREATE TABLE IF NOT EXISTS lead_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_important BOOLEAN DEFAULT false,
    created_by UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de propriedades
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    property_type VARCHAR(50) NOT NULL, -- house, apartment, commercial, land
    transaction_type VARCHAR(20) NOT NULL, -- sale, rent
    price DECIMAL(12,2) NOT NULL,
    area DECIMAL(8,2),
    bedrooms INTEGER,
    bathrooms INTEGER,
    garage_spaces INTEGER,
    address TEXT NOT NULL,
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    neighborhood VARCHAR(100),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    features JSONB DEFAULT '[]',
    status VARCHAR(50) DEFAULT 'available', -- available, under_negotiation, sold, rented
    owner_id UUID REFERENCES leads(id),
    broker_id UUID REFERENCES users(id),
    created_by UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de fotos das propriedades
CREATE TABLE IF NOT EXISTS property_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    caption VARCHAR(255),
    display_order INTEGER DEFAULT 0,
    is_cover BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de contratos
CREATE TABLE IF NOT EXISTS contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_type VARCHAR(50) NOT NULL, -- sale, rental
    property_id UUID REFERENCES properties(id),
    buyer_id UUID REFERENCES leads(id),
    seller_id UUID REFERENCES leads(id),
    tenant_id UUID REFERENCES leads(id),
    landlord_id UUID REFERENCES leads(id),
    contract_value DECIMAL(12,2) NOT NULL,
    commission_percentage DECIMAL(5,2),
    commission_value DECIMAL(12,2),
    start_date DATE,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'draft', -- draft, active, completed, cancelled
    contract_terms JSONB DEFAULT '{}',
    broker_id UUID REFERENCES users(id),
    created_by UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Atualizar tabela de documentos para referenciar as novas tabelas
ALTER TABLE documents ADD COLUMN IF NOT EXISTS lead_id UUID REFERENCES leads(id);
ALTER TABLE documents ADD COLUMN IF NOT EXISTS contract_id UUID REFERENCES contracts(id);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_next_followup ON leads(next_follow_up) WHERE next_follow_up IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_lead_activities_lead_id ON lead_activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_activities_date ON lead_activities(activity_date);

CREATE INDEX IF NOT EXISTS idx_lead_tasks_assigned_to ON lead_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_lead_tasks_status ON lead_tasks(status);
CREATE INDEX IF NOT EXISTS idx_lead_tasks_due_date ON lead_tasks(due_date) WHERE due_date IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_transaction ON properties(transaction_type);
CREATE INDEX IF NOT EXISTS idx_properties_broker ON properties(broker_id);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);

-- Triggers para updated_at
CREATE TRIGGER IF NOT EXISTS update_leads_updated_at 
    BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_lead_tasks_updated_at 
    BEFORE UPDATE ON lead_tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_properties_updated_at 
    BEFORE UPDATE ON properties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_contracts_updated_at 
    BEFORE UPDATE ON contracts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para calcular score do lead automaticamente
CREATE OR REPLACE FUNCTION calculate_lead_score(
    p_source VARCHAR(50),
    p_budget_min DECIMAL(12,2),
    p_budget_max DECIMAL(12,2),
    p_interest VARCHAR(50),
    p_has_phone BOOLEAN,
    p_has_email BOOLEAN
)
RETURNS INTEGER AS $$
DECLARE
    score INTEGER := 0;
BEGIN
    -- Pontuação por fonte
    CASE p_source
        WHEN 'referral' THEN score := score + 30;
        WHEN 'website' THEN score := score + 25;
        WHEN 'walk-in' THEN score := score + 20;
        WHEN 'google' THEN score := score + 15;
        WHEN 'phone' THEN score := score + 15;
        WHEN 'facebook' THEN score := score + 10;
        ELSE score := score + 5;
    END CASE;
    
    -- Pontuação por orçamento
    IF p_budget_min IS NOT NULL AND p_budget_max IS NOT NULL THEN
        IF p_budget_min > 500000 THEN
            score := score + 25;
        ELSIF p_budget_min > 300000 THEN
            score := score + 15;
        ELSE
            score := score + 10;
        END IF;
    END IF;
    
    -- Pontuação por interesse
    CASE p_interest
        WHEN 'sell' THEN score := score + 25;
        WHEN 'buy' THEN score := score + 20;
        ELSE score := score + 10;
    END CASE;
    
    -- Pontuação por dados de contato
    IF p_has_phone THEN score := score + 10; END IF;
    IF p_has_email THEN score := score + 10; END IF;
    
    RETURN LEAST(score, 100);
END;
$$ LANGUAGE plpgsql;

-- Trigger para calcular score automaticamente
CREATE OR REPLACE FUNCTION update_lead_score()
RETURNS TRIGGER AS $$
BEGIN
    NEW.score := calculate_lead_score(
        NEW.source,
        NEW.budget_min,
        NEW.budget_max,
        NEW.interest,
        NEW.phone IS NOT NULL,
        NEW.email IS NOT NULL
    );
    
    -- Calcula prioridade baseado no score
    IF NEW.score >= 80 OR NEW.source = 'referral' THEN
        NEW.priority := 'high';
    ELSIF NEW.score >= 60 THEN
        NEW.priority := 'medium';
    ELSE
        NEW.priority := 'low';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_lead_score_trigger
    BEFORE INSERT OR UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_lead_score();

-- Função para buscar leads que precisam de follow-up
CREATE OR REPLACE FUNCTION get_leads_needing_followup(days_threshold INTEGER DEFAULT 3)
RETURNS TABLE (
    lead_id UUID,
    lead_name VARCHAR(255),
    assigned_to UUID,
    last_contact TIMESTAMP WITH TIME ZONE,
    days_since_contact INTEGER,
    priority VARCHAR(20),
    status VARCHAR(50)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        l.id,
        l.name,
        l.assigned_to,
        l.last_contact,
        EXTRACT(DAY FROM NOW() - COALESCE(l.last_contact, l.created_at))::INTEGER,
        l.priority,
        l.status
    FROM leads l
    WHERE l.status NOT IN ('closed', 'lost')
    AND (
        l.last_contact IS NULL OR 
        l.last_contact < NOW() - INTERVAL '%s days', days_threshold
    )
    ORDER BY l.score DESC, l.created_at ASC;
END;
$$ LANGUAGE plpgsql;

-- View para dashboard de leads
CREATE OR REPLACE VIEW lead_dashboard AS
SELECT 
    l.*,
    u.name as assigned_to_name,
    (
        SELECT COUNT(*) 
        FROM lead_tasks lt 
        WHERE lt.lead_id = l.id 
        AND lt.status IN ('pending', 'in_progress')
    ) as pending_tasks,
    (
        SELECT COUNT(*) 
        FROM documents d 
        WHERE d.lead_id = l.id 
        AND d.is_latest_version = true
        AND d.deleted_at IS NULL
    ) as documents_count,
    (
        SELECT la.activity_date
        FROM lead_activities la
        WHERE la.lead_id = l.id
        ORDER BY la.activity_date DESC
        LIMIT 1
    ) as last_activity_date
FROM leads l
LEFT JOIN users u ON l.assigned_to = u.id;

-- Inserir dados de exemplo (usuários)
INSERT INTO users (email, name, role, phone) VALUES
('admin@novipe.com', 'Administrador', 'admin', '(11) 99999-9999'),
('joao@novipe.com', 'João Silva', 'broker', '(11) 98888-8888'),
('maria@novipe.com', 'Maria Santos', 'broker', '(11) 97777-7777')
ON CONFLICT (email) DO NOTHING;

-- RLS (Row Level Security)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS (exemplo básico - ajustar conforme necessário)
CREATE POLICY "Users can see their own leads" ON leads
    FOR ALL USING (assigned_to = auth.uid() OR created_by = auth.uid());

CREATE POLICY "Users can see activities of their leads" ON lead_activities
    FOR ALL USING (
        lead_id IN (
            SELECT id FROM leads 
            WHERE assigned_to = auth.uid() OR created_by = auth.uid()
        )
    );
