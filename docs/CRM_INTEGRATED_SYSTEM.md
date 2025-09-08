# Sistema CRM + Gestão de Documentos - Nova IPÊ

Sistema integrado de **gestão de leads (CRM)** e **gestão de documentos** com armazenamento no servidor, eliminando a dependência do WhatsApp e fornecendo uma solução profissional fluida.

## 🎯 Funcionalidades Principais

### ✅ CRM Integrado
- **Gestão completa de leads** com pipeline visual
- **Atividades automáticas** (calls, emails, WhatsApp, reuniões)
- **Sistema de tarefas** com prioridades e prazos
- **Follow-up automático** e agendamento
- **Dashboard em tempo real** com métricas

### ✅ Gestão de Documentos
- **Upload direto no servidor** (Supabase Storage)
- **Versionamento automático** de documentos
- **Workflow de aprovação** customizável
- **Assinatura digital** integrada
- **Compartilhamento seguro** com links temporários

### ✅ Integração Completa
- **Documentos vinculados a leads** automaticamente
- **Tarefas geradas** por ações de documentos
- **Atividades logadas** em tempo real
- **Notificações automáticas** de status

## 🚀 Arquivos Criados

```
📁 Sistema CRM + Documentos
├── 🗄️ sql/
│   └── complete_migration.sql           # Schema PostgreSQL completo
├── 🔧 scripts/
│   └── migrate-database.js              # Script de migração
├── 🎣 app/hooks/
│   └── useIntegratedCRM.ts              # Hook React principal
├── 🧩 app/components/business/
│   └── IntegratedDashboard.tsx          # Dashboard integrado
├── 🧩 app/components/modern/
│   └── DocumentManagerNew.tsx          # Gestão de documentos
├── 📚 app/lib/supabase/
│   └── integrated-service.ts            # Serviços integrados
└── 📄 app/crm-system/
    └── page.tsx                         # Página de demonstração
```

## 🛠️ Configuração

### 1. Executar Migração do Banco

```bash
# Via script automatizado
npm run migrate:db

# Ou manualmente no Supabase Dashboard
# Copie o conteúdo de sql/complete_migration.sql
# Cole no SQL Editor do Supabase e execute
```

### 2. Configurar Variáveis de Ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Configurar Storage no Supabase

1. Acesse **Storage** no Supabase Dashboard
2. Crie um bucket chamado `documents`
3. Configure as políticas de acesso:

```sql
-- Política para upload
CREATE POLICY "Users can upload documents" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'documents');

-- Política para download
CREATE POLICY "Users can download documents" ON storage.objects
FOR SELECT USING (bucket_id = 'documents');
```

## 📋 Como Usar

### 🎯 Dashboard Principal

```tsx
import IntegratedDashboard from '@/app/components/business/IntegratedDashboard'

// Dashboard geral
<IntegratedDashboard />

// Dashboard específico de um lead
<IntegratedDashboard leadId="uuid-do-lead" view="lead-detail" />
```

### 🎣 Hook useIntegratedCRM

```tsx
import { useIntegratedCRM } from '@/app/hooks/useIntegratedCRM'

function MeuComponente() {
    const {
        data,           // { lead, documents, tasks, activities, stats }
        loading,
        error,
        
        // Ações de leads
        createLead,
        updateLead,
        updateLeadStatus,
        
        // Ações de atividades
        logCall,
        logEmail,
        logWhatsApp,
        
        // Ações de documentos
        uploadDocument,
        downloadDocument,
        updateDocumentStatus,
        
        // Ações de tarefas
        createTask,
        completeTask,
        
        // Automações
        scheduleFollowUp
    } = useIntegratedCRM({ 
        leadId: 'opcional',
        autoRefresh: true,
        refreshInterval: 30000 
    })

    // Exemplo: Criar novo lead
    const handleCreateLead = async () => {
        const newLead = await createLead({
            name: 'João Silva',
            email: 'joao@email.com',
            phone: '(11) 99999-9999',
            status: 'new'
        })
    }

    // Exemplo: Upload de documento
    const handleUploadDocument = async (file: File) => {
        const document = await uploadDocument(file, {
            title: 'Contrato de Locação',
            description: 'Contrato para apartamento no centro',
            document_type_id: 'uuid-tipo-contrato',
            requires_signature: true
        })
    }

    // Exemplo: Log de atividade
    const handleLogCall = async () => {
        await logCall(leadId, 'interested', 'Cliente demonstrou interesse')
    }
}
```

### 📄 Gestão de Documentos

```tsx
import DocumentManagerNew from '@/app/components/modern/DocumentManagerNew'

// Gestão completa de documentos
<DocumentManagerNew />

// Documentos de um lead específico
<DocumentManagerNew leadId="uuid-do-lead" />
```

## 🔄 Workflows Automáticos

### 📝 Workflow de Documentos

