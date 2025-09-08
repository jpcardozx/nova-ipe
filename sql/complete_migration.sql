-- Script de Migração Completa - CRM + Gestão de Documentos
-- Execute este script em ordem para configurar o sistema completo

-- ==================== VERIFICAÇÃO E LIMPEZA ====================

-- Verificar se já existem as tabelas
DO $$ 
DECLARE
    table_exists boolean;
BEGIN
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'document_management_leads'
    ) INTO table_exists;
    
    IF table_exists THEN
        RAISE NOTICE 'Tabelas já existem. Execute o script de limpeza primeiro se necessário.';
    END IF;
END $$;

-- ==================== CRIAÇÃO DAS TABELAS ====================

-- 1. Tipos de Documento
CREATE TABLE IF NOT EXISTS document_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    required_fields JSONB DEFAULT '[]',
    workflow_stages JSONB DEFAULT '["draft", "review", "approved", "signed", "archived"]',
    default_permissions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Leads (CRM Principal)
CREATE TABLE IF NOT EXISTS document_management_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    status VARCHAR(50) DEFAULT 'new',
    source VARCHAR(100),
    assigned_to UUID,
    score INTEGER DEFAULT 0,
    tags TEXT[],
    custom_fields JSONB DEFAULT '{}',
    next_follow_up TIMESTAMP WITH TIME ZONE,
    last_contact TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Atividades
CREATE TABLE IF NOT EXISTS lead_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES document_management_leads(id) ON DELETE CASCADE,
    user_id UUID,
    activity_type VARCHAR(50) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT,
    outcome VARCHAR(100),
    scheduled_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Propriedades
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    property_type VARCHAR(50),
    address JSONB,
    price DECIMAL(15,2),
    area DECIMAL(10,2),
    bedrooms INTEGER,
    bathrooms INTEGER,
    features JSONB DEFAULT '[]',
    status VARCHAR(50) DEFAULT 'available',
    images JSONB DEFAULT '[]',
    owner_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Contratos
CREATE TABLE IF NOT EXISTS contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES document_management_leads(id),
    property_id UUID REFERENCES properties(id),
    contract_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft',
    start_date DATE,
    end_date DATE,
    monthly_value DECIMAL(15,2),
    terms JSONB DEFAULT '{}',
    signatures JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Documentos
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_name VARCHAR(255) NOT NULL,
    original_file_name VARCHAR(255),
    file_size BIGINT,
    file_type VARCHAR(100),
    file_path TEXT,
    status VARCHAR(50) DEFAULT 'draft',
    version INTEGER DEFAULT 1,
    
    -- Relacionamentos
    lead_id UUID REFERENCES document_management_leads(id) ON DELETE SET NULL,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    contract_id UUID REFERENCES contracts(id) ON DELETE SET NULL,
    document_type_id UUID REFERENCES document_types(id) ON DELETE SET NULL,
    parent_document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    
    -- Metadados
    metadata JSONB DEFAULT '{}',
    tags TEXT[],
    
    -- Workflow
    current_stage VARCHAR(50) DEFAULT 'draft',
    workflow_data JSONB DEFAULT '{}',
    
    -- Assinatura
    requires_signature BOOLEAN DEFAULT false,
    signature_data JSONB DEFAULT '{}',
    signed_at TIMESTAMP WITH TIME ZONE,
    signed_by UUID,
    
    -- Permissões
    access_level VARCHAR(50) DEFAULT 'private',
    shared_with JSONB DEFAULT '[]',
    
    -- Auditoria
    uploaded_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    archived_at TIMESTAMP WITH TIME ZONE
);

-- 7. Versões de Documentos
CREATE TABLE IF NOT EXISTS document_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT,
    changes_description TEXT,
    uploaded_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(document_id, version_number)
);

-- 8. Tarefas
CREATE TABLE IF NOT EXISTS document_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    task_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    priority VARCHAR(20) DEFAULT 'medium',
    
    -- Relacionamentos
    lead_id UUID REFERENCES document_management_leads(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    assigned_to UUID,
    created_by UUID NOT NULL,
    
    -- Datas
    due_date TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadados
    completion_notes TEXT,
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Compartilhamentos
CREATE TABLE IF NOT EXISTS document_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    shared_with_email VARCHAR(255),
    shared_by UUID NOT NULL,
    access_type VARCHAR(50) DEFAULT 'view',
    expires_at TIMESTAMP WITH TIME ZONE,
    access_token VARCHAR(255) UNIQUE,
    accessed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Comentários
CREATE TABLE IF NOT EXISTS document_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    comment TEXT NOT NULL,
    reply_to UUID REFERENCES document_comments(id) ON DELETE CASCADE,
    is_internal BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Pastas da Nuvem
CREATE TABLE IF NOT EXISTS cloud_folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    path TEXT NOT NULL UNIQUE,
    parent_path TEXT,
    description TEXT,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Índice para busca hierárquica
    CONSTRAINT cloud_folders_parent_path_fk 
        FOREIGN KEY (parent_path) 
        REFERENCES cloud_folders(path) 
        ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED
);

