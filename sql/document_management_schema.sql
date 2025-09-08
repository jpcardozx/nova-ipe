-- Schema completo para gestão de documentos integrado com CRM

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Tipos de documento configuráveis
CREATE TABLE IF NOT EXISTS document_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- client, property, contract, legal, financial, marketing
    description TEXT,
    required_fields JSONB DEFAULT '[]',
    workflow_stages JSONB DEFAULT '[]',
    template_url TEXT,
    retention_days INTEGER DEFAULT 2555, -- 7 anos padrão
    is_required BOOLEAN DEFAULT false,
    auto_expire BOOLEAN DEFAULT false,
    requires_signature BOOLEAN DEFAULT false,
    max_file_size_mb INTEGER DEFAULT 50,
    allowed_file_types TEXT[] DEFAULT '{pdf,doc,docx,jpg,jpeg,png}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documentos principais
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_type_id UUID REFERENCES document_types(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Relacionamentos com outras entidades
    client_id UUID, -- FK para tabela de clientes quando existir
    property_id UUID REFERENCES properties(id),
    contract_id UUID REFERENCES contracts(id),
    lead_id UUID REFERENCES leads(id),
    
    -- Informações do arquivo físico
    file_name VARCHAR(500),
    original_file_name VARCHAR(500),
    file_size BIGINT,
    file_type VARCHAR(100),
    file_path TEXT,
    file_hash VARCHAR(64), -- SHA-256 para detectar duplicatas
    storage_provider VARCHAR(50) DEFAULT 'supabase', -- supabase, s3, local
    storage_metadata JSONB DEFAULT '{}',
    
    -- Controle de versão
    version INTEGER DEFAULT 1,
    parent_document_id UUID REFERENCES documents(id),
    is_latest_version BOOLEAN DEFAULT true,
    version_notes TEXT,
    
    -- Workflow e status
    status VARCHAR(50) DEFAULT 'draft', -- draft, pending_review, under_review, approved, rejected, expired, archived
    current_stage VARCHAR(100),
    workflow_data JSONB DEFAULT '{}',
    approval_required BOOLEAN DEFAULT false,
    
    -- Controle de acesso
    visibility VARCHAR(20) DEFAULT 'team', -- private, team, public, client
    access_level VARCHAR(20) DEFAULT 'read', -- read, write, admin
    password_protected BOOLEAN DEFAULT false,
    access_password VARCHAR(255),
    
    -- Assinaturas digitais
    requires_signature BOOLEAN DEFAULT false,
    signature_data JSONB DEFAULT '{}',
    signed_by JSONB DEFAULT '[]',
    signing_deadline TIMESTAMP WITH TIME ZONE,
    
    -- Aprovações
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    approval_notes TEXT,
    
    -- Datas importantes
    expiry_date TIMESTAMP WITH TIME ZONE,
    reminder_date TIMESTAMP WITH TIME ZONE,
    last_accessed TIMESTAMP WITH TIME ZONE,
    
    -- Tags e categorização
    tags TEXT[] DEFAULT '{}',
    custom_fields JSONB DEFAULT '{}',
    
    -- Auditoria
    created_by UUID REFERENCES users(id) NOT NULL,
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT valid_status CHECK (status IN ('draft', 'pending_review', 'under_review', 'approved', 'rejected', 'expired', 'archived')),
    CONSTRAINT valid_visibility CHECK (visibility IN ('private', 'team', 'public', 'client')),
    CONSTRAINT valid_access_level CHECK (access_level IN ('read', 'write', 'admin'))
);

-- Tarefas relacionadas a documentos
CREATE TABLE IF NOT EXISTS document_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    task_type VARCHAR(50) NOT NULL, -- review, approve, sign, collect, send, update, archive
    assigned_to UUID REFERENCES users(id),
    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, urgent
    status VARCHAR(20) DEFAULT 'pending', -- pending, in_progress, completed, cancelled, overdue
    
    -- Automação
    auto_assign_rule JSONB DEFAULT '{}',
    escalation_rules JSONB DEFAULT '{}',
    
    -- Datas
    due_date TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Resultado da tarefa
    completion_notes TEXT,
    attachment_urls TEXT[] DEFAULT '{}',
    
    -- Auditoria
    created_by UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comentários e anotações
