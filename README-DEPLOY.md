# Nova IPE Imobiliária - Preparação para Deploy

Este documento contém instruções para deploy da versão otimizada e corrigida do site da Nova IPE Imobiliária.

## Correções e Melhorias Implementadas

1. **Normalização de Imagens**
   - Implementada interface unificada para imagens (ClientImage)
   - Suporte a múltiplos formatos (Sanity, Next.js Image)
   - Tratamento adequado de URLs e hotspots
   - Fallbacks para imagens ausentes

2. **Componentes Otimizados**
   - SanityImage aprimorado com suporte a múltiplos formatos
   - ImovelCard com validação de finalidade e tratamento robusto
   - Skeleton loaders para melhor UX durante carregamento

3. **Utilidades de Conversão**
   - Funções para normalizar documentos do Sanity
   - Geração de URLs responsivas e previews
   - Projeção de imagens para consultas GROQ

4. **Mock API para Desenvolvimento**
   - Implementada API simulada para testes offline
   - Dados consistentes com a estrutura esperada em produção

5. **CSS e Animações**
   - Corrigido CSS para animações de shimmer e transitions
   - Layout responsivo e ajustes de acessibilidade

## Instruções de Deploy

### Pré-requisitos
- Node.js 18+
- Acesso ao projeto Sanity
- Acesso ao ambiente de hospedagem (Vercel recomendado)

### Variáveis de Ambiente
Crie um arquivo `.env.local` com as seguintes configurações:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=seu-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-05-03
SANITY_API_TOKEN=seu-token-com-permissao-de-leitura
```

### Procedimento de Build e Deploy

1. **Instalação de dependências**
   ```bash
   npm install
   ```

2. **Verificação de tipos e lint**
   ```bash
   npm run lint
   npm run type-check
   ```

3. **Build de produção**
   ```bash
   npm run build
   ```

4. **Deploy para Vercel (recomendado)**
   ```bash
   npx vercel --prod
   ```

### Verificações Pós-Deploy

1. **Carregamento de Imagens**
   - Verificar se as imagens estão carregando corretamente
   - Confirmar se os formatos responsivos estão funcionando

2. **Navegação**
   - Testar fluxo de navegação entre páginas
   - Verificar comportamento do histórico do navegador

3. **Componentes Dinâmicos**
   - Testar adição/remoção de favoritos
   - Verificar comportamento do slider de imóveis

4. **Performance**
   - Executar Lighthouse para verificar performance
   - Corrigir eventuais problemas de CLS, FID ou LCP

## Roadmap para Futuras Melhorias

1. **Integração com Analytics**
   - Implementar Google Analytics ou Plausible
   - Rastrear conversões e eventos

2. **Melhorias de SEO**
   - Otimizar meta tags específicas para cada imóvel
   - Implementar Schema.org para melhor indexação

3. **Aprimoramentos de UI**
   - Tema escuro
   - Mais opções de filtragem e busca

4. **Integrações**
   - WhatsApp Business API
   - Calculadora de financiamento

---

Documento elaborado em [DATA] para facilitar o deploy e manutenção do site. 