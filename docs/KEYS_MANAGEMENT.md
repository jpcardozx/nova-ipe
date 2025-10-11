# Gestão de Chaves - Integração com Fluxo de Leads

## 📋 Visão Geral

A gestão de chaves foi integrada naturalmente ao fluxo de leads do CRM, **sem necessidade de tabela dedicada**. Quando um lead evolui para o status `won` (fechado/convertido), as informações de entrega de chaves são armazenadas no campo `custom_fields` (JSONB) da tabela `document_management_leads`.

## 🔄 Fluxo Natural do Lead

```
new → contacted → qualified → proposal → won
                                          ↓
                                    [Gestão de Chaves]
```

## 🗂️ Arquitetura da Solução

### **Decisão: Campo JSONB vs Tabela Dedicada**

✅ **Escolhida: Campo JSONB `custom_fields`**

**Vantagens:**
- ✅ Segue o fluxo natural do lead (não cria entidade separada)
- ✅ Menor complexidade de esquema (1 tabela vs 2+ tabelas)
- ✅ Flexibilidade para adicionar campos sem migração
- ✅ Performance: 1 query vs JOINs
- ✅ Dados contextualizados (chaves são parte do lead fechado)
- ✅ Manutenção simplificada

**Quando seria melhor tabela dedicada:**
- ❌ Se houvesse múltiplas entregas por lead
- ❌ Se houvesse histórico complexo de movimentações
- ❌ Se fosse uma entidade independente do lead

### **Estrutura do custom_fields**

```jsonb
{
  "key_delivery": {
    "status": "scheduled",              // pending | scheduled | delivered | returned | cancelled
    "property_id": "uuid-property",
    "property_title": "Apto 3Q Pinheiros",
    "property_address": "Rua X, 123",
    "scheduled_date": "2025-10-12T14:00:00Z",
    "delivered_date": null,
    "returned_date": null,
    "contract_id": "CTR-2025-001",
    "deposit_amount": 500.00,
    "keys_count": 2,
    "notes": "Entrega após às 14h",
    "broker_name": "Maria Corretora"
  }
}
```

## 📁 Arquivos Criados

### 1. **Frontend**
- `app/dashboard/keys/page.tsx` - Página de gestão de chaves
- Design tokens aplicados (cores, espaçamentos, sombras)
- Grid responsivo com 5 cards de estatísticas
- Filtros por status e busca por cliente/propriedade
- Fallback para dados mock em desenvolvimento

### 2. **Backend API**
- `app/api/keys/route.ts` - Endpoints REST
  - **GET** `/api/keys` - Lista todas as entregas + estatísticas
  - **POST** `/api/keys` - Registra nova entrega
  - **PATCH** `/api/keys` - Atualiza status da entrega

### 3. **Database**
- `sql/key_delivery_extension.sql` - Extensão SQL
  - **VIEW** `key_deliveries` - Simplifica queries
  - **FUNCTION** `register_key_delivery()` - Registra entrega
  - **FUNCTION** `update_key_delivery_status()` - Atualiza status
  - **INDEXES** para performance

### 4. **Navigation**
- `components/layout/DashboardSidebar.tsx` - Adicionado menu "Chaves"
  - Categoria: CRM
  - Ícone: Key (cyan-600)
  - Rota: `/dashboard/keys`

## 🔌 API Endpoints

### **GET /api/keys**
Lista todas as entregas de chaves

**Query Parameters:**
```typescript
?status=scheduled        // Filtrar por status
&client_name=João        // Buscar por cliente
```

**Response:**
```json
{
  "deliveries": [
    {
      "id": "uuid",
      "client_name": "João Silva",
      "client_email": "joao@email.com",
      "client_phone": "(11) 99999-1234",
      "delivery_status": "delivered",
      "property_id": "uuid",
      "property_title": "Apto 3Q Pinheiros",
      "property_address": "Rua X, 123",
      "scheduled_date": "2025-10-09T10:00:00Z",
      "delivered_date": "2025-10-09T10:30:00Z",
      "returned_date": null,
      "contract_id": "CTR-2025-001",
      "deposit_amount": 500.00,
      "keys_count": 2,
      "notes": "Entrega confirmada",
      "broker_name": "Maria Corretora",
      "created_at": "2025-10-05T14:00:00Z",
      "updated_at": "2025-10-09T10:30:00Z"
    }
  ],
  "stats": {
    "total": 10,
    "scheduled": 3,
    "delivered": 5,
    "pending": 1,
    "returned": 1
  }
}
```

### **POST /api/keys**
Registra nova entrega de chave

**Body:**
```json
{
  "lead_id": "uuid",              // REQUIRED
  "property_id": "uuid",          // REQUIRED
  "property_title": "string",     // REQUIRED
  "property_address": "string",   // REQUIRED
  "scheduled_date": "timestamp",  // OPTIONAL
  "contract_id": "string",        // OPTIONAL
  "deposit_amount": 500.00,       // OPTIONAL
  "keys_count": 2,                // DEFAULT: 1
  "notes": "string",              // OPTIONAL
  "broker_name": "string"         // OPTIONAL
}
```

**Validações:**
- Lead deve existir
- Lead deve estar no status `won`
- Campos obrigatórios: lead_id, property_id, property_title, property_address

**Response:**
```json
{
  "success": true,
  "message": "Key delivery registered successfully"
}
```

### **PATCH /api/keys**
Atualiza status da entrega

**Body:**
```json
{
  "lead_id": "uuid",              // REQUIRED
  "status": "delivered",          // REQUIRED: pending | scheduled | delivered | returned | cancelled
  "date": "timestamp"             // OPTIONAL (default: NOW)
}
```

