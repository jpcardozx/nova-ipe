# 🎯 QUICK FIX - INSUFFICIENT_PERMISSIONS

## O QUE FAZER AGORA (2 minutos):

### 1️⃣ Abrir Supabase Dashboard
```
https://supabase.com/dashboard
→ Projeto: nova-ipe
→ Menu: SQL Editor
```

### 2️⃣ Copiar e executar (SUBSTITUA O EMAIL):
```sql
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"user"'::jsonb
)
WHERE email = 'SEU-EMAIL-AQUI@exemplo.com';
```

### 3️⃣ Verificar se funcionou:
```sql
SELECT email, raw_user_meta_data->>'role' 
FROM auth.users 
WHERE email = 'SEU-EMAIL-AQUI@exemplo.com';
```

Deve retornar: `role = user`

### 4️⃣ Limpar cookies do navegador:
- F12 → Application → Cookies → Delete All
- Ou usar aba anônima

### 5️⃣ Fazer login novamente
- Deve funcionar! ✅

---

## 🎭 ROLES DISPONÍVEIS:

| Mudar `'"user"'` por: | Acesso              |
|-----------------------|---------------------|
| `'"user"'`            | Apenas /dashboard   |
| `'"studio"'`          | /dashboard + /studio|
| `'"admin"'`           | Tudo                |

---

## 📚 DOCUMENTAÇÃO COMPLETA:

- `FIX_INSUFFICIENT_PERMISSIONS.md` - Guia detalhado
- `FIX_USER_ROLES.sql` - Todas queries SQL
- `AUTH_LOADING_OVERLAY_IMPLEMENTATION.md` - Sistema de loading

---

**Por que aconteceu?**
Usuário criado sem `role` no `user_metadata` → middleware rejeita

**Como evitar no futuro?**
Executar trigger SQL em `FIX_USER_ROLES.sql` (Opção 3)
