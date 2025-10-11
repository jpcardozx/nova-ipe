━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ GUIA DE VALIDAÇÃO: Login → Dashboard (Supabase Auth)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🎯 O que foi implementado

✅ Migration de Supabase Auth completa
✅ 4 usuários com user_profiles vinculados
✅ Senhas padronizadas: @Ipe4693
✅ Tabelas do dashboard (notifications, user_activities)
✅ RLS policies configuradas
✅ Código atualizado para usar singleton do Supabase
✅ Modo de desenvolvimento desabilitado (usa auth real)
✅ Zoho Mail360 completamente removido

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🚀 PASSO A PASSO: Validação do Fluxo

### 1️⃣ Verificar Rate Limit (se bloqueado)

**Supabase Dashboard:**
```
URL: https://supabase.com/dashboard/project/ifhfpaehnjpdwdocdzwd
Menu: Authentication > Rate Limits
```

**Verificar se há bloqueios ativos:**
- Se sim, clique em "Reset" ou aguarde 2 minutos

---

### 2️⃣ Limpar Estado do Browser

**Console do Browser (F12):**
```javascript
// Limpar tudo
localStorage.clear()
sessionStorage.clear()

// Verificar se limpou
console.log('localStorage:', localStorage.length) // Deve ser 0
console.log('sessionStorage:', sessionStorage.length) // Deve ser 0
```

**Ou via Application tab:**
```
DevTools > Application > Storage > Clear site data
```

---

### 3️⃣ Recarregar Página

```
Ctrl + Shift + R (hard reload)
```

---

### 4️⃣ Fazer Login

**Credenciais disponíveis (qualquer uma):**
```
Email: jpcardozo@imobiliariaipe.com.br
Senha: @Ipe4693

Email: julia@imobiliariaipe.com.br
Senha: @Ipe4693

Email: leonardo@imobiliariaipe.com.br
Senha: @Ipe4693

Email: jlpaula@imobiliariaipe.com.br
Senha: @Ipe4693
```

---

### 5️⃣ Verificar Logs no Console

**Logs esperados durante o login:**

```javascript
// 1. Início do login
🔄 === LOGIN VIA SUPABASE AUTH ===
📧 Email: jpcardozo@imobiliariaipe.com.br

// 2. Autenticação
🔐 useSupabaseAuth.signIn - Tentando login...
✅ useSupabaseAuth.signIn - Sucesso!
📝 Session: Criada
👤 User: jpcardozo@imobiliariaipe.com.br

// 3. Perfil
✅ Login bem-sucedido!
🔄 Redirecionando para /dashboard...

// 4. Dashboard carregando
🔐 useCurrentUser: Verificando autenticação Supabase...
👤 authUser: jpcardozo@imobiliariaipe.com.br
❌ authError: none

// 5. Carregando notificações
📡 loadNotifications: Carregando para user: <uuid>
🔐 Sessão ativa: Sim
👤 Sessão user_id: <uuid>

// 6. Registrando atividade
📝 trackActivity: Registrando atividade para user: <uuid>
🔐 Sessão ativa: Sim
✅ Atividade registrada com sucesso
```

---

### 6️⃣ Verificar Estado no localStorage

**Console:**
```javascript
// Verificar token de autenticação
const authKey = Object.keys(localStorage).find(k => k.includes('auth-token'))
console.log('Auth key:', authKey)

const authData = localStorage.getItem(authKey)
console.log('Auth data:', JSON.parse(authData))

// Deve mostrar:
{
  "access_token": "eyJhbGc...",
  "user": {
    "id": "2987ee90-2620-437c-bf75-f82a504435c8",
    "email": "jpcardozo@imobiliariaipe.com.br",
    ...
  }
}
```

---

### 7️⃣ Verificar Dashboard

**Deve aparecer:**
✅ Nome do usuário no header (ex: "Jpcardozo")
✅ Menu lateral funcionando
✅ Sem erros no console
✅ Notificações vazias (sem erros)
✅ Quick actions visíveis

**Não deve aparecer:**
❌ Redirecionamento para /login
❌ Erro "No API key found"
❌ Erro "Foreign key violation"
❌ Erro "The quota has been exceeded"

---

### 8️⃣ Testar Navegação

**Teste estas rotas:**
```
/dashboard          ← Dashboard principal
/dashboard/clients  ← Clientes
/dashboard/settings ← Configurações
```

**Todas devem:**
✅ Carregar sem redirecionar
✅ Mostrar dados (ou telas vazias, mas sem erros)
✅ Manter sessão ativa

---

### 9️⃣ Testar Logout

**Clique em "Sair" no menu do usuário**

**Deve:**
✅ Redirecionar para /login
✅ Limpar localStorage
✅ Não permitir acesso ao /dashboard sem login

---

### 🔟 Verificar no Supabase Dashboard

**Authentication > Users:**
```
Deve mostrar:
- 4 usuários confirmados
- Email verified: ✓
- Last sign in: agora (timestamp recente)
```

**Table Editor > user_activities:**
```
Deve ter pelo menos 1 registro:
- user_id: <uuid do usuário>
- type: "page_view" ou similar
- timestamp: agora
```

**Table Editor > notifications:**
```
Pode estar vazia (sem erros)
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🐛 Troubleshooting

### Problema: "The quota has been exceeded"
**Solução:**
- Aguarde 2 minutos
- Ou resete no Supabase Dashboard > Authentication > Rate Limits

### Problema: Redireciona para /login
**Verificar:**
```javascript
// No console:
const { data: { session } } = await supabase.auth.getSession()
console.log('Session:', session)
```
- Se NULL: fazer login novamente
- Se OK: problema no useCurrentUser

### Problema: "No API key found"
**Verificar .env.local:**
```bash
cat .env.local | grep SUPABASE
```
Deve mostrar:
```
NEXT_PUBLIC_SUPABASE_URL=https://ifhfpaehnjpdwdocdzwd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

### Problema: "Foreign key violation"
**Significa:**
- user_id usado não existe em auth.users
- Verificar se o modo dev foi desabilitado

### Problema: Console vazio (sem logs)
**Solução:**
- Abrir DevTools ANTES de fazer login
- Verificar filtros do console (não ocultar logs)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## ✅ Critérios de Sucesso

O fluxo está funcionando se:

1. ✅ Login redireciona para /dashboard (não fica em /login)
2. ✅ Dashboard mostra nome do usuário
3. ✅ Console mostra "✅ Atividade registrada com sucesso"
4. ✅ Nenhum erro no console (além de 404 de arquivos opcionais)
5. ✅ Logout funciona e redireciona para /login
6. ✅ Supabase Dashboard mostra "Last sign in" atualizado

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📋 Checklist de Validação

Execute na ordem:

- [ ] Rate limit verificado (sem bloqueios)
- [ ] localStorage/sessionStorage limpos
- [ ] Página recarregada (hard reload)
- [ ] Login realizado com sucesso
- [ ] Console mostra logs de sucesso
- [ ] Dashboard carregou (não redirecionou)
- [ ] localStorage tem token de auth
- [ ] Nome do usuário aparece no header
- [ ] Sem erros no console
- [ ] Navegação entre rotas funciona
- [ ] Logout funciona
- [ ] Supabase Dashboard mostra atividade recente

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🎬 Comece Agora!

1. Aguarde 2 minutos (se teve rate limit)
2. Limpe o browser (localStorage.clear())
3. Faça login
4. Me envie:
   - ✅ Funcionou? ou
   - ❌ Qual erro apareceu?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