**Comportamento:**
- `status: "scheduled"` → atualiza `scheduled_date`
- `status: "delivered"` → atualiza `delivered_date`
- `status: "returned"` → atualiza `returned_date`

**Response:**
```json
{
  "success": true,
  "message": "Key delivery status updated successfully"
}
```

## 🗃️ Database Schema

### **View: key_deliveries**
Abstrai a complexidade do JSONB para facilitar queries:

```sql
CREATE VIEW key_deliveries AS
SELECT 
    l.id,
    l.name as client_name,
    l.email as client_email,
    l.custom_fields->'key_delivery'->>'status' as delivery_status,
    -- ... outros campos
FROM document_management_leads l
WHERE 
    l.status = 'won'
    AND l.custom_fields ? 'key_delivery';
```

### **Indexes para Performance**
```sql
-- Index no objeto key_delivery
CREATE INDEX idx_leads_key_delivery 
ON document_management_leads ((custom_fields->'key_delivery'));

-- Index no status de entrega
CREATE INDEX idx_leads_key_status 
ON document_management_leads ((custom_fields->'key_delivery'->>'status'));
```

## 🚀 Como Usar

### **1. Frontend (Dashboard)**
Acesse `/dashboard/keys` para:
- Visualizar todas as entregas
- Filtrar por status (agendado, entregue, pendente, devolvido)
- Buscar por cliente ou propriedade
- Ver estatísticas em tempo real

### **2. Registrar Entrega (Backend)**
```typescript
// Quando um lead for fechado (status = 'won')
await fetch('/api/keys', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    lead_id: 'uuid-lead',
    property_id: 'uuid-property',
    property_title: 'Apartamento 3 Quartos',
    property_address: 'Rua dos Pinheiros, 1234',
    scheduled_date: '2025-10-15T14:00:00Z',
    keys_count: 2,
    broker_name: 'Maria Silva'
  })
})
```

### **3. Atualizar Status**
```typescript
// Quando as chaves forem entregues
await fetch('/api/keys', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    lead_id: 'uuid-lead',
    status: 'delivered'
  })
})
```

### **4. Query SQL Direta**
```sql
-- Listar todas as entregas agendadas para hoje
SELECT * FROM key_deliveries
WHERE delivery_status = 'scheduled'
  AND DATE(scheduled_date) = CURRENT_DATE;

-- Contar entregas por status
SELECT 
    delivery_status,
    COUNT(*) as total
FROM key_deliveries
GROUP BY delivery_status;
```

## 📊 Status da Entrega

| Status | Descrição | Data Atualizada |
|--------|-----------|----------------|
| `pending` | Aguardando agendamento | - |
| `scheduled` | Agendado com data | `scheduled_date` |
| `delivered` | Chaves entregues | `delivered_date` |
| `returned` | Chaves devolvidas | `returned_date` |
| `cancelled` | Entrega cancelada | - |

## ✅ Validações

### **POST /api/keys**
- ✅ Lead existe no banco
- ✅ Lead está no status `won`
- ✅ Campos obrigatórios preenchidos
- ✅ Property ID é válido

### **PATCH /api/keys**
- ✅ Status é válido (scheduled, delivered, returned, cancelled)
- ✅ Lead ID existe
- ✅ Entrega foi previamente registrada

## 🎨 UI/UX

### **Cards de Estatísticas**
- Total de entregas
- Agendadas (azul)
- Entregues (verde)
- Pendentes (amarelo)
- Devolvidas (cinza)

### **Filtros**
- Busca: Cliente, imóvel ou endereço
- Status: Todos, Agendados, Entregues, Pendentes, Devolvidos, Cancelados

### **Card de Entrega**
- Informações do imóvel
- Dados do cliente (telefone, e-mail)
- Status visual com badge colorido
- Datas (agendamento, entrega, devolução)
- Notas e observações
- Nome do corretor responsável

## 🔒 Segurança

- Rotas API protegidas por autenticação Supabase
- Validação de dados no backend
- Tipos TypeScript para type-safety
- Sanitização de inputs

## 🧪 Testes

### **Teste Manual**
1. Acesse `/dashboard/keys`
2. Página deve carregar (pode estar vazia inicialmente)
3. Dados mock são carregados como fallback
4. Filtros devem funcionar
5. Busca deve funcionar

### **Teste de API**
```bash
# Listar entregas
curl http://localhost:3000/api/keys

# Registrar entrega (requer lead_id válido)
curl -X POST http://localhost:3000/api/keys \
  -H "Content-Type: application/json" \
  -d '{
    "lead_id": "uuid",
    "property_id": "uuid",
    "property_title": "Teste",
    "property_address": "Rua Teste"
  }'
```

## 📝 Próximos Passos

1. **Executar migration SQL:**
   ```bash
   psql -h [host] -U [user] -d [database] -f sql/key_delivery_extension.sql
   ```

2. **Testar API em development:**
   ```bash
   pnpm dev
   ```

3. **Acessar página:**
   ```
   http://localhost:3000/dashboard/keys
   ```

4. **Integrar com fluxo de leads:**
   - Quando lead mudar para `won`, mostrar modal para registrar entrega
   - Adicionar botão "Registrar Entrega de Chaves" na página de lead

## 🎯 Conclusão

**Não foi necessária tabela dedicada.** A solução usa o fluxo natural do lead e o campo JSONB `custom_fields` para armazenar informações de entrega, mantendo a arquitetura simples e eficiente.

**Benefícios:**
- ✅ Integração natural com CRM
- ✅ Menos complexidade de schema
- ✅ Performance otimizada
- ✅ Flexibilidade para evolução
- ✅ Manutenção simplificada