CREATE TABLE IF NOT EXISTS document_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) NOT NULL,
    comment TEXT NOT NULL,
    comment_type VARCHAR(50) DEFAULT 'comment', -- comment, approval, rejection, question, note
    is_internal BOOLEAN DEFAULT true,
    parent_comment_id UUID REFERENCES document_comments(id),
    
    -- Anexos ao comentário
    attachments JSONB DEFAULT '[]',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Log de atividades
CREATE TABLE IF NOT EXISTS document_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    activity_type VARCHAR(50) NOT NULL, -- created, updated, viewed, downloaded, shared, approved, rejected, signed, archived, restored
    activity_description TEXT,
    activity_data JSONB DEFAULT '{}',
    
    -- Dados de contexto
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(255),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Compartilhamentos e links
CREATE TABLE IF NOT EXISTS document_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    shared_by UUID REFERENCES users(id) NOT NULL,
    shared_with_email VARCHAR(255),
    shared_with_user_id UUID REFERENCES users(id),
    
    -- Configurações do compartilhamento
    access_type VARCHAR(20) DEFAULT 'view', -- view, download, edit
    expires_at TIMESTAMP WITH TIME ZONE,
    password_required BOOLEAN DEFAULT false,
    share_password VARCHAR(255),
    
    -- Controle de acesso
    max_downloads INTEGER,
    current_downloads INTEGER DEFAULT 0,
    
    -- Token único para acesso
    share_token VARCHAR(100) UNIQUE NOT NULL,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    last_accessed TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notificações relacionadas a documentos
CREATE TABLE IF NOT EXISTS document_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) NOT NULL,
    notification_type VARCHAR(50) NOT NULL, -- reminder, approval_needed, expired, shared, commented
    title VARCHAR(255) NOT NULL,
    message TEXT,
    
    -- Dados específicos da notificação
    notification_data JSONB DEFAULT '{}',
    
    -- Status
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    
    -- Configuração de entrega
    delivery_methods TEXT[] DEFAULT '{in_app}', -- in_app, email, sms, whatsapp
    sent_via TEXT[] DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Templates de documento
