# 🔍 DIAGNÓSTICO COMPLETO - Por que não conseguimos executar migrations via script?

## 📊 RESUMO EXECUTIVO

**Status:** ✅ Migration JÁ FOI EXECUTADA (manualmente)  
**Problema:** ❌ Scripts TypeScript não conseguem executar SQL via REST API  
**Motivo:** 🔒 Limitação de segurança do Supabase  
**Solução:** ✅ Executar via Dashboard (método correto e recomendado)

---

## 🔬 ANÁLISE TÉCNICA

### 1. O Problema de Credenciais (✅ RESOLVIDO)

**Status:** Você TEM as credenciais corretas!

```env
✅ NEXT_PUBLIC_SUPABASE_URL=https://ifhfpaehnjpdwdocdzwd.supabase.co
✅ SUPABASE_SERVICE_ROLE_KEY=eyJ... (permissões ADMIN)
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... (permissões limitadas)
```

**Conclusão:** Não é problema de credencial. Você tem SERVICE_ROLE_KEY com permissões completas.

---

### 2. O Problema Real: Arquitetura do Supabase

#### Como Supabase Funciona

```
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE ARCHITECTURE                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┐      ┌──────────────────┐           │
│  │   PostgreSQL     │◄─────│   PostgREST      │           │
│  │   (Database)     │      │   (REST API)     │           │
│  └──────────────────┘      └──────────────────┘           │
│         ▲                          ▲                        │
│         │                          │                        │
│         │                          │                        │
│  ┌──────┴──────────┐      ┌───────┴────────┐             │
│  │  SQL Editor     │      │  REST Clients  │             │
│  │  (Dashboard)    │      │  (Your App)    │             │
│  └─────────────────┘      └────────────────┘             │
│    ✅ Acesso Direto        ❌ Acesso Limitado              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Por que REST API não executa SQL arbitrário?

**PostgREST** é um middleware que:
- ✅ Expõe tabelas como endpoints REST
- ✅ Permite SELECT, INSERT, UPDATE, DELETE em tabelas
- ✅ Permite chamar FUNCTIONS específicas via RPC
- ❌ **NÃO permite executar SQL arbitrário** (`CREATE TABLE`, `ALTER`, etc)

**Motivo:** Segurança! Se permitisse, qualquer app poderia:
- Dropar tabelas
- Criar triggers maliciosos
- Modificar schema
- Executar comandos perigosos

---

### 3. Tentativas de Execução (e por que falharam)

#### ❌ Tentativa 1: RPC `exec_sql()`

```typescript
await supabase.rpc('exec_sql', { 
  sql_query: 'CREATE TABLE ...' 
});
```

**Erro:**
```json
{
  "code": "PGRST202",
  "message": "Could not find the function public.exec_sql(sql_query)"
}
```

**Por quê?** A função `exec_sql()` **não existe por padrão** no Supabase. Seria necessário criá-la primeiro (via Dashboard), mas isso também requer permissões especiais.

---

#### ❌ Tentativa 2: Direct SQL via REST

```typescript
await fetch(`${url}/rest/v1/rpc/exec_sql`, {
  method: 'POST',
  body: JSON.stringify({ sql_query: '...' })
});
```

**Erro:** HTTP 404 - Endpoint não existe

**Por quê?** PostgREST não expõe endpoints para executar SQL arbitrário, mesmo com SERVICE_ROLE_KEY.

---

#### ❌ Tentativa 3: Query Builder

```typescript
await supabase
  .from('information_schema.tables')
  .select('*');
```

**Erro:** `Could not find the table 'public.information_schema.tables'`

**Por quê?** PostgREST só expõe tabelas que estão no schema `public` E que foram descobertas no cache. `information_schema` não é exposto.

---

### 4. O Cache do PostgREST

**Problema descoberto:**

```bash
# Diagnóstico mostrou:
✅ Tabelas existem (via SELECT em rent_adjustments)
❌ Mas INSERT falha (table not in schema cache)
```

**O que aconteceu:**

1. Tabelas foram criadas via Dashboard ✅
2. PostgreSQL tem as tabelas ✅
3. **PostgREST cache NÃO foi atualizado** ⚠️
4. REST API não "vê" as novas tabelas ainda ❌

**Como o cache funciona:**

```
CREATE TABLE → PostgreSQL (✅)
                    ↓
            PostgREST Cache (❌ não atualizado)
                    ↓
            REST API (❌ 404 not found)
