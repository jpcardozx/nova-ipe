# 🔍 Sistema de Error Handling e Debug - Login

Sistema completo de captura, categorização e reporting de erros para a página de login, com ferramentas avançadas de debugging.

## 📋 Features

### ✅ Implementado

1. **Categorização Automática de Erros**
   - 12 categorias específicas de erro
   - Detecção inteligente baseada em patterns
   - Mensagens user-friendly e técnicas separadas

2. **Error Metrics & Analytics**
   - ID único para cada erro
   - Duração da tentativa de login
   - Número da tentativa
   - Informações de contexto (email ofuscado, modo, etc)

3. **Environment Snapshot**
   - Informações do navegador e device
   - Status da rede (online/offline, tipo de conexão, velocidade)
   - Disponibilidade de storage (localStorage, cookies)
   - Uso de memória (heap)
   - Performance timing
   - Detecção automática de problemas no ambiente

4. **Debug Panel Interativo**
   - Painel visual com histórico de erros
   - Estatísticas por categoria
   - Informações técnicas detalhadas
   - Export de dados de debug em JSON
   - Toggle via `Ctrl+Shift+D`

5. **Enhanced Console Logging**
   - Logs estruturados e estilizados
   - Grupos colapsáveis para organização
   - Stack traces quando disponíveis
   - Environment snapshot em debug mode

6. **Production-Ready**
   - Placeholder para integração com Sentry/LogRocket
   - Ofuscação de dados sensíveis
   - Modo debug automático em development

## 🚀 Como Usar

### Debug Mode

**Ativar/Desativar:**
```bash
# Via teclado (na página de login)
Ctrl + Shift + D

# Via localStorage (console do navegador)
localStorage.setItem('LOGIN_DEBUG_MODE', 'true')  # ativar
localStorage.setItem('LOGIN_DEBUG_MODE', 'false') # desativar

# Via código
import { errorLogger } from '@/app/login/lib/error-handler'
errorLogger.setDebugMode(true)
```

### Debug Panel

Quando ativado, o Debug Panel aparece no canto inferior direito e mostra:

- **📊 Statistics**: Total de erros e breakdown por categoria
- **🔍 Error History**: Lista cronológica de erros com detalhes
- **⚙️ Controls**: 
  - Clear Console
  - Export Debug Data (JSON)

### Console Logs

Com debug mode ativo, você verá logs estruturados como:

```
🚨 LOGIN ERROR [ERR_1729180800000_abc123def]
├─ 📊 Metrics
│  ├─ category: AUTH_INVALID_CREDENTIALS
│  ├─ timestamp: 17/10/2025 14:30:00
│  ├─ duration: 1234ms
│  ├─ attempt: 1
│  └─ mode: dashboard
│
├─ 📝 Details
│  ├─ title: Credenciais Inválidas
│  ├─ message: O email ou senha fornecidos estão incorretos...
│  ├─ canRetry: true
│  └─ retryDelay: N/A
│
├─ ⚠️ Environment Issues (se houver)
│  └─ ["❌ Cookies desabilitados", "⚠️ Conexão lenta"]
│
├─ 🔧 Technical (debug mode only)
│  ├─ technicalMessage: Authentication failed: Invalid credentials
│  ├─ httpStatus: 401
│  └─ context: {...}
│
├─ 📚 Stack Trace (se disponível)
│
├─ 🔍 Original Error
│
└─ 🌍 Environment Snapshot
   ├─ 📱 Device
   ├─ 🌐 Network
   ├─ 💾 Storage
   ├─ 🧠 Memory
   └─ ⏱️ Timing
```

## 📂 Arquitetura

```
app/login/
├── lib/
│   ├── error-handler.ts        # Sistema principal de error handling
│   ├── environment-capture.ts  # Captura de environment snapshot
│   └── constants.ts
│
├── components/
│   ├── DebugPanel.tsx          # Painel visual de debugging
│   └── ...
│
└── page.tsx                    # Integração no componente de login
```

## 🎯 Categorias de Erro

| Categoria | Descrição | Retryable |
|-----------|-----------|-----------|
| `AUTH_INVALID_CREDENTIALS` | Credenciais inválidas | ✅ |
| `AUTH_RATE_LIMIT` | Muitas tentativas | ✅ (5min) |
| `AUTH_ACCOUNT_LOCKED` | Conta bloqueada | ❌ |
| `AUTH_EMAIL_NOT_CONFIRMED` | Email não confirmado | ❌ |
| `NETWORK_ERROR` | Erro de rede genérico | ✅ |
| `NETWORK_TIMEOUT` | Timeout na requisição | ✅ (10s) |
| `NETWORK_OFFLINE` | Usuário offline | ✅ |
| `SERVER_ERROR` | Erro interno do servidor | ✅ (30s) |
| `SERVER_UNAVAILABLE` | Servidor indisponível | ✅ (60s) |
| `SESSION_ERROR` | Erro ao criar sessão | ✅ |
| `VALIDATION_ERROR` | Dados inválidos | ✅ |
| `UNKNOWN_ERROR` | Erro desconhecido | ✅ (10s) |

