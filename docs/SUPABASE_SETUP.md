# Setup do Supabase - Ipê Imóveis

Este documento descreve como configurar o banco de dados Supabase para o sistema Ipê Imóveis.

## 📋 Pré-requisitos

- Conta no Supabase (supabase.com)
- Projeto Supabase criado
- Credenciais de acesso (URL e Anon Key) configuradas no `.env`

## 🚀 Processo de Setup

### 1. Executar Scripts SQL

Execute os scripts SQL na seguinte ordem no SQL Editor do Supabase:

#### 1.1. Schema Inicial
```sql
-- Execute o conteúdo de: sql/01_initial_schema.sql
```

Este script cria:
- Tabelas base (profiles, access_requests, activity_logs, system_settings)
- Políticas RLS (Row Level Security)
- Índices para performance
- Triggers para campos updated_at

#### 1.2. Usuário Administrador
```sql
-- Execute o conteúdo de: sql/02_create_admin_user.sql
```

Este script cria:
- Funções auxiliares para gestão de usuários
- Trigger automático para criar perfis
- Função para aprovar solicitações de acesso
- Configurações iniciais do sistema

#### 1.3. Dados de Exemplo
```sql
-- Execute o conteúdo de: sql/03_sample_data.sql
```

Este script adiciona:
- Departamentos pré-configurados
- Solicitações de acesso de exemplo
- Dados de desenvolvimento

### 2. Criar Usuário Administrador

#### Via Supabase Dashboard:
1. Acesse **Authentication > Users**
2. Clique em **"Add user"**
3. Preencha os dados:
   - **Email:** `admin@ipeimoveis.com`
   - **Password:** `IpeAdmin123!`
   - **Confirm email:** `Yes` (marcar)
4. Clique em **"Create user"**

#### Atualizar Perfil do Admin:
Após criar o usuário, execute no SQL Editor:

```sql
-- Substitua 'USER_ID_AQUI' pelo UUID real do usuário criado
UPDATE public.profiles 
SET 
    full_name = 'Administrador do Sistema',
    department = 'Administrativo',
    role = 'super_admin',
    phone = '+55 11 99999-9999',
    is_active = true,
    is_approved = true,
    approved_at = NOW()
WHERE email = 'admin@ipeimoveis.com';
```

### 3. Configurar RLS (Row Level Security)

As políticas RLS já são criadas automaticamente pelo script inicial. Elas garantem que:

- **Profiles:** Usuários veem apenas seu próprio perfil, admins veem todos
- **Access Requests:** Qualquer um pode criar, apenas admins podem gerenciar
- **Activity Logs:** Apenas admins podem visualizar
- **System Settings:** Apenas admins podem gerenciar

### 4. Verificar Setup

Execute para verificar se tudo foi criado corretamente:

```sql
-- Verificar tabelas criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Verificar usuário admin
SELECT id, email, full_name, role, is_approved 
FROM public.profiles 
WHERE email = 'admin@ipeimoveis.com';

-- Verificar configurações do sistema
SELECT key, value 
FROM public.system_settings;
```

## 🔐 Estrutura de Permissões

### Roles Disponíveis:
- **super_admin:** Acesso total ao sistema
- **admin:** Gerencia usuários e configurações
- **manager:** Supervisiona departamentos
- **user:** Usuário padrão

### Departamentos:
- **Vendas:** Gestão de vendas de imóveis
- **Locação:** Gestão de aluguéis
- **Marketing:** Marketing e divulgação
- **Administrativo:** Gestão geral
- **Financeiro:** Controle financeiro
- **Jurídico:** Questões legais

## 🛠 Funções Personalizadas

### `approve_access_request(request_id, notes)`
Aprova uma solicitação de acesso pendente.

### `log_activity(action, entity_type, entity_id, details)`
Registra atividade no sistema para auditoria.

### `handle_new_user()`
Trigger que cria perfil automaticamente quando usuário é criado no auth.

## 📊 Monitoramento

### Logs de Atividade
Todas as ações importantes são registradas em `activity_logs`:
- Login/logout de usuários
- Aprovação de solicitações
- Alterações em configurações
- Ações administrativas

### Métricas Disponíveis
- Total de usuários ativos
- Solicitações pendentes
- Atividade por período
- Taxa de aprovação

## 🚨 Troubleshooting

### Erro: "Permission denied for table profiles"
- Verifique se as políticas RLS foram criadas
- Confirme que o usuário tem o role correto

### Erro: "User not found"
- Verifique se o usuário foi criado no Supabase Auth
- Confirme que o trigger `handle_new_user` está ativo

### Erro: "Access request not found"
- Verifique se a solicitação existe e está com status 'pending'
- Confirme que o usuário tem permissão de admin

## 📝 Próximos Passos

Após o setup:

1. ✅ Testar login com usuário admin
2. ✅ Verificar dashboard de administração
3. ✅ Testar fluxo de solicitação de acesso
4. ✅ Configurar backup automático
5. ✅ Implementar notificações por email

---

**Criado em:** `{data_atual}`  
**Versão:** 1.0.0  
**Sistema:** Ipê Imóveis