```

**Solução:** Restart do PostgREST ou wait (cache atualiza automaticamente)

---

## 💡 SOLUÇÕES DISPONÍVEIS

### ✅ Solução A: Dashboard (Recomendado)

**Como você fez (e funcionou!):**

```bash
1. Acesse: https://supabase.com/dashboard/project/ifhfpaehnjpdwdocdzwd
2. Vá em: SQL Editor → New Query
3. Cole: conteúdo de supabase/migrations/20250108_create_aliquotas_tables.sql
4. Execute: RUN
5. ✅ Tabelas criadas!
```

**Vantagens:**
- ✅ Execução direta no PostgreSQL
- ✅ Sem limitações de API
- ✅ Pode criar tables, triggers, functions
- ✅ Feedback imediato de erros
- ✅ Histórico de queries

**Desvantagens:**
- ⚠️ Manual (não automatizado)
- ⚠️ Requer acesso ao Dashboard

---

### ✅ Solução B: Supabase CLI

```bash
# Instalar CLI
pnpm supabase link --project-ref ifhfpaehnjpdwdocdzwd

# Executar migrations
pnpm supabase db push

# Ou executar migration específica
pnpm supabase db execute --file supabase/migrations/20250108_create_aliquotas_tables.sql
```

**Vantagens:**
- ✅ Automatizado
- ✅ Versionamento
- ✅ CI/CD friendly
- ✅ Execução direta no PostgreSQL

**Desvantagens:**
- ⚠️ Requer configuração inicial
- ⚠️ Precisa de `supabase` CLI instalado

---

### ❌ Solução C: Scripts TypeScript (NÃO FUNCIONA)

**Por que não funciona:**

```typescript
// ❌ Não funciona - PostgREST não expõe exec_sql
await supabase.rpc('exec_sql', { sql_query: '...' });

// ❌ Não funciona - Endpoint não existe
await fetch(`${url}/rest/v1/rpc/exec_sql`, ...);

// ❌ Não funciona - Apenas para tabelas já expostas
await supabase.from('new_table').insert(...);
```

**Limitações do PostgREST:**
- Apenas tabelas no schema cache
- Apenas functions registradas
- Não executa DDL (CREATE, ALTER, DROP)
- Não executa SQL arbitrário

---

## 🎯 O QUE FAZER AGORA

### Situação Atual

```
✅ Tabelas criadas (via Dashboard)
✅ Schema correto
⚠️ PostgREST cache desatualizado
⚠️ Dados iniciais não inseridos
```

### Opção 1: Aguardar Cache Refresh (Automático)

O PostgREST atualiza o cache automaticamente a cada alguns minutos. Aguarde 5-10 minutos e tente:

```bash
pnpm migration:seed
```

---

### Opção 2: Inserir Dados via Dashboard (Imediato)

Execute no **SQL Editor** do Supabase:

```sql
-- Inserir configuração IGPM
INSERT INTO calculation_settings (
  name, 
  description, 
  method, 
  is_default, 
  active, 
  default_rate, 
  valid_from
) VALUES (
  'IGPM',
  'Índice Geral de Preços do Mercado - padrão para contratos de locação',
  'igpm',
  true,
  true,
  4.5,
  CURRENT_DATE
);

