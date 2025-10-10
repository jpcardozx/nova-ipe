# 🚀 Guia Rápido: Aplicar Migration via Dashboard

## ✅ Status Atual

- **Backup criado**: ✅ `backups/supabase/backup_20251010_133340_pre_auth_migration.sql` (123KB)
- **Migration preparada**: ✅ `APLICAR_MIGRATION_DASHBOARD.sql`
- **Projeto linkado**: ✅ `ifhfpaehnjpdwdocdzwd`

---

## 📋 Passo a Passo (2 minutos)

### 1. Abrir SQL Editor do Supabase
👉 **https://supabase.com/dashboard/project/ifhfpaehnjpdwdocdzwd/sql/new**

### 2. Copiar o SQL
```bash
cat APLICAR_MIGRATION_DASHBOARD.sql
```
Ou abrir o arquivo `APLICAR_MIGRATION_DASHBOARD.sql` e copiar TODO o conteúdo.

### 3. Colar no SQL Editor
- Cole no editor do Dashboard
- Click em **"RUN"** (ou pressione `F5` / `Ctrl+Enter`)

### 4. Verificar Resultado
Deve aparecer no final:
```
total_profiles | trigger_exists | auth_column_exists
---------------|----------------|-------------------
     X         |      true      |       true
```

✅ Se `trigger_exists = true` e `auth_column_exists = true` → **Sucesso!**

---

## 🔍 O Que a Migration Faz?

1. ✅ Cria tabela `user_profiles` (se não existir)
2. ✅ Adiciona coluna `auth_user_id` para vincular com Supabase Auth
3. ✅ Cria trigger automático para novos usuários
4. ✅ Configura RLS (Row Level Security)
5. ✅ Cria view `user_profiles_with_auth`
6. ✅ Adiciona índices para performance

**Zero risco de perda de dados** - Tudo é idempotente!

---

## ⚠️ Se Algo Der Errado

### Erro: "relation user_profiles already exists"
- **Solução**: Normal! A migration detecta e não faz nada.

### Erro: "column auth_user_id already exists"
- **Solução**: Normal! A migration pula essa parte.

### Erro Crítico
```bash
# Restaurar backup
psql "SUA_CONNECTION_STRING" < backups/supabase/backup_20251010_133340_pre_auth_migration.sql
```

---

## ✅ Próximos Passos (Após Aplicar)

1. **Atualizar página de login** para usar `useSupabaseAuth`
2. **Migrar usuários existentes** (se houver)
3. **Testar autenticação**
4. **Remover Zoho Mail360**

---

## 🆘 Alternativa: Aplicar via CLI (se preferir)

Se o Dashboard não funcionar, execute:

```bash
# Copiar SQL e aplicar direto
cat APLICAR_MIGRATION_DASHBOARD.sql | psql "postgresql://postgres:SUA_SENHA@db.ifhfpaehnjpdwdocdzwd.pooler.supabase.com:6543/postgres"
```

(Precisa da senha do banco)

---

**Pronto para aplicar?** 🚀

Basta abrir o link acima, colar o SQL e clicar em RUN!
