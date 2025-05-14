# Otimizações Técnicas - Nova Ipê Imobiliária

Este documento descreve as otimizações implementadas no site da Nova Ipê Imobiliária para garantir melhor desempenho, estabilidade e escalabilidade.

## Índice

1. [Arquitetura da Aplicação](#arquitetura-da-aplicação)
2. [Otimização de Componentes](#otimização-de-componentes)
3. [Integração com Sanity CMS](#integração-com-sanity-cms)
4. [Otimização de Imagens](#otimização-de-imagens)
5. [Configurações do Next.js](#configurações-do-nextjs)
6. [Práticas para Desempenho](#práticas-para-desempenho)

## Arquitetura da Aplicação

### Client/Server Components Pattern

Implementamos uma arquitetura que aproveita ao máximo a separação entre Server e Client Components do Next.js:

- **Server Components**: Para conteúdo estático e inicial que não precisa de interatividade, maximizando o desempenho de SSR.
- **Client Components**: Para componentes interativos e dinâmicos, usando o padrão "Client Component Wrapper" para evitar problemas comuns.

```tsx
// Exemplo de Client Component Wrapper
'use client'; // Marcação explícita como componente de cliente

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

// Componentes importados dinamicamente
export const PropertyFeatureTabs = dynamic(() => import('./PropertyFeatureTabs'));

// Wrapper de componentes cliente
export default function ClientPage({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
```

### Carregamento Dinâmico

Componentes mais pesados são carregados dinamicamente via código-dividido, reduzindo o bundle principal:

```tsx
// Importação de componentes pesados é feita apenas quando necessário
const PropertyFeatureTabs = dynamic(() => import('./PropertyFeatureTabs'), {
  loading: () => <SkeletonLoader variant="simple" height="300px" />
});
```

## Otimização de Componentes

### Memoização e Redução de Re-renderizações

Implementamos a memoização para componentes de UI reutilizáveis para evitar re-renderizações desnecessárias:

```tsx
// Exemplo de componente memoizado para reduzir re-renderizações
const TabButton = memo(({ feature, isActive, onClick }) => {
  // Implementação
});

TabButton.displayName = 'TabButton';
```

### Uso de useCallback para Funções

Funções de manipulação de eventos são envolvidas com `useCallback` para manter referências estáveis:

```tsx
const handleTabChange = useCallback((tabId: string) => {
  setActiveTab(tabId);
}, []);
```

### Otimização de Animações

As animações foram otimizadas para minimizar o impacto no desempenho:

```tsx
// Definições de variantes de animação fora do ciclo de renderização
const contentVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
};

// Uso com AnimatePresence para transições suaves
<AnimatePresence mode="wait">
  <motion.div
    key={activeTab}
    initial="hidden"
    animate="visible"
    exit="exit"
    variants={contentVariants}
    transition={{ duration: 0.2 }}
  >
    {/* Conteúdo */}
  </motion.div>
</AnimatePresence>
```

## Integração com Sanity CMS

Implementamos uma integração otimizada com o Sanity CMS usando métodos eficientes de busca:

### Cliente Sanity Otimizado

```js
import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';

const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  useCdn: process.env.NODE_ENV === 'production',
  apiVersion: '2023-05-03',
};

export const sanityClient = createClient(config);
```

### Consultas GROQ Eficientes

As consultas ao Sanity foram otimizadas para trazer apenas os dados necessários:

```js
export async function getFeaturedProperties(limit = 6) {
  return sanityClient.fetch(`
    *[_type == "property" && featured == true] | order(publishedAt desc)[0...${limit}] {
      _id,
      title,
      slug,
      location,
      city,
      price,
      // Apenas os campos necessários
      // Projeções otimizadas para imagens
      "mainImage": {
        "url": mainImage.asset->url,
        "alt": mainImage.alt
      },
      isPremium,
      isHighlight
    }
  `);
}
```

## Otimização de Imagens

### Uso do Componente Next/Image

Todas as imagens foram implementadas com o componente `next/image` para otimização automática:

```tsx
<Image
  src="/images/localizacao.jpg"
  alt="Vista aérea de Guararema"
  fill
  className="object-cover"
  priority={false}
/>
```

### Carregamento Priorizado

Atributo `priority` foi aplicado estrategicamente nas imagens acima da dobra para melhorar o LCP:

```tsx
<Image
  src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d"
  alt="Interior de imóvel premium"
  fill
  className="object-cover"
  priority
/>
```

### Carregamento Lazy para Imagens Abaixo da Dobra

Imagens abaixo da dobra são carregadas com lazy loading:

```tsx
<img
  src={activeFeature.image}
  alt={activeFeature.title}
  className="w-full h-auto object-cover rounded-lg"
  loading="lazy"
/>
```

## Configurações do Next.js

### Domínios de Imagem Permitidos

Domínios externos de imagens foram configurados corretamente:

```js
// next.config.js
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'market-assets.fra1.cdn.digitaloceanspaces.com',
      'cdn.sanity.io'
    ],
  },
  // ...
};
```

### Otimização para Arquivos 3D

Configurações para lidar com arquivos 3D de forma eficiente:

```js
// next.config.js
webpack: (config) => {
  // Regra para arquivos .glb, .gltf
  config.module.rules.push({
    test: /\.(glb|gltf)$/,
    type: 'asset/resource',
  });

  return config;
},
```

### Ajuste de Limites para Dados de Página

```js
experimental: {
  largePageDataBytes: 512 * 1000, // 512kb
},
```

## Práticas para Desempenho

### Carregamento Condicional de Componentes Pesados

Componentes como visualizadores 3D e tours virtuais são carregados apenas quando necessários.

### Bundle Analyzer para Monitoramento

Configuração do `@next/bundle-analyzer` para análise contínua do tamanho dos bundles.

### Análise Web Vitals

Implementação de monitoramento de Web Vitals para identificar problemas de desempenho em produção.

```
Web Vitals: {
  name: 'FCP',
  delta: 12880,
  value: 12880,
  id: 'v5-1747089510141-2468830176679',
  page: '/'
}
```

### Tamanhos de Javascript Reduzidos

Implementação de code-splitting, eliminar pacotes não utilizados e carregamento seletivo de recursos premium.

## Próximos Passos para Otimização

1. Implementar ISR (Incremental Static Regeneration) para páginas de propriedades populares
2. Adicionar Service Worker para experiência offline
3. Implementar estratégia de cache mais agressiva para conteúdo estático
4. Pré-carregamento inteligente de páginas com base em padrões de navegação do usuário
5. Implementar componentes 3D e de tour virtual com carregamento progressivo quando necessário 