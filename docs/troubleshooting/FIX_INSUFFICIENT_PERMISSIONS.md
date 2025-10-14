# 🐛 Fix: INSUFFICIENT_PERMISSIONS Error

## 🔍 Diagnóstico do Problema

### **Erro Observado:**
```
GET /login?error=INSUFFICIENT_PERMISSIONS 200 in 133ms
```

### **Causa Raiz:**
Usuários criados no Supabase **não têm** a propriedade `role` no `user_metadata`. O middleware tenta acessar:

```typescript
const userRole = (user.user_metadata?.role as string) || 'user'
```

Mesmo com o fallback `|| 'user'`, se a propriedade não existe, pode causar comportamento inesperado na validação de permissões.

### **Fluxo do Erro:**

1. **Login bem-sucedido** ✅
   - Credenciais corretas
   - Session criada no Supabase
   - Cookies setados

2. **Redirect para /dashboard** 🔄
   - Browser tenta acessar rota protegida

3. **Middleware executa** 🔒
   - `getUser()` retorna user válido
   - Tenta acessar `user.user_metadata.role`
   - **Role é `undefined`** ❌

4. **Permission check falha** 🚫
   ```typescript
   const hasPermission = protectedRoute.roles.includes(userRole)
   // userRole = undefined → includes() retorna false
   ```

5. **Redirect para login com erro** ↩️
   ```
   /login?error=INSUFFICIENT_PERMISSIONS
   ```

---

## 🔧 Soluções Disponíveis

### **Opção 1: Fix via Supabase SQL Editor (RECOMENDADO)**

#### **1.1 - Acessar Supabase Dashboard**
1. Ir para: https://supabase.com/dashboard
2. Selecionar projeto: `nova-ipe`
3. Clicar em **SQL Editor** no menu lateral

#### **1.2 - Verificar usuários sem role**
```sql
SELECT 
  id,
  email,
  raw_user_meta_data->>'role' as role,
  created_at
FROM auth.users
ORDER BY created_at DESC;
```

#### **1.3 - Adicionar role para usuário específico**

Para dar acesso ao **dashboard** (role: `user`):
```sql
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"user"'::jsonb
)
WHERE email = 'seu-email@example.com';
```

Para dar acesso ao **studio** (role: `studio`):
```sql
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"studio"'::jsonb
)
WHERE email = 'seu-email@example.com';
```

Para dar **acesso admin** completo (role: `admin`):
```sql
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'::jsonb
)
WHERE email = 'seu-email@example.com';
```

#### **1.4 - Verificar se funcionou**
```sql
SELECT 
  email,
  raw_user_meta_data->>'role' as role
FROM auth.users
WHERE email = 'seu-email@example.com';
```

Deve retornar:
```
email                 | role
----------------------|--------
seu-email@example.com | user
```

---

### **Opção 2: Adicionar role para TODOS usuários**

Se você tem múltiplos usuários sem role, execute:

```sql
-- Adicionar 'user' como role default para todos sem role
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"user"'::jsonb
)
WHERE raw_user_meta_data->>'role' IS NULL;
```

Verificar resultado:
```sql
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN raw_user_meta_data->>'role' IS NOT NULL THEN 1 END) as with_role,
  COUNT(CASE WHEN raw_user_meta_data->>'role' IS NULL THEN 1 END) as without_role
FROM auth.users;
```

---

### **Opção 3: Criar trigger para novos usuários (PREVENTIVO)**

Para garantir que **futuros usuários** sempre tenham role:

```sql
-- Criar função
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Se não tem role, adicionar 'user' automaticamente
  IF NEW.raw_user_meta_data->>'role' IS NULL THEN
    NEW.raw_user_meta_data = jsonb_set(
      COALESCE(NEW.raw_user_meta_data, '{}'::jsonb),
      '{role}',
      '"user"'::jsonb
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 🎯 Roles & Permissões

### **Matriz de Acesso:**

| Role     | /dashboard | /studio | Descrição                          |
|----------|------------|---------|-------------------------------------|
| `user`   | ✅ Sim     | ❌ Não  | Usuário padrão (apenas dashboard)   |
| `studio` | ✅ Sim     | ✅ Sim  | Acesso ao studio (gerenciar imóveis)|
| `admin`  | ✅ Sim     | ✅ Sim  | Acesso completo (todas rotas)       |

### **Configuração no middleware.ts:**

```typescript
const PROTECTED_ROUTES = [
  { path: '/dashboard', roles: ['user', 'admin', 'studio'] },
  { path: '/studio', roles: ['studio', 'admin'] },
]
```

---

## 🧪 Como Testar

### **1. Após executar SQL:**

1. **Fazer logout** (se estiver logado)
   - Limpar cookies do navegador
   - Ou usar aba anônima

2. **Fazer login novamente**
   - Email: seu-email@example.com
   - Senha: sua senha

3. **Verificar redirect:**
   - ✅ Deve ir para `/dashboard` ou `/studio`
   - ❌ NÃO deve voltar para `/login?error=INSUFFICIENT_PERMISSIONS`

### **2. Debug no console do browser:**

Abrir DevTools (F12) e verificar:

```javascript
// No console do browser após login
console.log(document.cookie) // Deve ter sb-* cookies
```

### **3. Verificar logs do servidor:**

No terminal do Next.js, deve aparecer:
```
✓ Compiled /dashboard in Xms
GET /dashboard 200 in Xms
```

**NÃO** deve aparecer:
```
GET /login?error=INSUFFICIENT_PERMISSIONS
```

---

## 🚨 Troubleshooting

### **Problema: Ainda dá INSUFFICIENT_PERMISSIONS após SQL**

**Causa:** Cookies antigos do browser

**Solução:**
1. Limpar todos cookies do site:
   - Chrome: F12 → Application → Cookies → Delete all
   - Firefox: F12 → Storage → Cookies → Delete all
2. Fazer login novamente

### **Problema: SQL não executou (erro de sintaxe)**

**Causa:** Email não substituído ou aspas erradas

**Solução:**
```sql
-- ✅ CORRETO (aspas simples)
WHERE email = 'joao@exemplo.com'

-- ❌ ERRADO (aspas duplas)
WHERE email = "joao@exemplo.com"
```

### **Problema: Usuário não aparece na query**

**Causa:** Email digitado diferente do cadastrado

**Solução:**
```sql
-- Listar TODOS usuários para ver emails corretos
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC;
```

---

## 📊 Verificações Finais

### **Checklist pós-fix:**

- [ ] SQL executado com sucesso no Supabase
- [ ] Query de verificação mostra role correta
- [ ] Cookies do browser limpos
- [ ] Login realizado novamente
- [ ] Redirect para dashboard/studio funcionando
- [ ] Sem erro INSUFFICIENT_PERMISSIONS nos logs
- [ ] AuthLoadingOverlay mostra 3 steps verdes
- [ ] Página carrega corretamente

### **Comandos rápidos para copiar:**

```sql
-- Ver todos usuários e roles
SELECT email, raw_user_meta_data->>'role' as role FROM auth.users;

-- Dar role 'user' para email específico
UPDATE auth.users SET raw_user_meta_data = jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{role}', '"user"'::jsonb) WHERE email = 'seu-email@example.com';

-- Verificar se funcionou
SELECT email, raw_user_meta_data->>'role' FROM auth.users WHERE email = 'seu-email@example.com';
```

---

## 📝 Notas Importantes

1. **Sempre use aspas simples** (`'`) em SQL, não duplas (`"`)
2. **Substitua `seu-email@example.com`** pelo email real
3. **Limpe cookies** após update no banco
4. **Role é case-sensitive**: `'user'` ≠ `'User'`
5. **Trigger é opcional** mas previne problema em novos usuários

---

## 🔗 Arquivos Relacionados

- `FIX_USER_ROLES.sql` - Script SQL completo com todas queries
- `middleware.ts` - Onde a validação de role acontece
- `lib/auth/supabase-auth.ts` - Função que lê user_metadata
- `AUTH_LOADING_OVERLAY_IMPLEMENTATION.md` - Doc do sistema de loading

---

**Status:** 🔴 **Aguardando execução do SQL no Supabase**  
**Próximo passo:** Executar query SQL para adicionar role ao usuário  
**Tempo estimado:** 2 minutos