## 🔧 API Reference

### Error Handler

```typescript
import { 
  buildErrorDetails,
  generateErrorMetrics,
  errorLogger 
} from '@/app/login/lib/error-handler'

// Construir detalhes do erro
const errorDetails = buildErrorDetails(error, context)

// Gerar métricas
const metrics = generateErrorMetrics(
  errorDetails,
  attemptNumber,
  duration,
  userEmail,
  loginMode
)

// Log estruturado
errorLogger.logError(errorDetails, metrics)

// Obter histórico
const history = errorLogger.getErrorHistory()

// Obter estatísticas
const stats = errorLogger.getStats()

// Limpar histórico
errorLogger.clearHistory()
```

### Environment Capture

```typescript
import { 
  captureEnvironment,
  logEnvironmentSnapshot,
  detectEnvironmentIssues 
} from '@/app/login/lib/environment-capture'

// Capturar snapshot
const snapshot = captureEnvironment()

// Log formatado
logEnvironmentSnapshot(snapshot)

// Detectar problemas
const issues = detectEnvironmentIssues(snapshot)
// ["❌ Usuário offline", "⚠️ Cookies desabilitados"]
```

## 📊 Métricas e Monitoring

### Development
- Logs no console (estruturados e estilizados)
- Debug Panel com histórico
- Export de dados em JSON

### Production
- Placeholder para Sentry/LogRocket/DataDog
- Dados sensíveis ofuscados
- Environment issues sempre logados

## 🎨 Customização

### Adicionar Nova Categoria de Erro

1. Adicione em `ErrorCategory` enum:
```typescript
export enum ErrorCategory {
  // ... existentes
  MY_NEW_ERROR = 'MY_NEW_ERROR',
}
```

2. Adicione patterns de detecção:
```typescript
const ERROR_PATTERNS = {
  // ... existentes
  MY_NEW_ERROR: [
    'my error pattern',
    'another pattern',
  ],
}
```

3. Adicione detalhes no `detailsMap`:
```typescript
[ErrorCategory.MY_NEW_ERROR]: {
  title: 'Título User-Friendly',
  message: 'Mensagem clara para o usuário...',
  technicalMessage: 'Mensagem técnica para debugging',
  userAction: 'O que o usuário deve fazer',
  canRetry: true,
  retryDelay: 30,
}
```

### Integrar com Sentry

Em `error-handler.ts`, no método `sendToMonitoring`:

```typescript
private sendToMonitoring(errorDetails: ErrorDetails, metrics: ErrorMetrics) {
  try {
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(errorDetails.originalError, {
        tags: {
          errorCategory: errorDetails.category,
          loginMode: metrics.loginMode,
          errorId: metrics.errorId,
        },
        extra: {
          userAction: errorDetails.userAction,
          canRetry: errorDetails.canRetry,
          duration: metrics.duration,
          attemptNumber: metrics.attemptNumber,
          environment: metrics.environment,
        },
        level: errorDetails.canRetry ? 'warning' : 'error',
      })
    }
  } catch (err) {
    console.error('[ErrorLogger] Failed to send to Sentry:', err)
  }
}
```

## 🧪 Testing

### Testar Erro Específico

```typescript
// No componente ou console
try {
  throw new Error('Invalid login credentials')
} catch (err) {
  // Sistema vai categorizar como AUTH_INVALID_CREDENTIALS
}
```

### Simular Network Error

```typescript
// Desabilitar network no DevTools
// Ou forçar offline:
Object.defineProperty(navigator, 'onLine', {
  writable: true,
  value: false
})
```

## 📝 Checklist de Debugging

Quando um usuário reportar erro de login, peça:

1. ✅ Error ID (ex: `ERR_1729180800000_abc123def`)
2. ✅ Screenshot do erro
3. ✅ Navegador e versão
4. ✅ Sistema operacional
5. ✅ Se o Debug Panel estava aberto, export do JSON

Com essas informações, você terá:
- Stack trace completo
- Environment snapshot
- Tentativas anteriores
- Issues detectados automaticamente

## 🚀 Próximos Passos

- [ ] Integração com Sentry/LogRocket
- [ ] Dashboard de analytics de erros
- [ ] Alertas automáticos para erros críticos
- [ ] Replay de sessão (LogRocket/FullStory)
- [ ] A/B testing de mensagens de erro
- [ ] Sugestões automáticas baseadas no erro

## 📚 Referências

- [Error Handling Best Practices](https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript)
- [Sentry Error Tracking](https://docs.sentry.io/)
- [Web Performance APIs](https://developer.mozilla.org/en-US/docs/Web/API/Performance)
- [Network Information API](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API)
