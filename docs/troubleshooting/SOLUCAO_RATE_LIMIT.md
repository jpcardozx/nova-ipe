━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 SOLUÇÃO: Rate Limit "Quota Exceeded" do Supabase
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🐛 Problema

**Erro:**
```
The quota has been exceeded.
```

**Causa:**
O Supabase tem rate limiting para proteger contra ataques de força bruta:
- **Free Tier:** 30 tentativas de autenticação por hora por IP
- **Pro Tier:** 100 tentativas por hora

Durante desenvolvimento, múltiplos reloads e testes podem esgotar rapidamente esse limite.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## ✅ Soluções Implementadas

### 1️⃣ Retry Logic com Exponential Backoff

**Localização:** `app/login/page.tsx`

```typescript
// Retry automático em caso de quota exceeded
let retries = 0
const maxRetries = 3

while (retries < maxRetries) {
  const { error } = await supabaseSignIn(fullEmail, data.password)
  
  if (!error) break // Sucesso!
  
  if (error.message.includes('quota has been exceeded')) {
    retries++
    const delay = Math.min(1000 * Math.pow(2, retries), 5000)
    // Aguarda: 2s, 4s, 5s antes de tentar novamente
    await new Promise(resolve => setTimeout(resolve, delay))
    continue
  }
  
  break // Outros erros, falhar imediatamente
}
```

**Benefícios:**
- ✅ Tenta automaticamente até 3 vezes
- ✅ Delay crescente entre tentativas (2s → 4s → 5s)
- ✅ Não afeta outros tipos de erro
- ✅ Mensagem amigável se falhar após retries

### 2️⃣ Mensagem de Erro Específica

```typescript
if (lastError.message.includes('quota has been exceeded')) {
  setErrorMessage('⚠️ Muitas tentativas de login. Por favor, aguarde 1 minuto e tente novamente.')
}
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🚀 Soluções Manuais

### Opção 1: Aguardar (Mais Simples)

**Tempo:** 1-2 minutos

O rate limit é **baseado em janelas de tempo**. Após 1-2 minutos, o contador é resetado parcialmente.

```bash
# Aguarde e tente novamente
⏰ Espere 60-120 segundos
🔄 Recarregue a página
✅ Tente fazer login novamente
```

### Opção 2: Resetar via Supabase Dashboard

**Tempo:** 30 segundos

1. Acesse: https://supabase.com/dashboard/project/ifhfpaehnjpdwdocdzwd
2. Menu lateral: **Authentication**
3. Aba: **Rate Limits**
4. Botão: **Reset Rate Limits**
5. Confirme: **Reset**

### Opção 3: Trocar de Usuário

**Tempo:** Imediato

O rate limit é **por email**, não por conta. Tente com outro usuário:

```
Email: julia@imobiliariaipe.com.br
Senha: @Ipe4693

Email: leonardo@imobiliariaipe.com.br
Senha: @Ipe4693

Email: jlpaula@imobiliariaipe.com.br
Senha: @Ipe4693
```

### Opção 4: Trocar de Rede/IP

**Tempo:** 1 minuto

O rate limit também é **por IP**. Se estiver em desenvolvimento:

```bash
# Opção A: Usar hotspot do celular
📱 Ativar hotspot
🔌 Conectar laptop ao hotspot
🔄 Tentar login novamente

# Opção B: Usar VPN
🔒 Conectar VPN
🌐 Trocar localização
🔄 Tentar login novamente

# Opção C: Usar modo anônimo + outra rede
🕵️ Abrir janela anônima
📡 Trocar de rede WiFi
🔄 Tentar login
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🛠️ Soluções para Produção

### 1️⃣ Aumentar Quota (Upgrade para Pro)

**Custo:** $25/mês
**Benefícios:**
- Rate limit: 100 tentativas/hora (vs 30)
- Support prioritário
- Sem pausas automáticas

**Como fazer:**
```
Supabase Dashboard > Settings > Billing > Upgrade to Pro
```

### 2️⃣ Implementar CAPTCHA

**Biblioteca:** `react-google-recaptcha`

```bash
pnpm add react-google-recaptcha
```

```typescript
// app/login/page.tsx
import ReCAPTCHA from "react-google-recaptcha"

const onLoginSubmit = async (data: LoginFormValues) => {
  // Verificar CAPTCHA antes de autenticar
  if (!captchaToken) {
    setErrorMessage('Por favor, complete o CAPTCHA')
    return
  }
  
  // Continuar com login normal...
}
```

### 3️⃣ Implementar Throttling no Cliente

```typescript
// lib/utils/throttle-login.ts
const loginAttempts = new Map<string, number>()

export function canAttemptLogin(email: string): boolean {
  const key = `login:${email}`
  const attempts = loginAttempts.get(key) || 0
  
  if (attempts >= 5) {
    return false // Bloquear após 5 tentativas
  }
  
  loginAttempts.set(key, attempts + 1)
  
  // Resetar após 5 minutos
  setTimeout(() => {
    loginAttempts.delete(key)
  }, 5 * 60 * 1000)
  
  return true
}
```

### 4️⃣ Cache de Sessão (Evitar Re-logins)

```typescript
// lib/hooks/useSupabaseAuth.ts
useEffect(() => {
  // Verificar sessão existente primeiro
  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session) {
      // Já logado, não precisa fazer login novamente
      setUser(session.user)
      router.push('/dashboard')
    }
  }
  
  checkSession()
}, [])
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📊 Monitoramento

### Verificar Status do Rate Limit

**Via Supabase Dashboard:**
```
Authentication > Rate Limits
```

Mostra:
- Tentativas usadas / Total permitido
- Tempo até reset
- IPs bloqueados

### Via Console do Browser

```javascript
// Verificar localStorage (pode ter tentativas salvas)
console.log('Auth attempts:', localStorage.getItem('auth-attempts'))

// Limpar contador local (se implementado)
localStorage.removeItem('auth-attempts')
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🎯 Recomendações

### Para Desenvolvimento

1. ✅ **Usar retry logic** (já implementado)
2. ✅ **Mensagem clara** para o usuário (já implementado)
3. ✅ **Trocar de usuário** quando quota esgotada
4. ✅ **Aguardar 60s** entre múltiplos testes
5. ⚠️ **Evitar reloads excessivos** durante debug

### Para Produção

1. 🔒 **Implementar CAPTCHA** após 3 tentativas falhas
2. 📈 **Upgrade para Pro tier** ($25/mês)
3. 🚨 **Monitorar rate limits** via dashboard
4. 💾 **Cache de sessão** para evitar re-logins
5. 📊 **Analytics** para identificar padrões de ataque

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## ✅ Ação Imediata

**Agora mesmo:**

1. ⏰ **Aguarde 60 segundos**
2. 🔄 **Recarregue a página** (Ctrl+Shift+R)
3. 🧪 **Tente login com outro usuário** (ex: julia@imobiliariaipe.com.br)
4. ✅ **Retry automático** vai tentar 3x com delays crescentes

**Se ainda falhar:**

1. 🌐 **Acesse Supabase Dashboard**
2. 🔓 **Reset Rate Limits** manualmente
3. 🔄 **Tente novamente**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📚 Referências

- [Supabase Rate Limiting Docs](https://supabase.com/docs/guides/platform/going-into-prod#rate-limiting)
- [Auth Rate Limits](https://supabase.com/docs/guides/auth/auth-rate-limits)
- [Exponential Backoff Pattern](https://en.wikipedia.org/wiki/Exponential_backoff)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
