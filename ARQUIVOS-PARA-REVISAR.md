# 📋 ARQUIVOS PARA REVISÃO - Decisão do Usuário

## 🔄 COMPONENTES DUPLICADOS/SIMILARES

### PropertyCard - 3 versões diferentes
- `app/components/PropertyCard.tsx`
- `components/ui/property/PropertyCard.tsx` 
- `lib/ui/components/property/PropertyCard.tsx`
**Decisão**: Escolher 1 versão principal e remover as outras?

### OptimizedCarousel - 2 versões
- `app/components/ui/OptimizedCarousel.tsx` ⚠️ (problemático - tem erros webpack)
- `app/components/OptimizedCarousel.tsx`
**Decisão**: Manter qual? O primeiro tem bugs conhecidos.

### SanityImage - 3 versões
- `app/components/SanityImage.tsx`
- `app/components/ui/SanityImage.tsx`  
- `components/SanityImage.tsx`
**Decisão**: Consolidar em uma versão?

### Button - 3 versões
- `app/components/ui/Button.tsx`
- `components/ui/core/Button.tsx`
- `lib/ui/core/Button.tsx`
**Decisão**: Padronizar em uma localização?

## 📄 PÁGINAS EXPERIMENTAIS

### Demos/Showcases
- `app/demo-shadcn/page.tsx` - Demo do Shadcn/UI
- `app/demo-ui/page.tsx` - Demo de componentes UI
- `app/nova-versao/page.tsx` - Página sobre nova versão
**Decisão**: São úteis para desenvolvimento ou podem ser removidas?

### Admin/Studio
- `app/admin/image-analytics/page.tsx` - Analytics de imagens
- `app/studio/page.tsx` - Página do Sanity Studio
- `studio/` - Todo diretório do Sanity Studio
**Decisão**: Manter funcionalidades admin?

### Performance Analytics
- `app/performance-analytics/page.tsx` - Análise de performance
**Decisão**: Útil para monitoramento ou remover?

## 🏠 PÁGINAS PRINCIPAIS MÚLTIPLAS

### Página Inicial - 5 versões
- `app/page.tsx` ✅ (atual - usando page-premium)
- `app/page-premium.tsx` ✅ (nossa versão final)
- `app/page-client-simple.tsx` 
- `app/page-fixed.tsx`
- `app/page-clean.tsx` 
- `app/page-minimal.tsx`
**Decisão**: Manter apenas page.tsx + page-premium.tsx e remover o resto?

### Alugar - 3 versões
- `app/alugar/page.tsx` ✅ (principal)
- `app/alugar/AlugarPage.tsx`
- `app/alugar/OptimizedAlugarPage.tsx`
- `app/alugar/TurboAlugarPage.tsx`
**Decisão**: Manter apenas page.tsx?

### Comprar - 3 versões
- `app/comprar/page.tsx` ✅ (principal)
- `app/comprar/ComprarPage.tsx`
- `app/comprar/OptimizedComprarPage.tsx`
- `app/comprar/TurboComprarPage.tsx`
**Decisão**: Manter apenas page.tsx?

## 🔧 UTILITÁRIOS E HELPERS

### Image Utilities - Múltiplas versões
- `lib/image-utils.ts`
- `lib/image-utils-fixed.ts`
- `lib/optimized-image.ts`
- `lib/optimized-sanity-image.ts`
- `lib/enhanced-sanity-image.ts`
**Decisão**: Consolidar em uma versão principal?

### Service Workers - 3 versões
- `app/workers/service-worker.ts`
- `public/service-worker.js`
- `public/sw.ts`
**Decisão**: Qual versão usar?

### Scripts de Build/Deploy
- `scripts/` - 50+ arquivos de scripts diversos
**Decisão**: Quais scripts são realmente necessários?

## 📊 COMPONENTS DE ANÁLISE/DEBUG

### Performance Monitoring - 10+ componentes
- `app/components/PerformanceMonitor.tsx`
- `app/components/PerformanceAnalytics.tsx`
- `app/components/PerformanceDiagnostic.tsx`
- `app/components/PerformanceOptimizer.tsx`
- `app/components/PerformanceVerification.tsx`
- E mais 5+ similares...
**Decisão**: Manter quantos? São todos necessários?

### WebVitals - 4 versões
- `app/components/WebVitals.tsx`
- `app/components/WebVitalsDebugger.tsx`
- `app/components/WebVitalsMonitor.tsx`
- `app/components/CoreWebVitalsTracker.tsx`
**Decisão**: Consolidar em 1-2 componentes?

## 🎨 UI COMPONENTS - Duplicações

### Loading Components - 8+ versões
- `app/components/LoadingSpinner.tsx`
- `app/components/LoadingState.tsx`
- `app/components/LoadingStateController.tsx`
- `app/components/LoadingStateManager.tsx`
- `app/components/OptimizedLoading.tsx`
- E mais...
**Decisão**: Quantos tipos de loading realmente precisamos?

---

## 🎯 MINHA RECOMENDAÇÃO INICIAL:

### ✅ MANTER DEFINITIVAMENTE:
- `app/page.tsx` + `app/page-premium.tsx` (homepage)
- `app/pagina-aprimorada/` (versão de referência)
- Componentes seguros identificados (FormularioContato, FooterAprimorado, etc)

### 🔴 REMOVER PROVAVELMENTE:
- Todas as versões "Optimized", "Turbo", "Enhanced" extras de páginas
- Duplicatas de componentes (manter só 1 versão de cada)
- Scripts de desenvolvimento antigos
- Componentes de debug/análise em excesso

### ❓ REVISAR CASO A CASO:
- Funcionalidades admin/studio
- Scripts de build essenciais
- Utilitários de imagem (consolidar)
- Componentes de performance (escolher 2-3 principais)