-- Inserir template PDF
INSERT INTO pdf_templates (
  name,
  description,
  content,
  is_default,
  active,
  variables
) VALUES (
  'Carta Padrão de Reajuste',
  'Template padrão para notificação de reajuste de aluguel',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; }
    .header { text-align: center; margin-bottom: 30px; }
    .content { line-height: 1.6; }
    .highlight { background: #f0f0f0; padding: 10px; margin: 20px 0; }
    .signature { margin-top: 60px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Notificação de Reajuste de Aluguel</h1>
  </div>
  
  <div class="content">
    <p>Prezado(a) <strong>{{client_name}}</strong>,</p>
    
    <p>Conforme estipulado em contrato de locação, vimos por meio desta comunicar o reajuste do valor do aluguel do imóvel localizado em <strong>{{property_address}}</strong>.</p>
    
    <div class="highlight">
      <p><strong>Dados do Reajuste:</strong></p>
      <ul>
        <li>Índice utilizado: <strong>{{index_type}}</strong></li>
        <li>Percentual: <strong>{{percentage}}%</strong></li>
        <li>Valor atual: <strong>R$ {{current_rent}}</strong></li>
        <li>Novo valor: <strong>R$ {{new_rent}}</strong></li>
        <li>Data de vigência: <strong>{{effective_date}}</strong></li>
      </ul>
    </div>
    
    <p>O novo valor entrará em vigor a partir da data mencionada acima.</p>
    
    <p>Permanecemos à disposição para quaisquer esclarecimentos.</p>
    
    <div class="signature">
      <p>Atenciosamente,</p>
      <p><strong>Imobiliária Ipê</strong></p>
      <p>{{signature_date}}</p>
    </div>
  </div>
</body>
</html>',
  true,
  ARRAY['client_name', 'property_address', 'index_type', 'percentage', 'current_rent', 'new_rent', 'effective_date', 'signature_date']::text[]
);
```

---

### Opção 3: Reload PostgREST Schema Cache

Execute no **SQL Editor**:

```sql
-- Notificar PostgREST para recarregar schema
NOTIFY pgrst, 'reload schema';
```

Ou via API:

```bash
curl -X POST "${SUPABASE_URL}/rest/v1/rpc/pgrst_reload_schema" \
  -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}"
```

---

## 📚 APRENDIZADOS

### 1. Supabase ≠ PostgreSQL Direto

```
PostgreSQL    → Full SQL access (CREATE, ALTER, DROP, etc)
Supabase API  → Limited REST access (SELECT, INSERT, UPDATE, DELETE only)
```

### 2. Migrations em Produção

**Métodos corretos:**

1. **Dashboard** - Manual, seguro, recomendado para primeira vez
2. **Supabase CLI** - Automatizado, para CI/CD
3. **SQL Editor** - Manual, para fixes rápidos

**Métodos que NÃO funcionam:**

1. ❌ Scripts TypeScript via REST API
2. ❌ `supabase.rpc('exec_sql')` (função não existe)
3. ❌ Fetch direto para endpoints não expostos

### 3. Cache do PostgREST

- Tabelas novas demoram para aparecer na REST API
- Aguardar alguns minutos OU
- Recarregar schema manualmente OU
- Usar Supabase CLI (bypassa REST API)

---

## ✅ CHECKLIST FINAL

- [x] Credenciais configuradas (SERVICE_ROLE_KEY)
- [x] Conexão com Supabase funcionando
- [x] Tabelas criadas (via Dashboard)
- [x] Migration SQL executada
- [ ] PostgREST cache atualizado (aguardando ou manual)
- [ ] Dados iniciais inseridos (IGPM + Template)
- [ ] Próximo: Criar API routes
- [ ] Próximo: Criar UI components

---

## 🎓 CONCLUSÃO

**Não foi problema de credencial!** Você tem SERVICE_ROLE_KEY corretamente configurada.

**O problema real:** Supabase REST API (PostgREST) **não permite executar SQL arbitrário** por design de segurança.

**Solução correta:** Executar migrations via **Dashboard** (como você fez) ou **Supabase CLI**.

**Status atual:** ✅ Migration executada com sucesso! Aguardando apenas:
1. Cache refresh do PostgREST (automático)
2. Inserir dados iniciais (via Dashboard ou aguardar cache)
3. Continuar com API routes e UI

---

**Documentado em:** 08/10/2025  
**Diagnóstico realizado por:** Scripts TypeScript automatizados  
**Status:** ✅ Problema identificado e solucionado
