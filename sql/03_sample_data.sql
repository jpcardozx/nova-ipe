-- Dados de exemplo para desenvolvimento
-- ====================================

-- Inserir alguns departamentos de exemplo nas configurações
INSERT INTO public.system_settings (key, value, description) VALUES
('departments', '[
    {"value": "vendas", "label": "Vendas", "description": "Vendas de imóveis"},
    {"value": "locacao", "label": "Locação", "description": "Aluguel de imóveis"},
    {"value": "marketing", "label": "Marketing", "description": "Marketing e divulgação"},
    {"value": "admin", "label": "Administrativo", "description": "Gestão e administração"},
    {"value": "financeiro", "label": "Financeiro", "description": "Controle financeiro"},
    {"value": "juridico", "label": "Jurídico", "description": "Questões legais"}
]', 'Departamentos disponíveis no sistema')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Inserir algumas solicitações de acesso de exemplo (para desenvolvimento)
INSERT INTO public.access_requests (
    email, 
    full_name, 
    phone, 
    department, 
    justification,
    status
) VALUES
('vendedor1@ipeimoveis.com', 'João Silva', '(11) 99999-1111', 'vendas', 'Corretor experiente, trabalhando na área há 5 anos', 'pending'),
('vendedor2@ipeimoveis.com', 'Maria Santos', '(11) 99999-2222', 'vendas', 'Nova na equipe, preciso acessar o sistema para gerenciar clientes', 'pending'),
('marketing@ipeimoveis.com', 'Ana Costa', '(11) 99999-3333', 'marketing', 'Responsável pelo marketing digital da empresa', 'pending'),
('financeiro@ipeimoveis.com', 'Carlos Oliveira', '(11) 99999-4444', 'financeiro', 'Contador da empresa, preciso acessar relatórios financeiros', 'approved'),
('locacao@ipeimoveis.com', 'Fernanda Lima', '(11) 99999-5555', 'locacao', 'Especialista em locação de imóveis, 3 anos de experiência', 'pending')
ON CONFLICT (email) DO NOTHING;

-- Inserir algumas atividades de exemplo
-- (Estas serão criadas automaticamente quando houver atividade real no sistema)

-- Função para gerar dados de exemplo de atividade (apenas para desenvolvimento)
CREATE OR REPLACE FUNCTION public.generate_sample_activities()
RETURNS VOID AS $$
BEGIN
    -- Esta função seria chamada apenas em desenvolvimento
    -- para popular o sistema com dados de exemplo
    
    INSERT INTO public.activity_logs (user_id, action, entity_type, entity_id, details) VALUES
    (NULL, 'system_startup', 'system', 'main', '{"version": "1.0.0"}'),
    (NULL, 'schema_created', 'database', 'initial', '{"tables_created": 5}'),
    (NULL, 'sample_data_inserted', 'system', 'development', '{"purpose": "development_setup"}');
END;
$$ LANGUAGE plpgsql;

-- Executar a função de dados de exemplo
SELECT public.generate_sample_activities();