# 🍪 Instruções para Debug de Cookie Parse Errors

**Data:** 2025-10-13
**Objetivo:** Diagnosticar erros de parse de cookies do Supabase

---

## 🎯 O QUE FOI ADICIONADO

Adicionei **logging detalhado** no singleton antes de criar o client Supabase:

**Arquivo:** `lib/supabase/client-singleton.ts`

**Logging adicionado:**
```typescript
// DEBUG: Inspecionar cookies ANTES de criar client
console.log('[Supabase] 🍪 Inspecting cookies before client creation:')
// Para cada cookie supabase/auth:
// - Mostra valor raw
// - Decodifica URL encoding
// - Valida se é JSON
// - Reporta erros
```

---

## 🧪 COMO TESTAR

### **1. Limpar Cookies Antigos (Recomendado)**

**No DevTools do Firefox:**

```javascript
// Console do navegador
document.cookie.split(";").forEach(c => {
  if (c.includes('supabase') || c.includes('auth')) {
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  }
});

console.log('✅ Cookies supabase limpos')
```

### **2. Fazer Login Novamente**

1. Acesse: `http://localhost:3000/login`
2. Faça login com credenciais válidas
3. **MANTENHA o console aberto!**

### **3. Analisar Logs do Console**

Você verá logs detalhados como:

```
[Supabase] 🍪 Inspecting cookies before client creation:
[Supabase] 🍪 Found auth cookie: sb-ifhfpaehnjpdwdocdzwd-auth-token=...
[Supabase] 🍪 Decoded value preview: {"access_token":"eyJhbG...
[Supabase] ✅ Cookie is valid JSON
[Supabase] Creating singleton client instance
```

**OU se houver problema:**

```
[Supabase] 🍪 Found auth cookie: sb-xxx=someInvalidValue
[Supabase] ⚠️ Cookie is NOT JSON format: someInvalidValue
[Supabase] ❌ Cookie parse error: SyntaxError: JSON.parse...
```

---

## 🔍 O QUE PROCURAR

### **Cenário 1: Cookie Válido** ✅
```
[Supabase] ✅ Cookie is valid JSON
```
**Significado:** Cookie está OK, o erro vem de outra fonte

### **Cenário 2: Cookie Inválido** ❌
```
[Supabase] ⚠️ Cookie is NOT JSON format
```
**Significado:** Cookie corrompido ou formato errado

### **Cenário 3: Nenhum Cookie** 🤔
```
[Supabase] 🍪 Inspecting cookies before client creation:
[Supabase] Creating singleton client instance
```
**Significado:** Nenhum cookie supabase encontrado (primeira vez)

---

## 📋 CHECKLIST DE DIAGNÓSTICO

Após fazer login, verifique:

- [ ] Console mostra logs de cookies?
- [ ] Cookies foram encontrados (`Found auth cookie`)?
- [ ] Cookies são JSON válidos (`✅ Cookie is valid JSON`)?
- [ ] Erros "Failed to parse cookie string" ainda aparecem?
- [ ] Login redireciona para dashboard?
- [ ] Sessão persiste após reload?

---

## 🎯 CENÁRIOS POSSÍVEIS

### **A. Cookies OK + Erro persiste**

**Significa:**
- Cookies do singleton estão OK
- Erro vem do segundo client (`lib/supabase.ts`)
- Solução: Investigar onde `lib/supabase.ts` é importado

### **B. Cookies Corrompidos**

**Significa:**
- Cookies têm formato inválido
- Possível causa: Versão antiga do Supabase
- Solução: Limpar cookies e fazer login novamente

### **C. Nenhum Cookie Encontrado**

**Significa:**
- Primeira vez ou logout completo
- Normal, será criado após login
- Se erro persiste: Problema na criação do cookie

---

## 🔧 AÇÕES CORRETIVAS

### **Se cookies estiverem corrompidos:**

```javascript
// Console do navegador - LIMPAR TUDO
localStorage.clear()
sessionStorage.clear()
document.cookie.split(";").forEach(c => {
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});
location.reload()
```

### **Se erro persistir mesmo com cookies válidos:**

O problema está no **segundo client** (`lib/supabase.ts`). Precisaremos:
1. Adicionar logging similar em `lib/supabase.ts`
2. Ou aceitar que o warning é cosmético

---

## 📊 COLETA DE DADOS

**Por favor, envie no próximo prompt:**

1. **Logs completos do console** (copie tudo relacionado a `[Supabase]`)
2. **Screenshot** se possível
3. **Responda:**
   - Login funcionou?
   - Redirecionou para dashboard?
   - Erros "Failed to parse cookie" ainda aparecem?
   - Quantas vezes cada erro aparece?

---

## 🚀 PRÓXIMOS PASSOS BASEADOS NO RESULTADO

### **Se cookies estão OK:**
→ Focar no segundo client (`lib/supabase.ts`)
→ Considerar suprimir warning (cosmético)

### **Se cookies estão corrompidos:**
→ Investigar formato esperado vs formato atual
→ Verificar versão do Supabase
→ Possivelmente upgrade/downgrade

### **Se erro desapareceu:**
→ Era cache/cookie antigo
→ Problema resolvido! 🎉

---

**Status:** ⏳ Aguardando teste do usuário

**Comando para iniciar teste:**
1. Abrir console do navegador
2. Limpar cookies (script acima)
3. Acessar `/login`
4. Fazer login
5. Copiar logs do console
