# Nova Ipê Performance Optimization Guide

## Visão Geral

Este documento contém diretrizes e melhores práticas para manter e melhorar a performance do site da Nova Ipê Imobiliária. Implementamos várias otimizações para melhorar as métricas de Web Vitals, especialmente FCP (First Contentful Paint), LCP (Largest Contentful Paint) e bloqueio de thread principal.

## Métricas Alvo

| Métrica | Objetivo | Atual |
|---------|----------|-------|
| FCP     | < 1800ms | 3044ms |
| LCP     | < 2500ms | 17164ms |
| CLS     | < 0.1    | 0.05 |
| TTI     | < 3800ms | 12522ms |

## Principais Otimizações Implementadas

### 1. Estratégia de Carregamento de CSS

- **CSS Crítico**: Implementamos inline CSS crítico para o conteúdo acima da dobra, eliminando CSS render-blocking.
- **Carregamento Diferido**: O CSS não crítico é carregado após o renderização inicial.
- **Exemplo**: Arquivo `critical-styles.css` e configuração em `layout.tsx`.

```tsx
<style id="critical-css" dangerouslySetInnerHTML={{
  __html: `
    /* Critical CSS inline */
    body, html { margin: 0; padding: 0; box-sizing: border-box; }
    /* ... */
  `
}} />

<link
  rel="stylesheet"
  href="/critical-bundle.css"
  media="print"
  onLoad={() => {
    const styleSheet = document.querySelector('link[href="/critical-bundle.css"]');
    if (styleSheet) {
      (styleSheet as HTMLLinkElement).media = 'all';
    }
  }}
/>
```

### 2. Otimização JavaScript

- **Chunking Inteligente**: Configuração de `splitChunks` no webpack para separar dependências grandes.
- **Carregamento Dinâmico**: Use `DynamicComponentLoader` para componentes pesados.
- **ThirdPartyScriptLoader**: Gerencia scripts de terceiros com diferentes prioridades.

```tsx
// Exemplo de carregamento dinâmico
import { DynamicComponentLoader } from '@/app/components/DynamicComponentLoader';

// Em vez disso:
// import HeavyComponent from './HeavyComponent';
// <HeavyComponent />

// Use assim:
<DynamicComponentLoader
  componentName="HeavyComponent"
  importFunc={() => import('./HeavyComponent')}
  preloadDistance={300}
/>
```

### 3. Otimização de Imagem

- **OptimizedImageGallery**: Componente para gerenciamento de imagens com carregamento otimizado.
- **Placeholders SVG**: Gera placeholders leves para evitar CLS (Cumulative Layout Shift).
- **Carregamento Condicional**: Imagens são carregadas apenas quando entram no viewport.

```tsx
import OptimizedImageGallery from '@/app/components/OptimizedImageGallery';

<OptimizedImageGallery
  images={images}
  image={sanityImageReference}
  alt="Descrição da imagem"
  priority={isAboveTheFold} // true para imagens acima da dobra
/>
```

### 4. Monitoramento de Performance

- **WebVitalsMonitor**: Componente para rastrear Web Vitals.
- **API de Métricas**: Endpoints para coleta de métricas de performance:
  - `/api/vitals` - Coleta Web Vitals
  - `/api/component-metrics` - Rastreia tempo de carregamento de componentes
- **Painel de Analytics**: Disponível em `/performance-analytics` (apenas em desenvolvimento).

## Como Implementar

### Para Imagens:

1. Substitua o componente `Image` do Next.js ou `SanityImage` por `OptimizedImageGallery`.
2. Para imagens acima da dobra, use `priority={true}`.
3. Defina `sizes` adequadamente para diferentes breakpoints.

### Para Componentes Pesados:

1. Use o `DynamicComponentLoader` para componentes com mais de 30KB.
2. Mova recursos caros (como animations, charts) para carregamento lazy.
3. Inclua um skeleton adequado.

### Para Scripts de Terceiros:

1. Use o `ThirdPartyScriptLoader` com a prioridade correta.
2. Scripts não críticos devem usar `priority="low"`.
3. Scripts analíticos devem usar estratégia `worker`.

## Lista de Verificação de Performance

- [ ] CSS crítico em linha para conteúdo acima da dobra
- [ ] Carregamento progressivo de JavaScript para conteúdo secundário
- [ ] Imagens com otimização (tamanho, formato, lazy loading)
- [ ] Preload de recursos críticos (fontes, scripts essenciais)
- [ ] Recursos de terceiros com prioridade adequada
- [ ] Monitoramento de Web Vitals configurado

## Ferramentas de Diagnóstico

- **Painel interno**: `/performance-analytics`
- **Lighthouse**: Para auditorias de performance gerais
- **WebPageTest**: Para análise detalhada de waterfall
- **Chrome DevTools**: Análise de Performance e Runtime de JavaScript

## Glossário de Métricas

- **FCP (First Contentful Paint)**: Tempo até o primeiro conteúdo ser renderizado.
- **LCP (Largest Contentful Paint)**: Tempo até o maior elemento de conteúdo ser renderizado.
- **CLS (Cumulative Layout Shift)**: Quantidade de mudanças inesperadas de layout.
- **TTI (Time to Interactive)**: Tempo até a página se tornar interativa.
- **TBT (Total Blocking Time)**: Tempo total que o thread principal ficou bloqueado.

## Recursos

- [Web Vitals](https://web.dev/vitals/)
- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)
- [React Performance Optimization](https://reactjs.org/docs/optimizing-performance.html)
