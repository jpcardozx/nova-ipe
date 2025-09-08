# Solucionando Erro de Conexão Supabase na Vercel

## Problema
```
Failed to load resource: net::ERR_NAME_NOT_RESOLVED
TypeError: Failed to fetch
AuthRetryableFetchError: Failed to fetch
```

## Causa
O erro acontece porque a Vercel não consegue resolver o DNS do Supabase ou há problemas de conectividade entre a Vercel e o Supabase.

## Soluções Implementadas

### 1. ✅ Arquivo .env.production criado
- Criado arquivo `.env.production` com configurações específicas para produção
- Timeout aumentado para 30 segundos
- User-Agent customizado adicionado

### 2. ✅ Cliente Supabase Melhorado
- Adicionado timeout de 30 segundos nas requisições
- Retry automático com exponential backoff
- Tratamento específico para erros de rede

### 3. ✅ Tratamento de Erro Aprimorado
- Mensagens de erro mais claras para problemas de rede
- Sistema de retry na autenticação
- Componente de debug para monitorar conectividade

### 4. ✅ Componente de Debug
- `ConnectionStatus` para monitorar conexão com Supabase
- Visível em produção para debugging
- Verifica conectividade a cada 30 segundos

## Próximos Passos na Vercel

### 1. Verificar Variáveis de Ambiente
Garanta que as seguintes variáveis estão configuradas na Vercel:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://ifhfpaehnjpdwdocdzwd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmaGZwYWVobmpwZHdkb2NkendkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMDMxMzIsImV4cCI6MjA3MjU3OTEzMn0.-YL0e3oE6mRqL0K432iP3dlbTRPz8G07QJLOI0Ulcyk
NEXT_PUBLIC_SITE_URL=https://nova-ipe.vercel.app
```

### 2. Comandos na Vercel CLI
```bash
# Verificar variáveis
vercel env ls

# Adicionar variáveis se necessário
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add NEXT_PUBLIC_SITE_URL

# Redeployar
vercel --prod
```

### 3. Verificar no Dashboard Vercel
1. Acesse o projeto na Vercel
2. Vá em Settings > Environment Variables
3. Verifique se todas as variáveis estão configuradas
4. Redeploy se necessário

### 4. Teste de Conectividade
- O componente `ConnectionStatus` aparecerá no canto superior direito
- Verde = Conectado
- Vermelho = Desconectado
- Amarelo = Verificando

## Troubleshooting Adicional

### Se o erro persistir:

1. **Verificar Supabase Status**
   - Acesse https://status.supabase.com/
   - Verifique se há outages

2. **Testar URL Manualmente**
   ```bash
   curl https://ifhfpaehnjpdwdocdzwd.supabase.co/rest/v1/
   ```

3. **Verificar CORS**
   - No Supabase Dashboard > Settings > API
   - Adicionar domínio da Vercel em "Allowed origins"

4. **RLS (Row Level Security)**
   - Verificar se as políticas estão corretas
   - Testar com RLS temporariamente desabilitado

## Arquivos Modificados

- ✅ `.env.production` - Configurações de produção
- ✅ `lib/supabase.ts` - Cliente com retry e timeout
- ✅ `app/login/page.tsx` - Tratamento de erro melhorado
- ✅ `app/components/debug/ConnectionStatus.tsx` - Monitor de conectividade

## Monitoramento

O componente ConnectionStatus permite monitorar em tempo real:
- Status da conexão com Supabase
- Mensagens de erro específicas
- Retry automático a cada 30 segundos

Com essas modificações, o sistema deve ser mais resiliente a problemas de rede e fornecer melhor feedback sobre problemas de conectividade.
