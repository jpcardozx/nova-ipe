# Solução: Login para /studio não funciona

## Problema Identificado

O cookie `sb-ifhfpaehnjpdwdocdzwd-auth-token` é criado, mas o formato interno não contém `access_token` no primeiro nível.

### Logs observados:
```
✅ Token encontrado, verificando sessão...
❌ Access token não encontrado no cookie
```

## Causa Raiz

O Supabase Auth armazena o cookie em um formato diferente do esperado. Pode ser:
1. Array com objeto de sessão: `[{access_token, refresh_token, ...}]`
2. Objeto aninhado: `{session: {access_token, ...}}`
3. Token codificado em base64

## Solução Implementada

Atualizei `/app/api/studio/session/route.ts` para:
1. Adicionar logs detalhados do formato do cookie
2. Tentar múltiplos formatos de parsing
3. Usar o token diretamente se não for JSON

## Próximos Passos

### Opção 1: Usar createServerClient (Recomendado)
```typescript
import { createServerClient } from '@supabase/ssr'

const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
    },
  }
)

const { data: { session } } = await supabase.auth.getSession()
```

### Opção 2: Debug Manual
Adicione no console do browser:
```javascript
// Ver formato do cookie
document.cookie.split(';').filter(c => c.includes('sb-'))

// Ver localStorage
Object.keys(localStorage).filter(k => k.includes('sb-'))
```

## Teste via MCP

O teste via MCP funcionou 100%:
```bash
node -e "require('dotenv').config({ path: '.env.local' }); ..."
# ✅ Login bem-sucedido
# ✅ Token gerado corretamente
# ✅ API validou sessão: authenticated: true
```

Isso confirma que o problema é apenas no formato do cookie no navegador.
