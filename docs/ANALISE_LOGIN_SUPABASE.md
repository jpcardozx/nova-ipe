# 🔐 Análise: Fluxo de Autenticação /login

**Data:** 10 de outubro de 2025  
**Commit ref:** eed73aa9515d64d8ac5dc6ab9d325aa3f5036263  
**Status:** ⚠️ **PRECISA ATUALIZAÇÃO**

---

## 📊 Situação Atual

### ❌ Problemas Identificados

1. **Login usa Zoho Mail360** (linha 118-127 em `app/login/page.tsx`)
   ```typescript
   const zohoUser = await zohoMail360.verifyUser(fullEmail, data.password)
   ```
   - ❌ Não valida contra `auth.users` do Supabase
   - ❌ Depende de integração externa Zoho
   - ❌ Não aproveita a migration Supabase Auth que acabamos de criar

2. **Hook `useSupabaseAuth` criado mas NÃO está sendo usado**
   - ✅ Existe em `lib/hooks/useSupabaseAuth.ts`
   - ❌ Não é importado em `app/login/page.tsx`
   - ❌ Fluxo de login ignora Supabase Auth completamente

3. **API `/api/login/route.ts` é para Studio Admin apenas**
   - Valida senha de admin para acesso ao Sanity Studio
   - Não gerencia usuários normais do sistema

---

## 🎯 O Que Precisa Ser Feito

### Fase 1: Atualizar `/login` para Usar Supabase Auth ✅

**Mudanças necessárias em `app/login/page.tsx`:**

1. **Importar hook Supabase Auth**
   ```typescript
   import { useSupabaseAuth } from '@/lib/hooks/useSupabaseAuth'
   ```

2. **Usar no componente**
   ```typescript
   const { signIn, loading: authLoading } = useSupabaseAuth()
   ```

3. **Atualizar `onLoginSubmit`**
   ```typescript
   const onLoginSubmit = async (data: LoginFormValues) => {
     const fullEmail = `${data.username}${selectedDomain}`
     setIsLoading(true)
     setErrorMessage('')

     try {
       // Usar Supabase Auth em vez de Zoho
       const { error } = await signIn(fullEmail, data.password)
       
       if (error) {
         setErrorMessage('Usuário ou senha inválidos')
         return
       }

       // Sucesso - redirecionar
       if (loginMode === 'studio') {
         router.push('/studio')
       } else {
         router.push('/dashboard')
       }
       
     } catch (error) {
       console.error('Erro no login:', error)
       setErrorMessage('Erro na autenticação')
     } finally {
       setIsLoading(false)
     }
   }
   ```

---

### Fase 2: Migrar Usuários Zoho → Supabase ⏳

**Problema:** Se há usuários no Zoho Mail360, eles precisam ser migrados para `auth.users`.

**Solução:** Usar script já criado
```bash
cd /home/jpcardozx/projetos/nova-ipe
npx tsx scripts/migrate-users-to-supabase-auth.ts --dry-run
```

---

### Fase 3: Aplicar Migration Supabase Auth ⏳

**Status:** Migration SQL criada mas não aplicada no banco remoto.

**Ação:** Copiar `APLICAR_MIGRATION_DASHBOARD.sql` e executar no Dashboard Supabase.

---

## 🔄 Fluxo Atual vs. Fluxo Desejado

### ❌ Fluxo Atual (Zoho Mail360)
```
Usuário → /login → zohoMail360.verifyUser() → Zoho API → Success/Fail
                                                ↓
                                          localStorage
```

### ✅ Fluxo Desejado (Supabase Auth)
```
Usuário → /login → useSupabaseAuth.signIn() → Supabase Auth → Success/Fail
                                                    ↓
                                              Session Cookie
                                                    ↓
                                          user_profiles (RLS)
```

---

## 📋 Checklist de Implementação

### 1. Aplicar Migration Supabase Auth
- [ ] Copiar SQL de `APLICAR_MIGRATION_DASHBOARD.sql`
- [ ] Executar no Dashboard: https://supabase.com/dashboard/project/ifhfpaehnjpdwdocdzwd/sql/new
- [ ] Validar: `trigger_exists = true` e `auth_column_exists = true`

### 2. Atualizar Página de Login
- [ ] Importar `useSupabaseAuth` hook
- [ ] Remover dependência `zohoMail360`
- [ ] Atualizar `onLoginSubmit` para usar `signIn()`
- [ ] Testar login com usuário Supabase

### 3. Criar Usuários de Teste
- [ ] Registrar pelo menos 1 usuário via Supabase Dashboard
- [ ] Ou criar via signup (se implementado)
- [ ] Validar que `user_profiles` é criado automaticamente (trigger)

### 4. Migrar Usuários Existentes (se aplicável)
- [ ] Listar usuários Zoho atuais
- [ ] Executar script de migração
- [ ] Enviar emails de reset de senha
- [ ] Validar sincronização

### 5. Remover Código Legado
- [ ] Remover imports `zohoMail360`
- [ ] Remover chamadas `verifyUser()`
- [ ] Limpar `lib/zoho-mail360.ts` (ou deprecar com comentário)

---

## 🚨 Bloqueadores

1. **Migration não aplicada**
   - Supabase Auth migration está pronta mas não foi executada no banco
   - Sem isso, `auth.users` não está vinculado a `user_profiles`

2. **Sem usuários no Supabase**
   - Nenhum usuário cadastrado em `auth.users` ainda
   - Impossível testar login até criar usuários

3. **Zoho Mail360 ainda ativo**
   - Código atual depende 100% do Zoho
   - Precisa refatorar para Supabase

---

## ⏭️ Próximos Passos Imediatos

### Passo 1: Aplicar Migration (5 min)
```sql
-- Copiar e executar no Dashboard Supabase
-- https://supabase.com/dashboard/project/ifhfpaehnjpdwdocdzwd/sql/new
-- Conteúdo: APLICAR_MIGRATION_DASHBOARD.sql
```

### Passo 2: Criar Usuário de Teste (2 min)
```typescript
// Via Supabase Dashboard > Authentication > Add User
// Ou via SQL:
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES ('teste@imobiliariaipe.com.br', crypt('senha123', gen_salt('bf')), NOW());
```

### Passo 3: Atualizar Login (10 min)
- Importar `useSupabaseAuth`
- Substituir `zohoMail360.verifyUser()` por `signIn()`
- Testar

---

## 📈 Benefícios da Migração

✅ **Segurança**: RLS nativo do Supabase  
✅ **Performance**: Session cookies em vez de API calls  
✅ **Escalabilidade**: Infraestrutura gerenciada  
✅ **Features**: Reset password, magic links, OAuth (futuro)  
✅ **Custo**: Sem dependência de serviço externo pago  

---

## 🔗 Arquivos Relevantes

- `app/login/page.tsx` - Página de login (PRECISA ATUALIZAÇÃO)
- `lib/hooks/useSupabaseAuth.ts` - Hook Supabase Auth (PRONTO)
- `supabase/migrations/20251010_supabase_auth_migration.sql` - Migration (PRONTA)
- `APLICAR_MIGRATION_DASHBOARD.sql` - SQL para aplicar (PRONTO)
- `scripts/migrate-users-to-supabase-auth.ts` - Script de migração (PRONTO)

---

**Conclusão:** O fluxo de `/login` está **funcional mas desatualizado**. Usa Zoho Mail360 em vez de Supabase Auth. Precisamos:
1. Aplicar migration SQL
2. Atualizar código de login
3. Criar/migrar usuários
