-- Sistema de gestão de documentos integrado com CRM e pendências

-- Tabela de tipos de documentos
CREATE TABLE document_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'client', 'property', 'contract', 'legal', 'financial'
    required_fields JSONB DEFAULT '[]',
    workflow_stages JSONB DEFAULT '[]',
    retention_days INTEGER DEFAULT 2555, -- 7 anos
    is_required BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela principal de documentos
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_type_id UUID REFERENCES document_types(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Relacionamentos
    client_id UUID, -- FK para clients
    property_id UUID, -- FK para properties  
    contract_id UUID, -- FK para contratos
    lead_id UUID, -- FK para leads
    
    -- Arquivo
    file_name VARCHAR(255),
    file_size BIGINT,
    file_type VARCHAR(100),
    file_path TEXT, -- Caminho no storage
    file_hash VARCHAR(64), -- SHA256 para verificação
    
    -- Controle de versão
    version INTEGER DEFAULT 1,
    parent_document_id UUID REFERENCES documents(id),
    is_latest_version BOOLEAN DEFAULT true,
    
    -- Status e workflow
    status VARCHAR(50) DEFAULT 'draft', -- draft, pending_review, approved, rejected, expired
    current_stage VARCHAR(100),
    workflow_data JSONB DEFAULT '{}',
    
    -- Controle de acesso
    visibility VARCHAR(20) DEFAULT 'private', -- private, team, public
    access_level VARCHAR(20) DEFAULT 'read', -- read, write, admin
    
    -- Assinaturas e aprovações
    requires_signature BOOLEAN DEFAULT false,
    signature_data JSONB DEFAULT '{}',
    approved_by UUID,
    approved_at TIMESTAMP WITH TIME ZONE,
    
    -- Datas importantes
    expiry_date TIMESTAMP WITH TIME ZONE,
    reminder_date TIMESTAMP WITH TIME ZONE,
    
    -- Auditoria
    created_by UUID NOT NULL,
    updated_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Índices
    CONSTRAINT valid_status CHECK (status IN ('draft', 'pending_review', 'approved', 'rejected', 'expired', 'archived'))
);

-- Tabela de tags para documentos
CREATE TABLE document_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    tag VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(document_id, tag)
);

-- Tabela de comentários/observações
CREATE TABLE document_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    comment TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de compartilhamento
CREATE TABLE document_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    shared_with_email VARCHAR(255),
    shared_with_user_id UUID,
    access_level VARCHAR(20) DEFAULT 'read',
    expires_at TIMESTAMP WITH TIME ZONE,
    access_token VARCHAR(255) UNIQUE,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de atividades/histórico
CREATE TABLE document_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    activity_type VARCHAR(50) NOT NULL, -- created, updated, viewed, downloaded, shared, approved, rejected
    activity_data JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de pendências relacionadas a documentos
CREATE TABLE document_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    task_type VARCHAR(50), -- review, approve, sign, collect, send
    assigned_to UUID,
    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, urgent
    status VARCHAR(20) DEFAULT 'pending', -- pending, in_progress, completed, cancelled
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de modelos de documentos
CREATE TABLE document_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    document_type_id UUID REFERENCES document_types(id),
    template_content TEXT, -- HTML ou JSON do template
    variables JSONB DEFAULT '[]', -- Variáveis que podem ser substituídas
    is_active BOOLEAN DEFAULT true,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_documents_client ON documents(client_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_documents_property ON documents(property_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_documents_status ON documents(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_documents_created_at ON documents(created_at);
CREATE INDEX idx_documents_expiry ON documents(expiry_date) WHERE expiry_date IS NOT NULL;
CREATE INDEX idx_document_tasks_assigned ON document_tasks(assigned_to, status);
CREATE INDEX idx_document_tasks_due ON document_tasks(due_date) WHERE status != 'completed';

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_document_types_updated_at BEFORE UPDATE ON document_types
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_document_tasks_updated_at BEFORE UPDATE ON document_tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para criar nova versão do documento
CREATE OR REPLACE FUNCTION create_document_version(
    original_doc_id UUID,
    new_file_path TEXT,
    new_file_size BIGINT,
    new_file_hash VARCHAR(64),
    updated_by_user UUID
)
RETURNS UUID AS $$
DECLARE
    new_doc_id UUID;
    current_version INTEGER;
BEGIN
    -- Busca a versão atual
    SELECT version INTO current_version 
    FROM documents 
    WHERE id = original_doc_id;
    
    -- Marca versão anterior como não sendo a mais recente
    UPDATE documents 
    SET is_latest_version = false 
    WHERE parent_document_id = original_doc_id OR id = original_doc_id;
    
    -- Cria nova versão
    INSERT INTO documents (
        document_type_id, title, description, client_id, property_id, 
        contract_id, lead_id, file_name, file_size, file_type, file_path, 
        file_hash, version, parent_document_id, is_latest_version,
        status, current_stage, workflow_data, visibility, access_level,
        requires_signature, created_by, updated_by
    )
    SELECT 
        document_type_id, title, description, client_id, property_id,
        contract_id, lead_id, file_name, new_file_size, file_type, new_file_path,
        new_file_hash, current_version + 1, 
        COALESCE(parent_document_id, original_doc_id), true,
        'draft', current_stage, workflow_data, visibility, access_level,
        requires_signature, updated_by_user, updated_by_user
    FROM documents 
    WHERE id = original_doc_id
    RETURNING id INTO new_doc_id;
    
    RETURN new_doc_id;
END;
$$ LANGUAGE plpgsql;

-- Inserir tipos de documentos padrão para imobiliária
INSERT INTO document_types (name, category, required_fields, workflow_stages, is_required) VALUES
('RG', 'client', '["numero", "orgao_emissor", "data_emissao"]', '["upload", "verificacao", "aprovado"]', true),
('CPF', 'client', '["numero"]', '["upload", "verificacao", "aprovado"]', true),
('Comprovante de Renda', 'client', '["valor", "periodo", "empresa"]', '["upload", "analise", "aprovado"]', true),
('Comprovante de Residência', 'client', '["endereco", "data_emissao"]', '["upload", "verificacao", "aprovado"]', true),
('Escritura', 'property', '["numero_registro", "cartorio"]', '["upload", "analise_juridica", "aprovado"]', true),
('IPTU', 'property', '["ano", "valor"]', '["upload", "verificacao", "aprovado"]', true),
('Certidão de Ônus', 'property', '["numero", "data_emissao"]', '["upload", "analise_juridica", "aprovado"]', true),
('Contrato de Compra e Venda', 'contract', '["valor", "condicoes_pagamento"]', '["elaboracao", "revisao", "assinatura", "registro"]', true),
('Contrato de Locação', 'contract', '["valor_aluguel", "prazo"]', '["elaboracao", "revisao", "assinatura"]', true),
('Ficha de Avaliação', 'property', '["valor_avaliado", "data_avaliacao"]', '["agendamento", "visita", "relatorio", "aprovado"]', false),
('Autorização de Venda', 'property', '["prazo", "comissao"]', '["elaboracao", "assinatura", "ativo"]', true),
('Proposta de Compra', 'contract', '["valor_proposto", "condicoes"]', '["elaboracao", "negociacao", "aceita", "rejeitada"]', false);

-- RLS (Row Level Security) - Configurar conforme necessário
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_comments ENABLE ROW LEVEL SECURITY;
