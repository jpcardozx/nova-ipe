# ✅ TESTE DO FLUXO DE LOGIN - Checklist

## 📋 Status: Todos usuários têm roles! (users_without = 0)

---

## 🧪 TESTES A EXECUTAR:

### **1. Limpar Estado do Browser** ⚠️ IMPORTANTE
```bash
# Abrir DevTools (F12)
# → Application Tab
# → Cookies
# → Deletar TODOS cookies do localhost:3000
```

Ou simplesmente: **Abrir aba anônima**

---

### **2. Teste 1: Login com Sucesso (Dashboard)** ✅

**Passos:**
1. Acessar: http://localhost:3000/login
2. Entrar com credenciais válidas
3. Clicar em "Acessar Plataforma"

**Resultado Esperado:**
```
✅ AuthLoadingOverlay aparece
✅ Step 1: Verificando credenciais → Verde
✅ Step 2: Estabelecendo sessão → Verde  
✅ Step 3: Verificando permissões → Verde
✅ Redirect para /dashboard
✅ Dashboard carrega sem erros
```

**Logs Esperados no Terminal:**
```
POST /login 200 in ~500ms
GET /dashboard 200 in ~1500ms
```

**🚫 NÃO deve aparecer:**
```
GET /login?error=INSUFFICIENT_PERMISSIONS
```

---

### **3. Teste 2: Login Inválido (Erro de Credenciais)** ❌

**Passos:**
1. Fazer logout
2. Tentar login com senha errada

**Resultado Esperado:**
```
✅ AuthLoadingOverlay aparece
✅ Step 1: Verificando credenciais → Vermelho (erro)
✅ Mensagem: "Email ou senha incorretos"
✅ Botão "Fechar" disponível
✅ Modal persiste (não desaparece)
```

---

### **4. Teste 3: Trocar Modo Studio** 🎨

**Passos:**
1. Dar role 'studio' ao usuário via SQL:
```sql
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"studio"'::jsonb
)
WHERE email = 'seu-email@example.com';
```

2. Limpar cookies
3. Fazer login selecionando "Studio Mode"

**Resultado Esperado:**
```
✅ Steps todos verdes
✅ Redirect para /studio
✅ Studio carrega
```

---

## 🔍 DEBUGGING

### **Se ainda aparecer INSUFFICIENT_PERMISSIONS:**

**Debug 1: Verificar role no banco**
```sql
SELECT 
  email, 
  raw_user_meta_data->>'role' as role,
  raw_user_meta_data
FROM auth.users;
```

Deve mostrar role preenchida (não NULL).

**Debug 2: Verificar cookies**
```javascript
// No console do browser (F12)
document.cookie
```

Deve ter cookies `sb-*` do Supabase.

**Debug 3: Log do middleware**
Adicionar no middleware.ts (linha 85):
```typescript
console.log('🔍 [Middleware] User role:', userRole, 'Required:', protectedRoute.roles)
```

---

## 📊 RESULTADOS ESPERADOS:

### **Terminal Next.js:**
```bash
✓ Compiled /login in 10s
POST /login 200 in 500ms
✓ Compiled /dashboard in 8s  
GET /dashboard 200 in 1500ms
```

### **AuthLoadingOverlay (UI):**
```
⏳ Verificando credenciais...
   ↓
✅ Verificando credenciais (verde)
⏳ Estabelecendo sessão...
   ↓
✅ Estabelecendo sessão (verde)
⏳ Verificando permissões...
   ↓
✅ Verificando permissões (verde)
   ↓
🎉 Autenticação concluída! Redirecionando...
```

---

## 🎯 CHECKLIST FINAL:

- [ ] SQL executada (users_without = 0) ✅ **FEITO**
- [ ] Cookies do browser limpos
- [ ] Login com credenciais válidas
- [ ] AuthLoadingOverlay mostra 3 steps verdes
- [ ] Redirect para /dashboard funciona
- [ ] Dashboard carrega sem erros
- [ ] Sem erro INSUFFICIENT_PERMISSIONS nos logs
- [ ] Teste de login inválido mostra erro vermelho
- [ ] Modal persiste durante todo processo

---

## 🚀 PRÓXIMOS PASSOS SE TUDO FUNCIONAR:

1. ✅ Remover componente `LoadingOverlay` antigo (app/login/page.tsx linhas ~61-200)
2. ✅ Limpar imports não usados
3. ✅ Adicionar trigger SQL para novos usuários (Opção 3 do FIX_USER_ROLES.sql)
4. ✅ Commit das mudanças
5. ✅ Deploy

---

**👉 EXECUTE AGORA:**
1. Limpe cookies (F12 → Application → Delete All)
2. Abra: http://localhost:3000/login
3. Faça login
4. Reporte resultado aqui! 🎉