-- ==================== ÍNDICES ====================

-- Índices para performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_documents_lead_id ON documents(lead_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_documents_property_id ON documents(property_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_documents_contract_id ON documents(contract_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_documents_created_at ON documents(created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_documents_tags ON documents USING GIN(tags);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_lead_activities_lead_id ON lead_activities(lead_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_lead_activities_created_at ON lead_activities(created_at);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_document_tasks_lead_id ON document_tasks(lead_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_document_tasks_document_id ON document_tasks(document_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_document_tasks_assigned_to ON document_tasks(assigned_to);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_document_tasks_status ON document_tasks(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_document_tasks_due_date ON document_tasks(due_date);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leads_status ON document_management_leads(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leads_assigned_to ON document_management_leads(assigned_to);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leads_next_follow_up ON document_management_leads(next_follow_up);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cloud_folders_parent_path ON cloud_folders(parent_path);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cloud_folders_path ON cloud_folders(path);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cloud_folders_created_by ON cloud_folders(created_by);

-- ==================== FUNÇÕES E TRIGGERS ====================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_document_types_updated_at BEFORE UPDATE ON document_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON document_management_leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON lead_activities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON document_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON document_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cloud_folders_updated_at BEFORE UPDATE ON cloud_folders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para criar versão do documento
CREATE OR REPLACE FUNCTION create_document_version()
RETURNS TRIGGER AS $$
BEGIN
    -- Se o file_path mudou, criar uma nova versão
    IF OLD.file_path IS DISTINCT FROM NEW.file_path THEN
        INSERT INTO document_versions (
            document_id, 
            version_number, 
            file_path, 
            file_size, 
            changes_description,
            uploaded_by
        ) VALUES (
            NEW.id, 
            NEW.version, 
            NEW.file_path, 
            NEW.file_size,
            'Versão atualizada automaticamente',
            NEW.uploaded_by
        );
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para versionamento automático
CREATE TRIGGER document_versioning_trigger 
    AFTER UPDATE ON documents 
    FOR EACH ROW 
    EXECUTE FUNCTION create_document_version();

-- Função para log de atividades automático
CREATE OR REPLACE FUNCTION log_document_activity()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO lead_activities (
            lead_id, 
            activity_type, 
            subject, 
            description,
            metadata
        ) VALUES (
            NEW.lead_id,
            'document',
            'Documento criado',
            'Documento "' || NEW.title || '" foi criado',
            jsonb_build_object('document_id', NEW.id, 'action', 'created')
        );
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Log mudanças de status
        IF OLD.status IS DISTINCT FROM NEW.status THEN
            INSERT INTO lead_activities (
                lead_id, 
                activity_type, 
                subject, 
                description,
                metadata
            ) VALUES (
                NEW.lead_id,
                'document',
                'Status do documento alterado',
                'Documento "' || NEW.title || '" mudou de ' || OLD.status || ' para ' || NEW.status,
                jsonb_build_object('document_id', NEW.id, 'action', 'status_changed', 'old_status', OLD.status, 'new_status', NEW.status)
            );
        END IF;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Trigger para log automático
CREATE TRIGGER document_activity_log_trigger 
    AFTER INSERT OR UPDATE ON documents 
    FOR EACH ROW 
    EXECUTE FUNCTION log_document_activity();

-- ==================== RLS (Row Level Security) ====================

-- Habilitar RLS nas tabelas principais
ALTER TABLE document_management_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE cloud_folders ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (você pode ajustar conforme suas necessidades)
CREATE POLICY "Users can view their own leads" ON document_management_leads
    FOR SELECT USING (auth.uid() = assigned_to OR auth.uid() IN (
        SELECT unnest(string_to_array(current_setting('app.current_user_roles', true), ','))::uuid
    ));

CREATE POLICY "Users can view documents they have access to" ON documents
    FOR SELECT USING (
        uploaded_by = auth.uid() OR
        lead_id IN (
            SELECT id FROM document_management_leads 
            WHERE assigned_to = auth.uid()
        ) OR
        access_level = 'public'
    );

CREATE POLICY "Users can manage their own cloud folders" ON cloud_folders
    FOR ALL USING (created_by = auth.uid());

CREATE POLICY "Users can view shared cloud folders" ON cloud_folders
    FOR SELECT USING (
        created_by = auth.uid() OR
        path LIKE 'shared/%'
    );

-- ==================== DADOS INICIAIS ====================

-- Tipos de documento padrão para imobiliária
INSERT INTO document_types (name, description, workflow_stages) VALUES
('Contrato de Locação', 'Contrato para locação de imóveis', '["draft", "review", "legal_review", "approved", "signed", "active", "archived"]'),
('Contrato de Venda', 'Contrato para venda de imóveis', '["draft", "review", "legal_review", "approved", "signed", "completed"]'),
('Documentos Pessoais', 'CPF, RG, Comprovante de Renda', '["received", "verified", "approved", "archived"]'),
('Comprovante de Renda', 'Documentos de comprovação de renda', '["received", "analysis", "approved", "rejected"]'),
('Ficha Cadastral', 'Ficha de cadastro do cliente', '["draft", "completed", "verified"]'),
('Laudo de Vistoria', 'Relatório de vistoria do imóvel', '["scheduled", "in_progress", "completed", "approved"]'),
('Certidões', 'Certidões diversas do imóvel', '["requested", "received", "verified", "archived"]'),
('Proposta Comercial', 'Proposta de negócio', '["draft", "sent", "negotiating", "accepted", "rejected"]')
ON CONFLICT (name) DO NOTHING;

-- ==================== VIEWS ÚTEIS ====================

-- View para dashboard
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM document_management_leads) as total_leads,
    (SELECT COUNT(*) FROM document_management_leads WHERE created_at >= date_trunc('month', CURRENT_DATE)) as new_leads_this_month,
    (SELECT COUNT(*) FROM documents) as total_documents,
    (SELECT COUNT(*) FROM documents WHERE status = 'pending') as pending_documents,
    (SELECT COUNT(*) FROM document_tasks WHERE status IN ('pending', 'in_progress')) as active_tasks,
    (SELECT COUNT(*) FROM document_tasks WHERE status IN ('pending', 'in_progress') AND due_date < NOW()) as overdue_tasks,
    (SELECT ROUND(
        (COUNT(*) FILTER (WHERE status = 'closed') * 100.0 / NULLIF(COUNT(*), 0)), 2
    ) FROM document_management_leads WHERE created_at >= date_trunc('month', CURRENT_DATE)) as conversion_rate;

-- View para documentos com relacionamentos
CREATE OR REPLACE VIEW documents_detailed AS
SELECT 
    d.*,
    dt.name as document_type_name,
    l.name as lead_name,
    l.email as lead_email,
    p.title as property_title,
    c.contract_type
FROM documents d
LEFT JOIN document_types dt ON d.document_type_id = dt.id
LEFT JOIN document_management_leads l ON d.lead_id = l.id
LEFT JOIN properties p ON d.property_id = p.id
LEFT JOIN contracts c ON d.contract_id = c.id;

-- ==================== FUNÇÕES DE UTILIDADE ====================

-- Função para busca avançada de documentos
CREATE OR REPLACE FUNCTION search_documents(
    search_term TEXT DEFAULT '',
    lead_id_filter UUID DEFAULT NULL,
    status_filter TEXT DEFAULT NULL,
    document_type_filter UUID DEFAULT NULL,
    date_from TIMESTAMP DEFAULT NULL,
    date_to TIMESTAMP DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    title VARCHAR,
    status VARCHAR,
    file_type VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE,
    lead_name VARCHAR,
    document_type_name VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.id,
        d.title,
        d.status,
        d.file_type,
        d.created_at,
        l.name as lead_name,
        dt.name as document_type_name
    FROM documents d
    LEFT JOIN document_management_leads l ON d.lead_id = l.id
    LEFT JOIN document_types dt ON d.document_type_id = dt.id
    WHERE 
        (search_term = '' OR d.title ILIKE '%' || search_term || '%' OR d.description ILIKE '%' || search_term || '%')
        AND (lead_id_filter IS NULL OR d.lead_id = lead_id_filter)
        AND (status_filter IS NULL OR d.status = status_filter)
        AND (document_type_filter IS NULL OR d.document_type_id = document_type_filter)
        AND (date_from IS NULL OR d.created_at >= date_from)
        AND (date_to IS NULL OR d.created_at <= date_to)
    ORDER BY d.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- ==================== VALIDAÇÕES ====================

-- Verificar se a migração foi executada com sucesso
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN (
        'document_types', 'document_management_leads', 'lead_activities', 
        'properties', 'contracts', 'documents', 'document_versions',
        'document_tasks', 'document_shares', 'document_comments'
    );
    
    IF table_count = 10 THEN
        RAISE NOTICE 'Migração executada com sucesso! Todas as % tabelas foram criadas.', table_count;
    ELSE
        RAISE WARNING 'Migração incompleta. Apenas % de 10 tabelas foram criadas.', table_count;
    END IF;
END $$;

-- ==================== DADOS DE TESTE (OPCIONAL) ====================

-- Descomente se quiser inserir dados de teste
/*
INSERT INTO document_management_leads (name, email, phone, status) VALUES
('João Silva', 'joao@email.com', '(11) 99999-9999', 'new'),
('Maria Santos', 'maria@email.com', '(11) 88888-8888', 'qualified'),
('Pedro Oliveira', 'pedro@email.com', '(11) 77777-7777', 'viewing');

INSERT INTO properties (title, property_type, price, address, status) VALUES
('Apartamento 2 quartos - Centro', 'apartment', 1200.00, '{"street": "Rua das Flores, 123", "city": "São Paulo", "state": "SP"}', 'available'),
('Casa 3 quartos - Vila Olímpia', 'house', 2500.00, '{"street": "Rua dos Jardins, 456", "city": "São Paulo", "state": "SP"}', 'available');
*/

COMMIT;
