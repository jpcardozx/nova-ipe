# 🚨 AÇÃO IMEDIATA - Role Não Reconhecida

## ⚡ EXECUTE AGORA (3 passos):

### **PASSO 1: Execute SQL no Supabase** 📊

Copie e execute no SQL Editor:

```sql
SELECT 
  email,
  raw_user_meta_data->>'role' as role,
  jsonb_pretty(raw_user_meta_data) as metadata,
  length(raw_user_meta_data->>'role') as role_length,
  raw_user_meta_data->>'role' = 'user' as is_valid_user_role
FROM auth.users;
```

**👉 COLE O RESULTADO AQUI NA RESPOSTA!**

---

### **PASSO 2: Inicie servidor com logs** 💻

```bash
# No terminal:
pnpm dev
```

Deixe rodando e vá para o passo 3.

---

### **PASSO 3: Teste login e copie logs** 🔍

1. **Abra browser em aba anônima** (Ctrl+Shift+N)
2. **Acesse:** http://localhost:3000/login
3. **Faça login**
4. **Observe terminal** - vai aparecer:

```
🔍 [Middleware Debug] {
  path: '...',
  userMetadata: {...},
  extractedRole: '???',  ← IMPORTANTE!
  finalRole: '???',      ← IMPORTANTE!
  hasPermission: false
}
```

**👉 COLE ESSE LOG COMPLETO AQUI NA RESPOSTA!**

---

## 🎯 COM ESSAS 2 INFORMAÇÕES EU IDENTIFICO O PROBLEMA!

---

## 💡 ENQUANTO ISSO, TENTE ISSO:

Se quiser tentar uma solução rápida enquanto não me envia os logs:

### **Solução 1: Force update no banco**

```sql
-- Forçar role com merge
UPDATE auth.users
SET raw_user_meta_data = 
  COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "user"}'::jsonb;

-- Verificar
SELECT email, raw_user_meta_data FROM auth.users;
```

### **Solução 2: Limpar tudo e refazer**

```bash
# 1. Parar servidor (Ctrl+C)

# 2. Limpar
bash debug-role.sh

# 3. Limpar cookies do browser
# F12 → Application → Cookies → Delete All

# 4. Reiniciar
pnpm dev

# 5. Login em aba anônima
```

---

## 📤 ENVIE AGORA:

1. ✅ Resultado da query SQL (email, role, metadata)
2. ✅ Log completo do `🔍 [Middleware Debug]`

**Com isso resolvo em 2 minutos!** 🚀
