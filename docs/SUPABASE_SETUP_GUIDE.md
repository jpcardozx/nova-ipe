# Guia de Configuração do Supabase - Chaves Corretas

## ❌ Problema Atual
As chaves do Supabase no `.env.local` são **fictícias/de exemplo** e precisam ser substituídas pelas chaves reais do seu projeto.

## 🔑 Chaves que Estão Incorretas

### 1. `NEXT_PUBLIC_SUPABASE_ANON_KEY`
**Atual (fictícia):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmaGZwYWVobmpwZHdkb2NkendkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMDMxMzIsImV4cCI6MjA3MjU3OTEzMn0.-YL0e3oE6mRqL0K432iP3dlbTRPz8G07QJLOI0Ulcyk
```

### 2. `SUPABASE_SERVICE_ROLE_KEY`
**Atual (fictícia):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmaGZwYWVobmpwZHdkb2NkendkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzAwMzEzMiwiZXhwIjoyMDcyNTc5MTMyfQ.K3gvPQr4vPzJL3Qs9xY2wB1nM8fR7eT6uI0pS5dA9vC
```

## 🔧 Como Obter as Chaves Reais

### Passo 1: Acesse seu Dashboard do Supabase
1. Vá para [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Faça login na sua conta
3. Selecione o projeto **nova-ipe** (ou crie um novo)

### Passo 2: Obter a URL e Anon Key
1. No dashboard, vá em **Settings** → **API**
2. Copie:
   - **Project URL** → para `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API Key (anon public)** → para `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Passo 3: Obter a Service Role Key
1. Ainda em **Settings** → **API**
2. Na seção **Project API Keys**
3. Copie a **service_role (secret)** → para `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **IMPORTANTE:** A Service Role Key é **secreta** e não deve ser exposta no frontend!

## 📝 Atualize o .env.local

Substitua as chaves no arquivo `.env.local`:

```bash
# Configurações Supabase (substitua pelas suas chaves reais)
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJETO_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_real_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_real_aqui
```

## 🧪 Teste a Conexão

Após atualizar as chaves, execute:

```bash
pnpm test-crm
```

Se der certo, configure as tabelas:

```bash
pnpm setup-crm
```

## 📋 SQL Manual (Alternativa)

Se preferir, execute manualmente no **SQL Editor** do Supabase:

```sql
-- Cole o conteúdo de sql/setup-crm-tables.sql
```

## ✅ Checklist

- [ ] Acessar dashboard do Supabase
- [ ] Copiar URL do projeto
- [ ] Copiar Anon Key
- [ ] Copiar Service Role Key
- [ ] Atualizar .env.local
- [ ] Testar conexão com `pnpm test-crm`
- [ ] Configurar tabelas com `pnpm setup-crm`

## 🆘 Se Ainda Não Funcionar

1. Verifique se o projeto existe no Supabase
2. Confirme que as chaves foram copiadas completamente
3. Reinicie o terminal/VSCode
4. Execute `pnpm clean` e tente novamente
