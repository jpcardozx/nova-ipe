# Guia de Deploy - Nova IPE

## Preparação para Deploy

### 1. Verificação de Pré-requisitos

#### Dependências Instaladas

```bash
# Verificar Node.js (versão 18+)
node --version

# Verificar npm
npm --version

# Instalar dependências
npm install
```

#### Verificações de Build

```bash
# Verificar tipos TypeScript
npm run typecheck

# Verificar linting
npm run lint

# Build de produção
npm run build
```

### 2. Configuração de Variáveis de Ambiente

#### Arquivo `.env.local` (Development)

```env
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_token

# Analytics
NEXT_PUBLIC_GA_TRACKING_ID=AW-17457190449
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_WEB_VITALS=true
NEXT_PUBLIC_VITALS_DEBUG=false

# API Configuration
NEXT_PUBLIC_API_URL=https://yourdomain.com
```

#### Arquivo `.env.production` (Production)

```env
# Mesmas variáveis do .env.local mas com valores de produção
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_VITALS_DEBUG=false
```

## Plataformas de Deploy

### 1. Vercel (Recomendado)

#### Deploy Automático via GitHub

1. Conectar repositório ao Vercel
2. Configurar variáveis de ambiente no dashboard
3. Deploy automático a cada push na branch main

#### Deploy Manual

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel --prod
```

#### Configuração Vercel (`vercel.json`)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NEXT_PUBLIC_SANITY_PROJECT_ID": "@sanity-project-id",
    "NEXT_PUBLIC_GA_TRACKING_ID": "@ga-tracking-id"
  },
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

### 2. Netlify

#### Build Settings

```bash
# Build command
npm run build

# Publish directory
.next
```

#### Netlify Configuration (`netlify.toml`)

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[build.environment]
  NEXT_TELEMETRY_DISABLED = "1"
```

### 3. Railway

#### Configuração Railway

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

#### Dockerfile (se necessário)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## Processo de Deploy

### 1. Pré-Deploy Checklist

- [ ] **Código testado**: Todas as funcionalidades testadas localmente
- [ ] **Build limpo**: `npm run build` executa sem erros
- [ ] **TypeScript**: `npm run typecheck` passa sem erros
- [ ] **Linting**: `npm run lint` passa sem warnings críticos
- [ ] **Variáveis de ambiente**: Todas configuradas no ambiente de produção
- [ ] **Analytics**: IDs de tracking corretos
- [ ] **Sanity**: CMS configurado e populado
- [ ] **Contatos**: Números de telefone atualizados (+5511981845016)

### 2. Deploy Steps

```bash
# 1. Limpar cache e dependências
npm run clean:all
npm install

# 2. Verificar tipos
npm run typecheck

# 3. Verificar linting
npm run lint

# 4. Build de produção
npm run build

# 5. Testar localmente
npm run start

# 6. Deploy (Vercel)
vercel --prod
```

### 3. Pós-Deploy Verification

#### Verificações Automáticas

- [ ] **Site carregando**: Homepage acessível
- [ ] **Formulários**: Teste de envio de contato
- [ ] **WhatsApp**: Links redirecionando corretamente
- [ ] **Analytics**: Eventos sendo registrados
- [ ] **Performance**: Core Web Vitals aceitáveis
- [ ] **SEO**: Meta tags e estruturação correta

#### Testes Manuais

```bash
# Testar formulário de contato
curl -X POST https://yourdomain.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste",
    "email": "teste@email.com",
    "message": "Mensagem de teste",
    "subject": "Teste",
    "propertyType": "venda"
  }'
```

## Monitoramento e Manutenção

### 1. Analytics Setup

#### Google Analytics 4

- Verificar se eventos estão sendo registrados
- Configurar conversões para formulários
- Monitorar Core Web Vitals

#### Facebook Pixel

- Verificar events de ViewContent e Lead
- Configurar campanhas de remarketing

### 2. Performance Monitoring

#### Core Web Vitals

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

#### Tools de Monitoramento

- Google PageSpeed Insights
- GTmetrix
- WebPageTest
- Lighthouse CI

### 3. Error Monitoring

#### Sentry Integration (Opcional)

```bash
npm install @sentry/nextjs

# Configure in next.config.js
const { withSentryConfig } = require('@sentry/nextjs');
```

#### Error Boundary

```typescript
// app/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Algo deu errado!</h2>
      <button onClick={() => reset()}>Tentar novamente</button>
    </div>
  );
}
```

## Troubleshooting

### Problemas Comuns

#### 1. Build Falha

```bash
# Limpar cache
npm run clean:all
rm -rf node_modules package-lock.json
npm install

# Verificar Node.js version
node --version  # Deve ser 18+
```

#### 2. Variáveis de Ambiente

```bash
# Verificar se estão definidas
echo $NEXT_PUBLIC_SANITY_PROJECT_ID

# Verificar no código
console.log(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
```

#### 3. Sanity CMS Issues

```bash
# Verificar conexão
npm run sanity:check

# Rebuild schema
npm run sanity:deploy
```

#### 4. Analytics Não Funcionando

- Verificar NEXT_PUBLIC_GA_TRACKING_ID
- Verificar se analytics está habilitado em produção
- Verificar Network tab no browser

### Logs e Debug

#### Vercel Logs

```bash
# Visualizar logs
vercel logs

# Logs em tempo real
vercel dev
```

#### Local Debug

```bash
# Modo desenvolvimento com debug
NEXT_PUBLIC_VITALS_DEBUG=true npm run dev

# Build com análise
npm run analyze
```

## Security Checklist

### Pré-Deploy Security

- [ ] **Variáveis sensíveis**: Não expostas no código
- [ ] **CORS**: Configurado adequadamente
- [ ] **Rate limiting**: Implementado nas APIs
- [ ] **Input validation**: Client e server-side
- [ ] **HTTPS**: Certificado SSL configurado
- [ ] **Headers de segurança**: CSP, HSTS, etc.

### Headers de Segurança (`next.config.js`)

```javascript
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
];

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};
```

## Backup e Recovery

### 1. Backup do Sanity

```bash
# Exportar dados
sanity dataset export production backup.tar.gz

# Importar dados
sanity dataset import backup.tar.gz production
```

### 2. Backup do Código

- Repositório Git sempre atualizado
- Tags para releases importantes
- Branches de backup para deploys críticos

### 3. Recovery Plan

1. **Rollback de Deploy**: Usar versão anterior no Vercel
2. **Restaurar Sanity**: Importar backup de dados
3. **Restaurar Código**: Checkout de commit estável

## Conclusão

Este guia cobre todos os aspectos essenciais para um deploy seguro e confiável do Nova IPE. Sempre teste em ambiente de staging antes do deploy de produção e mantenha backups atualizados.