1. **Upload** → Status: `draft`
2. **Revisão** → Status: `review` + Tarefa criada
3. **Aprovação** → Status: `approved` + Notificação
4. **Assinatura** → Status: `signed` + Atividade logada
5. **Arquivo** → Status: `archived`

### 🎯 Workflow de Leads

1. **Novo Lead** → Status: `new`
2. **Primeiro Contato** → Status: `contacted` + Atividade
3. **Qualificação** → Status: `qualified` + Score atualizado
4. **Visita** → Status: `viewing` + Agendamento
5. **Proposta** → Status: `proposal` + Documento gerado
6. **Negociação** → Status: `negotiating` + Tarefas
7. **Fechamento** → Status: `closed` + Contrato

## 📊 Exemplos de Uso

### Criar e Gerenciar um Lead Completo

```tsx
const { createLead, uploadDocument, scheduleFollowUp, logCall } = useIntegratedCRM()

// 1. Criar lead
const lead = await createLead({
    name: 'Maria Santos',
    email: 'maria@email.com',
    phone: '(11) 88888-8888',
    source: 'website'
})

// 2. Log primeira ligação
await logCall(lead.id, 'answered', 'Cliente interessada em apartamento 2 quartos')

// 3. Upload de documentos
await uploadDocument(file, {
    title: 'RG da Cliente',
    lead_id: lead.id,
    document_type_id: 'docs-pessoais-uuid'
})

// 4. Agendar follow-up
await scheduleFollowUp(lead.id, new Date('2024-02-01'), 'Ligar para agendar visita')
```

### Processar Documento com Workflow

```tsx
// 1. Upload inicial
const doc = await uploadDocument(contratoFile, {
    title: 'Contrato de Locação - Maria Santos',
    lead_id: leadId,
    requires_signature: true
})

// 2. Mover para revisão
await updateDocumentStatus(doc.id, 'review')

// 3. Criar tarefa de aprovação
await createDocumentTask(doc.id, 'approve', userManagerId)

// 4. Após aprovação, solicitar assinatura
await createDocumentTask(doc.id, 'sign', leadId)
```

## 🗃️ Estrutura do Banco

### Tabelas Principais

- `document_management_leads` - Leads do CRM
- `documents` - Documentos com versionamento
- `lead_activities` - Atividades e interações
- `document_tasks` - Tarefas e workflow
- `document_types` - Tipos de documento
- `properties` - Propriedades/Imóveis
- `contracts` - Contratos

### Views Úteis

- `dashboard_stats` - Estatísticas para dashboard
- `documents_detailed` - Documentos com relacionamentos

### Funções Úteis

- `search_documents()` - Busca avançada
- `update_updated_at_column()` - Timestamp automático
- `create_document_version()` - Versionamento
- `log_document_activity()` - Log automático

## 🔒 Segurança

### Row Level Security (RLS)

- **Usuários** só veem seus próprios leads
- **Documentos** restritos por permissão
- **Atividades** vinculadas ao usuário
- **Compartilhamentos** com tokens seguros

### Permissões

```sql
-- Usuários podem ver seus leads
CREATE POLICY "Users can view their own leads" ON document_management_leads
    FOR SELECT USING (auth.uid() = assigned_to)

-- Usuários podem ver documentos com acesso
CREATE POLICY "Users can view accessible documents" ON documents
    FOR SELECT USING (
        uploaded_by = auth.uid() OR
        lead_id IN (SELECT id FROM document_management_leads WHERE assigned_to = auth.uid())
    )
```

## 📈 Próximos Passos

### ✅ Implementado
- [x] Schema PostgreSQL completo
- [x] Serviços integrados Supabase
- [x] Hook React com todas as funcionalidades
- [x] Dashboard responsivo e moderno
- [x] Gestão de documentos com drag-drop
- [x] Workflow automático
- [x] Sistema de tarefas

### 🔜 Próximas Melhorias
- [ ] Notificações em tempo real (WebSockets)
- [ ] Relatórios avançados com gráficos
- [ ] Integração com email (SMTP)
- [ ] API para integrações externas
- [ ] App mobile (React Native)
- [ ] IA para score de leads

## 🐛 Solução de Problemas

### Erro de Migração
```bash
# Verificar conexão
npm run check-supabase

# Executar migração manual
# Copie sql/complete_migration.sql para Supabase Dashboard
```

### Erro de Upload
```tsx
// Verificar configuração do bucket
const { data, error } = await supabase.storage
    .from('documents')
    .list()

if (error) {
    console.error('Bucket não configurado:', error)
}
```

### Performance
```tsx
// Usar paginação
const { documents } = await CRMService.getDocuments({
    page: 1,
    limit: 20,
    lead_id: leadId
})

// Lazy loading para documentos grandes
const DocumentCard = lazy(() => import('./DocumentCard'))
```

## 📚 Recursos

- [Documentação Supabase](https://supabase.io/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)

---

**💡 Dica:** Para testar o sistema rapidamente, acesse `/crm-system` e explore todas as funcionalidades integradas!
