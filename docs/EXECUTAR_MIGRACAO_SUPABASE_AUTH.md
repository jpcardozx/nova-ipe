# ✅ Migração Supabase Auth - Próximos Passos

**Data:** 10 de outubro de 2025  
**Status:** 🟢 **ARQUIVOS CRIADOS - PRONTO PARA EXECUTAR**

---

## 📦 Arquivos Criados

### 1. Migration SQL ✅
```
supabase/migrations/20251010_supabase_auth_migration.sql
```

**Conteúdo:**
- ✅ Trigger automático para criar user_profiles
- ✅ Coluna auth_user_id em user_profiles
- ✅ Políticas RLS (Row Level Security)
- ✅ Índices para performance
- ✅ View user_profiles_with_auth

### 2. Hook de Autenticação ✅
```
lib/hooks/useSupabaseAuth.ts
```

**Funções:**
- ✅ `signIn(email, password)` - Login
- ✅ `signUp(email, password, metadata)` - Registro
- ✅ `signOut()` - Logout
- ✅ `resetPassword(email)` - Reset de senha
- ✅ `updatePassword(newPassword)` - Atualizar senha
- ✅ Estado: `user`, `loading`, `isAuthenticated`

### 3. Script de Migração ✅
```
scripts/migrate-users-to-supabase-auth.ts
```

**Comandos:**
```bash
# Dry run (simulação)
npx tsx scripts/migrate-users-to-supabase-auth.ts

# Executar migração real
npx tsx scripts/migrate-users-to-supabase-auth.ts --execute

# Enviar emails de reset
npx tsx scripts/migrate-users-to-supabase-auth.ts --send-emails
```

---

## 🚀 Execução da Migração

### Passo 1: Aplicar SQL no Supabase (5 min)

**Opção A: Via Dashboard (Recomendado)**
```bash
# 1. Abrir arquivo
cat supabase/migrations/20251010_supabase_auth_migration.sql

# 2. Acessar Supabase Dashboard
https://app.supabase.com/project/ifhfpaehnjpdwdocdzwd/sql

# 3. Colar o SQL e clicar "Run"
```

**Opção B: Via CLI**
```bash
# Se tiver Supabase CLI configurado
supabase db push
```

**Verificação:**
```sql
-- No SQL Editor do Supabase, execute:
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table 
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Deve retornar 1 linha
```

---

### Passo 2: Atualizar Página de Login (30 min)

**Arquivo:** `app/login/page.tsx`

**Mudanças:**

```typescript
// ANTES (Zoho):
import { zohoMail360 } from '@/lib/zoho-mail360'

const handleLogin = async (data) => {
  const user = await zohoMail360.verifyUser(data.username, data.password)
  // ... 50+ linhas de código
}

// DEPOIS (Supabase):
import { useSupabaseAuth } from '@/lib/hooks/useSupabaseAuth'

function LoginPage() {
  const { signIn, loading, user } = useSupabaseAuth()

  const handleLogin = async (data) => {
    const { error } = await signIn(data.username, data.password)
    if (!error) router.push('/dashboard')
  }
  
  return (/* ... */)
}
```

**Checklist:**
- [ ] Importar `useSupabaseAuth`
- [ ] Remover imports do Zoho
- [ ] Simplificar `handleLogin`
- [ ] Remover localStorage
- [ ] Remover `syncUser()`
- [ ] Testar login

---

### Passo 3: Migrar Usuários Existentes (30 min - 1h)

```bash
# 1. Dry run (ver o que será feito)
npx tsx scripts/migrate-users-to-supabase-auth.ts

# Output esperado:
# 📊 Encontrados 10 perfis
# 🔸 [DRY RUN] Usuário seria criado
# ✅ Migrados: 10

# 2. Executar migração real
npx tsx scripts/migrate-users-to-supabase-auth.ts --execute

# 3. Enviar emails para usuários definirem senha
npx tsx scripts/migrate-users-to-supabase-auth.ts --send-emails
```

**Resultado:**
- ✅ Usuários criados em `auth.users`
- ✅ Perfis atualizados com `auth_user_id`
- ✅ Emails enviados para definir senha

---

### Passo 4: Testar Sistema (15 min)

#### Teste 1: Novo Usuário
```bash
# 1. Acessar /login
# 2. Clicar em "Criar conta"
# 3. Preencher formulário
# 4. Verificar email de confirmação
# 5. Confirmar e definir senha
# 6. Fazer login
```

#### Teste 2: Usuário Migrado
```bash
# 1. Acessar email de reset de senha
# 2. Clicar no link
# 3. Definir nova senha
# 4. Fazer login com nova senha
```

#### Teste 3: RLS (Row Level Security)
```bash
# 1. Login com usuário A
# 2. Tentar acessar /api/user-profiles
# 3. Verificar que só retorna perfil do usuário A
```

---

### Passo 5: Limpeza de Código (1h)

**Arquivos para Remover:**
```bash
rm lib/zoho-mail360.ts
rm lib/auth-simple.ts
rm lib/auth/enhanced-auth-manager.ts
rm lib/hooks/useCurrentUser-simple.ts
```

