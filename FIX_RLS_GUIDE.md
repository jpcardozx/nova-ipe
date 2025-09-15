# 🚨 Guia de Correção Urgente - Row Level Security (RLS)

## ⚡ **CORREÇÃO IMEDIATA**

O RLS está bloqueando operações no banco. Execute uma das soluções abaixo **IMEDIATAMENTE**:

### 🔧 **Solução 1: Desabilitar RLS Completamente (RECOMENDADO para desenvolvimento)**

Execute no **SQL Editor do Supabase**:

```sql
-- CORREÇÃO URGENTE: Desabilitar RLS
ALTER TABLE crm_clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE crm_tasks DISABLE ROW LEVEL SECURITY;

-- Garantir permissões
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;

-- Testar
SELECT COUNT(*) FROM crm_clients;
SELECT COUNT(*) FROM crm_tasks;
```

### 🔧 **Solução 2: Executar Script Completo**

1. Execute o arquivo: `sql/005_disable_rls_development.sql` no Supabase SQL Editor

### 🔧 **Solução 3: Via Script Node.js (se tiver o helper)**

```bash
# No terminal do projeto:
node scripts/test-database-operations.js
```

---

## 🚨 **SINTOMAS DO PROBLEMA**

- ❌ Erro ao carregar clientes
- ❌ Erro ao criar tarefas
- ❌ Dashboard não carrega dados
- ❌ Mensagens como "RLS policy violation" ou "permission denied"

---

## ✅ **VERIFICAÇÃO APÓS CORREÇÃO**

Execute estas consultas no Supabase para confirmar que funcionou:

```sql
-- Verificar status RLS (deve mostrar FALSE)
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename IN ('crm_clients', 'crm_tasks');

-- Testar inserção
INSERT INTO crm_clients (name, email, status)
VALUES ('Teste Cliente', 'teste@teste.com', 'lead');

-- Testar consulta
SELECT COUNT(*) FROM crm_clients;
SELECT COUNT(*) FROM crm_tasks;
```

---

## 🔍 **CAUSA DO PROBLEMA**

As políticas RLS criadas estavam muito restritivas e bloqueando operações básicas:

- ❌ Políticas dependentes de `auth.uid()` não funcionavam
- ❌ Permissões insuficientes para usuários `authenticated`
- ❌ Joins entre tabelas causavam conflitos de RLS

---

## 🏗️ **ARQUIVOS CRIADOS PARA CORREÇÃO**

1. **`sql/004_fix_rls_policies.sql`** - Políticas mais permissivas
2. **`sql/005_disable_rls_development.sql`** - Desabilita RLS completamente
3. **`scripts/test-database-operations.js`** - Script de teste
4. **`lib/supabase/crm-service.ts`** - Service mais robusto com fallbacks

---

## 🎯 **PRÓXIMOS PASSOS APÓS CORREÇÃO**

1. ✅ Execute uma das soluções acima
2. ✅ Teste o dashboard `/dashboard/clients`
3. ✅ Teste criação de cliente novo
4. ✅ Teste criação de tarefa
5. ✅ Verifique se agenda funciona

---

## 🔒 **PARA PRODUÇÃO (FUTURO)**

Quando for para produção, você pode reativar RLS com políticas mais específicas:

```sql
-- Para produção futura (não execute agora)
ALTER TABLE crm_clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own clients" ON crm_clients
    FOR ALL USING (
        assigned_to = auth.uid() OR
        created_by = auth.uid()
    );
```

---

## 📞 **SE AINDA HOUVER PROBLEMA**

1. **Verifique variáveis de ambiente:**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

2. **Verifique no Supabase Dashboard:**
   - Authentication > Settings
   - Database > Roles & Permissions

3. **Execute o teste:**
   ```bash
   node scripts/test-database-operations.js
   ```

---

**⚡ EXECUTE A SOLUÇÃO 1 AGORA MESMO E O SISTEMA VOLTARÁ A FUNCIONAR!**