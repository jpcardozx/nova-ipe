# ✅ CHECKLIST DE VALIDAÇÃO - Sistema Unificado

## 📋 Pré-requisitos

- [ ] Node.js instalado
- [ ] pnpm instalado
- [ ] Variáveis de ambiente configuradas no `.env.local`:
  - [ ] `JWT_SECRET` gerado
  - [ ] `SANITY_STUDIO_ADMIN_SECRET` definido
  - [ ] `NEXT_PUBLIC_SUPABASE_URL` configurado
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` configurado

## 🔧 Instalação

```bash
cd /home/jpcardozx/projetos/nova-ipe
pnpm install
```

**Resultado esperado:**
```
✅ @supabase/ssr instalado
✅ jose instalado
✅ iron-session instalado
✅ zod instalado
```

## 🚀 Iniciar Servidor

```bash
pnpm dev
```

**Resultado esperado:**
```
✓ Ready in 2-3s
○ Compiling / ...
✓ Compiled / in Xs
```

## 🧪 Testes de Funcionalidade

### 1. Login Studio (Manual)

**URL:** http://localhost:3000/login?mode=studio

**Passos:**
1. [ ] Abrir navegador
2. [ ] Acessar URL acima
3. [ ] Inserir senha: `ipeplataformadigital`
4. [ ] Clicar em "Entrar"

**Resultado esperado:**
```
✅ POST /api/login?mode=studio 200 in <200ms
✅ [Studio Login] Success
→ Redirect para /studio
→ Cookie: nova-ipe-unified-session criado
```

**Como verificar:**
- DevTools → Application → Cookies
- Deve ter: `nova-ipe-unified-session`
- NÃO deve ter conflitos (múltiplos cookies auth)

### 2. Verificação de Sessão

**Ação:** Após login, acessar http://localhost:3000/studio

**Resultado esperado:**
```
✅ [Middleware] Authorized: admin@nova-ipe.com.br (studio)
✅ GET /studio 200 in <100ms
→ Página renderizada (SEM redirect)
```

**Como verificar terminal:**
```bash
# Deve aparecer:
🔍 [Middleware] Checking: /studio
✅ [Middleware] Authorized: ... (studio)
```

### 3. API de Sessão

**Ação:** Com sessão ativa, fazer request:

```bash
curl http://localhost:3000/api/studio/session -b cookies.txt
```

**Resultado esperado:**
```json
{
  "authenticated": true,
  "user": {
    "userId": "admin",
    "email": "admin@nova-ipe.com.br",
    "role": "studio",
    "provider": "sanity"
  },
  "expiresAt": 1728... (timestamp)
}
```

### 4. Logout

**Ação:** Clicar em "Sair" ou executar:

```bash
curl -X DELETE http://localhost:3000/api/login -b cookies.txt
```

**Resultado esperado:**
```bash
✅ [Logout] Success
→ Cookie nova-ipe-unified-session removido
→ Redirect para /login
```

**Como verificar:**
- DevTools → Application → Cookies
- `nova-ipe-unified-session` deve ter desaparecido

### 5. Proteção de Rota

**Ação:** Após logout, tentar acessar http://localhost:3000/studio

**Resultado esperado:**
```bash
❌ [Middleware] No session found, redirecting to login
→ Redirect 307 para /login?mode=studio
```

## 🔍 Testes Automáticos

```bash
./scripts/test-auth.sh
```

**Resultado esperado:**
```bash
✅ Login Studio: SUCESSO
✅ Sessão válida: CONFIRMADO
✅ Acesso /studio: PERMITIDO (200)
✅ Logout: SUCESSO
✅ Sessão removida: CONFIRMADO
🎉 Sistema de Autenticação Unificado funcionando!
```

## 📊 Indicadores de Sucesso

### Performance
- [ ] Login < 200ms
- [ ] Verificação de sessão < 100ms
- [ ] Middleware check < 50ms

### Logs Limpos
- [ ] ✅ Sem erros de compilação
- [ ] ✅ Sem warnings de cookies duplicados
- [ ] ✅ Sem redirect infinito
- [ ] ✅ Logs de autenticação claros

### Comportamento
- [ ] ✅ Login redireciona corretamente
- [ ] ✅ Rotas protegidas bloqueiam sem sessão
- [ ] ✅ Rotas protegidas permitem com sessão
- [ ] ✅ Logout remove sessão completamente
- [ ] ✅ Cookie único (não múltiplos)

## 🚨 Troubleshooting

### Problema: "JWT_SECRET not defined"
**Solução:**
```bash
echo "JWT_SECRET=$(openssl rand -base64 32)" >> .env.local
```

### Problema: "Module not found: @supabase/ssr"
**Solução:**
```bash
pnpm install @supabase/ssr jose iron-session zod
```

### Problema: Redirect infinito /login → /studio → /login
**Solução:**
1. Limpar cookies no navegador (DevTools → Clear site data)
2. Reiniciar servidor (`pnpm dev`)
3. Fazer novo login

### Problema: "authenticated: false" após login
**Diagnóstico:**
```bash
# Verificar cookie existe:
curl http://localhost:3000/api/studio/session -v

# Deve ter no header:
Cookie: nova-ipe-unified-session=...
```

**Solução:**
- Verificar se JWT_SECRET está definido
- Verificar se o cookie não está sendo bloqueado (SameSite)
- Verificar se o servidor está rodando em HTTP (localhost OK)

### Problema: Sessão expira muito rápido
**Solução:**
Ajustar em `lib/auth/unified-session.ts`:
```typescript
const SESSION_MAX_AGE = 60 * 60 * 24 // 24 horas (ao invés de 12)
```

## 🎯 Critérios de Aceitação

Todos devem estar ✅:

- [ ] Login funciona sem erros
- [ ] Middleware identifica sessão corretamente
- [ ] Cookie único criado
- [ ] Rotas protegidas funcionam
- [ ] Logout remove sessão
- [ ] Performance < 200ms
- [ ] Sem erros de compilação
- [ ] Logs claros e informativos

## 📝 Observações Finais

Se todos os itens estiverem ✅, o sistema está funcionando corretamente!

**Próximo passo:** Deploy em staging/production.

---

**Última atualização:** 12/10/2025  
**Versão:** 1.0.0