**Arquivos para Atualizar:**
```bash
# Simplificar:
lib/hooks/useCurrentUserExtended.ts  → usar useSupabaseAuth
lib/services/user-profile-service.ts → remover syncUser
```

**Checklist:**
- [ ] Remover imports do Zoho
- [ ] Remover `localStorage.setItem/getItem('currentUser')`
- [ ] Atualizar middleware (se houver)
- [ ] Remover variáveis de ambiente Zoho
- [ ] Atualizar `.env.example`

---

## 📝 Configuração do Supabase Dashboard

### Email Templates

**Configurar em:** Settings → Auth → Email Templates

#### 1. Confirm signup
```html
<h2>Bem-vindo à Nova Ipê!</h2>
<p>Confirme seu email clicando no link abaixo:</p>
<a href="{{ .ConfirmationURL }}">Confirmar Email</a>
```

#### 2. Reset password
```html
<h2>Redefinir Senha</h2>
<p>Clique no link abaixo para definir sua nova senha:</p>
<a href="{{ .ConfirmationURL }}">Definir Nova Senha</a>
<p>Link válido por 1 hora.</p>
```

#### 3. Magic link
```html
<h2>Login sem senha</h2>
<p>Clique no link abaixo para fazer login:</p>
<a href="{{ .ConfirmationURL }}">Fazer Login</a>
```

### Auth Settings

**Configurar em:** Settings → Auth → General

```
✅ Enable email provider
✅ Enable email confirmations
✅ Minimum password length: 8
✅ Require characters: Upper, lower, number
✅ Session length: 7 days
✅ Site URL: https://novaipe.com
✅ Redirect URLs: 
   - https://novaipe.com/auth/callback
   - https://novaipe.com/reset-password
```

---

## 🎯 Resultado Final

### Antes (Zoho)
```typescript
// Complexidade: ALTA
// Arquivos: 6
// Linhas de código: ~500
// Latência: 800-1200ms
// Custo: R$ 50-200/mês
// Segurança: Média (localStorage)
```

### Depois (Supabase)
```typescript
// Complexidade: BAIXA
// Arquivos: 2
// Linhas de código: ~100
// Latência: 200-400ms
// Custo: R$ 0/mês
// Segurança: Alta (JWT + RLS + HTTP-only cookies)
```

---

## ⚠️ Troubleshooting

### Erro: "Email rate limit exceeded"
**Solução:** Aguardar 1 hora ou configurar SMTP customizado

### Erro: "User already registered"
**Solução:** Verificar em auth.users se email já existe

### Erro: "Invalid login credentials"
**Solução:** Usuário precisa definir senha primeiro (reset password)

### Erro: "No rows returned" em RLS
**Solução:** Verificar políticas RLS com:
```sql
SELECT * FROM pg_policies WHERE tablename = 'user_profiles';
```

---

## 📊 Monitoramento

### Métricas para Acompanhar

```sql
-- Total de usuários
SELECT COUNT(*) FROM auth.users;

-- Usuários confirmados
SELECT COUNT(*) FROM auth.users WHERE email_confirmed_at IS NOT NULL;

-- Últimos logins
SELECT email, last_sign_in_at 
FROM auth.users 
ORDER BY last_sign_in_at DESC 
LIMIT 10;

-- Usuários por provedor
SELECT 
  raw_app_meta_data->>'provider' as provider,
  COUNT(*) as total
FROM auth.users
GROUP BY provider;
```

---

## ✅ Checklist de Migração Completa

### Preparação
- [x] SQL de migração criado
- [x] Hook useSupabaseAuth criado
- [x] Script de migração criado
- [ ] SQL executado no Supabase
- [ ] Email templates configurados

### Implementação
- [ ] Página de login atualizada
- [ ] useCurrentUser simplificado
- [ ] Middleware atualizado (se houver)
- [ ] Código Zoho removido

### Migração de Dados
- [ ] Dry run executado
- [ ] Usuários migrados
- [ ] Emails enviados
- [ ] Primeiros usuários testaram

### Validação
- [ ] Novo registro funciona
- [ ] Login funciona
- [ ] Logout funciona
- [ ] Reset de senha funciona
- [ ] RLS funciona
- [ ] Performance OK (<500ms)

### Finalização
- [ ] Código antigo removido
- [ ] Documentação atualizada
- [ ] Zoho API desativada
- [ ] Economia confirmada 🎉

---

## 🚀 Começar Agora

```bash
# 1. Aplicar SQL
cat supabase/migrations/20251010_supabase_auth_migration.sql
# Copiar → Supabase Dashboard → SQL Editor → Run

# 2. Testar hook
npx tsx -e "import { useSupabaseAuth } from './lib/hooks/useSupabaseAuth'; console.log('✅ Hook importado')"

# 3. Dry run da migração
npx tsx scripts/migrate-users-to-supabase-auth.ts

# PRONTO! 🎉
```

---

**Status:** ✅ **Pronto para executar**  
**Tempo estimado:** 2-3 horas total  
**Economia anual:** R$ 600 - R$ 2.400
