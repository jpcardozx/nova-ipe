# 🔍 DIAGNÓSTICO: Role não está sendo reconhecida

## 🎯 PRÓXIMOS PASSOS PARA DIAGNÓSTICO

### **1. Execute as queries de diagnóstico no Supabase**

Abra o arquivo `DIAGNOSTICO_SUPABASE.sql` e execute as queries **uma por uma** no SQL Editor do Supabase.

**Query mais importante (execute primeiro):**
```sql
SELECT 
  email,
  raw_user_meta_data->>'role' as role_extraido,
  jsonb_pretty(raw_user_meta_data) as metadata_completo,
  CASE 
    WHEN raw_user_meta_data IS NULL THEN 'metadata_null'
    WHEN raw_user_meta_data->>'role' IS NULL THEN 'role_null'
    ELSE 'role_existe'
  END as status
FROM auth.users;
```

**Cole o resultado aqui!**

---

### **2. Verifique os logs do servidor Next.js**

Com os logs de debug adicionados no middleware, faça:

1. **Limpe o terminal** (Ctrl+C e depois `pnpm dev` novamente)
2. **Limpe cookies do browser** (F12 → Application → Delete All)
3. **Tente fazer login**

No terminal, você verá logs detalhados como:
```
🔍 [Middleware Debug] {
  path: '/dashboard',
  userId: '...',
  userEmail: 'seu-email@example.com',
  userMetadata: { ... },
  extractedRole: '???',  ← O QUE ESTÁ AQUI?
  finalRole: '???',      ← E AQUI?
  requiredRoles: ['user', 'admin', 'studio'],
  hasPermission: false   ← POR QUE FALSE?
}
```

**Cole esses logs aqui!**

---

## 🐛 POSSÍVEIS CAUSAS

### **Causa 1: Campo vazio mas não NULL**
```sql
-- Se metadata existe mas está vazio: {}
raw_user_meta_data = '{}'::jsonb

-- Fix:
UPDATE auth.users
SET raw_user_meta_data = '{"role": "user"}'::jsonb;
```

### **Causa 2: Role com formato errado**
```sql
-- Se role está como object em vez de string:
{"role": {"value": "user"}}  ❌

-- Deve ser:
{"role": "user"}  ✅

-- Fix:
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  '{}'::jsonb,
  '{role}',
  '"user"'::jsonb
);
```

### **Causa 3: Cookies antigos**
Browser pode estar usando cookies com session antiga (sem role).

**Fix:**
```
1. F12 → Application → Cookies
2. Delete ALL cookies (especialmente sb-*)
3. Fechar aba completamente
4. Abrir nova aba e fazer login
```

### **Causa 4: Cache do middleware**
Next.js pode estar cacheando o middleware.

**Fix:**
```bash
# Parar servidor (Ctrl+C)
rm -rf .next
pnpm dev
```

### **Causa 5: user_metadata vs app_metadata**
Pode estar salvando no campo errado.

**Verificar:**
```sql
SELECT 
  email,
  raw_user_meta_data,    -- Dados do usuário (editável)
  raw_app_meta_data      -- Dados da aplicação (sistema)
FROM auth.users;
```

Se role está em `raw_app_meta_data`, o middleware não consegue ler!

---

## 🔧 SOLUÇÕES POR CENÁRIO

### **Se `role_extraido` é NULL:**

```sql
-- Forçar update com merge
UPDATE auth.users
SET raw_user_meta_data = 
  COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "user"}'::jsonb;

-- Verificar
SELECT email, raw_user_meta_data FROM auth.users;
```

### **Se `metadata_completo` está vazio `{}`:**

```sql
-- Substituir completamente
UPDATE auth.users
SET raw_user_meta_data = '{"role": "user"}'::jsonb;
```

### **Se logs mostram `extractedRole: undefined`:**

**Problema:** Supabase não está retornando user_metadata

**Possíveis causas:**
1. Session antiga em cache
2. getUser() não retorna metadata por alguma policy
3. Cookies corrompidos

**Fix:**
```bash
# 1. Limpar build
rm -rf .next

# 2. Limpar cookies do browser

# 3. Fazer logout programático
# No console do browser (F12):
document.cookie.split(";").forEach(c => {
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, 
    "=;expires=" + new Date().toUTCString() + ";path=/");
});

# 4. Reiniciar servidor
pnpm dev
```

### **Se logs mostram role mas `hasPermission: false`:**

**Problema:** Role não está no array de roles permitidas

**Debug:**
```typescript
// Ver o que está sendo comparado:
console.log('Role do usuário:', userRole)
console.log('Tipo:', typeof userRole)
console.log('Roles aceitas:', protectedRoute.roles)
console.log('Includes?', protectedRoute.roles.includes(userRole))
```

**Possíveis causas:**
- Role tem espaços: `'user '` vs `'user'`
- Case diferente: `'User'` vs `'user'`
- Tipo diferente: `{role: 'user'}` vs `'user'`

---

## 🧪 TESTE RÁPIDO

Execute este teste para ver se é problema de SQL ou de código:

```sql
-- 1. Ver exatamente o que tem no banco
SELECT 
  email,
  length(raw_user_meta_data->>'role') as role_length,
  raw_user_meta_data->>'role' as role,
  raw_user_meta_data->>'role' = 'user' as is_user
FROM auth.users;
```

Se `is_user` = `true`, então o SQL está correto e o problema é no código Next.js.

Se `is_user` = `false` ou `null`, o problema é no banco de dados.

---

## 🚨 SOLUÇÃO DRÁSTICA (Se nada funcionar)

### **Opção 1: Recriar usuário via Supabase Dashboard**

1. Ir para: Authentication → Users
2. **Deletar** usuário atual
3. **Create User** com email e senha
4. Ir para SQL Editor:
```sql
UPDATE auth.users
SET raw_user_meta_data = '{"role": "user"}'::jsonb
WHERE email = 'seu-email@example.com';
```

### **Opção 2: Usar app_metadata em vez de user_metadata**

Se user_metadata não funcionar, podemos usar app_metadata:

**Middleware.ts:**
```typescript
const userRole = (user.app_metadata?.role as string) || 'user'
```

**SQL:**
```sql
UPDATE auth.users
SET raw_app_meta_data = jsonb_set(
  COALESCE(raw_app_meta_data, '{}'::jsonb),
  '{role}',
  '"user"'::jsonb
);
```

---

## 📋 CHECKLIST DE DEBUG

Execute na ordem:

- [ ] Query SQL de diagnóstico executada
- [ ] Resultado da query copiado aqui
- [ ] Servidor Next.js reiniciado (rm -rf .next && pnpm dev)
- [ ] Cookies do browser limpos completamente
- [ ] Login testado novamente
- [ ] Logs do middleware copiados aqui
- [ ] Verificar se role aparece nos logs
- [ ] Verificar tipo da role (string? object?)
- [ ] Testar query SQL de teste rápido

---

## 📤 O QUE PRECISO DE VOCÊ:

1. **Execute esta query no Supabase:**
```sql
SELECT 
  email,
  raw_user_meta_data->>'role' as role,
  jsonb_pretty(raw_user_meta_data) as metadata,
  length(raw_user_meta_data->>'role') as role_length
FROM auth.users;
```

2. **Cole o resultado completo aqui**

3. **Limpe cookies e faça login novamente**

4. **Cole os logs do terminal que aparecem com:**
```
🔍 [Middleware Debug]
```

Com essas informações, consigo identificar exatamente o problema! 🎯