CREATE TABLE IF NOT EXISTS document_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_type_id UUID REFERENCES document_types(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    template_content TEXT, -- HTML/Markdown template
    template_fields JSONB DEFAULT '{}', -- Campos dinâmicos
    is_active BOOLEAN DEFAULT true,
    
    created_by UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_documents_lead_id ON documents(lead_id) WHERE lead_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_documents_property_id ON documents(property_id) WHERE property_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_documents_contract_id ON documents(contract_id) WHERE contract_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(document_type_id);
CREATE INDEX IF NOT EXISTS idx_documents_created_by ON documents(created_by);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at);
CREATE INDEX IF NOT EXISTS idx_documents_expiry ON documents(expiry_date) WHERE expiry_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_documents_latest_version ON documents(is_latest_version) WHERE is_latest_version = true;
CREATE INDEX IF NOT EXISTS idx_documents_file_hash ON documents(file_hash) WHERE file_hash IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_document_tasks_assigned_to ON document_tasks(assigned_to) WHERE assigned_to IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_document_tasks_status ON document_tasks(status);
CREATE INDEX IF NOT EXISTS idx_document_tasks_due_date ON document_tasks(due_date) WHERE due_date IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_document_activities_document ON document_activities(document_id);
CREATE INDEX IF NOT EXISTS idx_document_activities_user ON document_activities(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_document_activities_type ON document_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_document_activities_date ON document_activities(created_at);

CREATE INDEX IF NOT EXISTS idx_document_shares_token ON document_shares(share_token);
CREATE INDEX IF NOT EXISTS idx_document_shares_active ON document_shares(is_active) WHERE is_active = true;

-- Triggers para updated_at
CREATE TRIGGER update_document_types_updated_at 
    BEFORE UPDATE ON document_types
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at 
    BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_document_tasks_updated_at 
    BEFORE UPDATE ON document_tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_document_templates_updated_at 
    BEFORE UPDATE ON document_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para controle de versão
CREATE OR REPLACE FUNCTION handle_document_versioning()
RETURNS TRIGGER AS $$
BEGIN
    -- Se é uma atualização de arquivo, criar nova versão
    IF TG_OP = 'UPDATE' AND (
        OLD.file_path IS DISTINCT FROM NEW.file_path OR
        OLD.file_hash IS DISTINCT FROM NEW.file_hash
    ) THEN
        -- Marca versão anterior como não mais atual
        UPDATE documents 
        SET is_latest_version = false 
        WHERE parent_document_id = OLD.id OR id = OLD.id;
        
        -- Incrementa versão
        NEW.version = OLD.version + 1;
        NEW.is_latest_version = true;
        NEW.parent_document_id = OLD.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER document_versioning_trigger
    BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION handle_document_versioning();

-- Trigger para log de atividades
CREATE OR REPLACE FUNCTION log_document_activity()
RETURNS TRIGGER AS $$
DECLARE
    activity_type_val VARCHAR(50);
    user_id_val UUID;
BEGIN
    -- Determina o tipo de atividade
    IF TG_OP = 'INSERT' THEN
        activity_type_val = 'created';
        user_id_val = NEW.created_by;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.status != NEW.status THEN
            activity_type_val = 'status_changed';
        ELSE
            activity_type_val = 'updated';
        END IF;
        user_id_val = NEW.updated_by;
    ELSIF TG_OP = 'DELETE' THEN
        activity_type_val = 'deleted';
        user_id_val = OLD.updated_by;
    END IF;
    
    -- Insere log de atividade
    INSERT INTO document_activities (
        document_id, 
        user_id, 
        activity_type,
        activity_data
    ) VALUES (
        COALESCE(NEW.id, OLD.id),
        user_id_val,
        activity_type_val,
        jsonb_build_object(
            'old_status', CASE WHEN TG_OP = 'UPDATE' THEN OLD.status ELSE NULL END,
            'new_status', CASE WHEN TG_OP != 'DELETE' THEN NEW.status ELSE NULL END
        )
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_document_activity_trigger
    AFTER INSERT OR UPDATE OR DELETE ON documents
    FOR EACH ROW EXECUTE FUNCTION log_document_activity();

-- Função para limpeza automática de documentos expirados
CREATE OR REPLACE FUNCTION cleanup_expired_documents()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER := 0;
BEGIN
    -- Marca documentos expirados como arquivados
    UPDATE documents 
    SET status = 'expired', updated_at = NOW()
    WHERE expiry_date < NOW() 
    AND status NOT IN ('expired', 'archived')
    AND expiry_date IS NOT NULL;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Log da operação
    INSERT INTO document_activities (
        document_id, 
        activity_type, 
        activity_description,
        activity_data
    )
    SELECT 
        id,
        'auto_expired',
        'Document automatically expired',
        jsonb_build_object('expired_count', deleted_count)
    FROM documents 
    WHERE status = 'expired' 
    AND updated_at > NOW() - INTERVAL '1 minute';
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Views úteis
CREATE OR REPLACE VIEW document_dashboard AS
SELECT 
    d.*,
    dt.name as document_type_name,
    dt.category as document_category,
    dt.requires_signature as type_requires_signature,
    u1.name as created_by_name,
    u2.name as approved_by_name,
    (
        SELECT COUNT(*) 
        FROM document_tasks dt 
        WHERE dt.document_id = d.id 
        AND dt.status IN ('pending', 'in_progress')
    ) as pending_tasks,
    (
        SELECT COUNT(*) 
        FROM document_comments dc 
        WHERE dc.document_id = d.id
    ) as comments_count,
    (
        SELECT COUNT(*) 
        FROM document_activities da 
        WHERE da.document_id = d.id 
        AND da.created_at > NOW() - INTERVAL '7 days'
    ) as recent_activities
FROM documents d
LEFT JOIN document_types dt ON d.document_type_id = dt.id
LEFT JOIN users u1 ON d.created_by = u1.id
LEFT JOIN users u2 ON d.approved_by = u2.id
WHERE d.deleted_at IS NULL;

-- View para documentos que precisam de atenção
CREATE OR REPLACE VIEW documents_needing_attention AS
SELECT 
    d.*,
    dt.name as document_type_name,
    u.name as assigned_user_name,
    CASE 
        WHEN d.expiry_date < NOW() THEN 'expired'
        WHEN d.expiry_date < NOW() + INTERVAL '7 days' THEN 'expiring_soon'
        WHEN d.status = 'pending_review' THEN 'needs_review'
        WHEN d.requires_signature AND jsonb_array_length(d.signed_by) = 0 THEN 'needs_signature'
        WHEN EXISTS(
            SELECT 1 FROM document_tasks dt 
            WHERE dt.document_id = d.id 
            AND dt.due_date < NOW() 
            AND dt.status = 'pending'
        ) THEN 'overdue_tasks'
        ELSE 'other'
    END as attention_reason
FROM documents d
LEFT JOIN document_types dt ON d.document_type_id = dt.id
LEFT JOIN users u ON d.created_by = u.id
WHERE d.deleted_at IS NULL
AND (
    d.expiry_date < NOW() + INTERVAL '7 days' OR
    d.status = 'pending_review' OR
    (d.requires_signature AND jsonb_array_length(d.signed_by) = 0) OR
    EXISTS(
        SELECT 1 FROM document_tasks dt 
        WHERE dt.document_id = d.id 
        AND dt.due_date < NOW() 
        AND dt.status = 'pending'
    )
)
ORDER BY 
    CASE attention_reason
        WHEN 'expired' THEN 1
        WHEN 'overdue_tasks' THEN 2
        WHEN 'expiring_soon' THEN 3
        WHEN 'needs_signature' THEN 4
        WHEN 'needs_review' THEN 5
        ELSE 6
    END,
    d.created_at DESC;

-- Inserir tipos de documento padrão para imobiliária
INSERT INTO document_types (name, category, description, required_fields, workflow_stages, requires_signature, is_required) VALUES
('RG', 'client', 'Registro Geral (Identidade)', '["numero", "orgao_emissor", "data_emissao"]', '["coleta", "verificacao", "aprovacao"]', false, true),
('CPF', 'client', 'Cadastro de Pessoa Física', '["numero", "situacao"]', '["coleta", "verificacao", "aprovacao"]', false, true),
('Comprovante de Renda', 'client', 'Documento de comprovação de renda', '["valor", "periodo", "fonte"]', '["coleta", "analise", "aprovacao"]', false, true),
('Comprovante de Residência', 'client', 'Comprovante de endereço', '["endereco", "data_emissao"]', '["coleta", "verificacao", "aprovacao"]', false, true),
('Escritura', 'property', 'Escritura do imóvel', '["registro", "cartorio", "area", "valor"]', '["verificacao", "analise_juridica", "aprovacao"]', false, true),
('IPTU', 'property', 'Imposto Predial e Territorial Urbano', '["ano", "valor", "situacao"]', '["coleta", "verificacao", "aprovacao"]', false, true),
('Matrícula do Imóvel', 'property', 'Certidão de matrícula atualizada', '["numero", "cartorio", "situacao"]', '["coleta", "analise_juridica", "aprovacao"]', false, true),
('Contrato de Compra e Venda', 'contract', 'Contrato principal de compra e venda', '["valor", "condicoes", "prazo"]', '["elaboracao", "revisao", "assinatura", "registro"]', true, true),
('Contrato de Locação', 'contract', 'Contrato de aluguel', '["valor", "prazo", "garantias"]', '["elaboracao", "revisao", "assinatura"]', true, true),
('Procuração', 'legal', 'Procuração para representação', '["outorgante", "outorgado", "poderes"]', '["elaboracao", "assinatura", "reconhecimento"]', true, false),
('Declaração de Imposto de Renda', 'financial', 'Declaração de IR do cliente', '["ano", "valor", "situacao"]', '["coleta", "analise", "aprovacao"]', false, false),
('Certidão Negativa de Débitos', 'legal', 'CND Federal, Estadual e Municipal', '["tipo", "validade"]', '["solicitacao", "coleta", "verificacao"]', false, false)
ON CONFLICT DO NOTHING;

-- RLS (Row Level Security)
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_activities ENABLE ROW LEVEL SECURITY;

-- Políticas RLS básicas (ajustar conforme necessário)
CREATE POLICY "Users can see documents they created or are assigned to" ON documents
    FOR SELECT USING (
        created_by = auth.uid() OR
        id IN (
            SELECT document_id FROM document_tasks 
            WHERE assigned_to = auth.uid()
        ) OR
        visibility = 'public'
    );

CREATE POLICY "Users can create documents" ON documents
    FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own documents" ON documents
    FOR UPDATE USING (created_by = auth.uid() OR updated_by = auth.uid());
