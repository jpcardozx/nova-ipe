# Workflow Optimization Report

## Status Atual: 2025-08-10

### ✅ Stack Atualizado

- Next.js: 14.2.31 → **15.4.6**
- React: 18.3.1 → **19.1.1**
- Framer Motion: 10.18.0 → **12.23.12**
- Sanity: 3.99.0 → **4.3.0**
- next-sanity: 6.1.4 → **10.0.10**

### 🔧 Correções Aplicadas

- ✅ next.config.js: `serverComponentsExternalPackages` → `serverExternalPackages`
- ✅ Removido `swcMinify` (obsoleto no Next.js 15)
- ✅ sanity.server.ts: `revalidateTag` import dinâmico

### ❌ Breaking Changes - Framer Motion v12

**67 erros TypeScript** devido a mudanças na API:

#### Problemas Críticos:

1. **ease**: `number[]` → `Easing[]` (tipo específico)
2. **type**: `string` → `AnimationGeneratorType`
3. **layoutEffect**: removido do `useScroll`

#### Arquivos Afetados:

- PremiumHero-\*.tsx (13 erros)
- PremiumImageGallery.tsx (4 erros)
- PropertyContactModal.tsx (transition type)
- ProgressSteps.tsx (layoutEffect)

## Estratégia de Correção

### Fase 1: Animation Variants

```typescript
// ANTES (v10)
ease: [0.6, 0.01, -0.05, 0.95];
type: 'spring';

// DEPOIS (v12)
ease: 'easeInOut';
type: 'spring' as const;
```

### 🎯 Status Final: 67→12 Erros (82% redução)

**Problemas Resolvidos:**

- ✅ useScroll layoutEffect removido (4 arquivos)
- ✅ PropertyContactModal transition type fixed
- ✅ PremiumHero ease types corrigidos (5 componentes)
- ✅ Next.js 15 config updated

**Análise da Homepage:**

- ❌ **page-real-estate.tsx**: Design básico/desatualizado
- ✅ **page-client.tsx**: IpeConcept premium + componentes avançados
- 🔄 **Estratégia**: Migrar para page-client como principal

**Erros Restantes (12):**

1. **IpeConceptSafe.tsx** (9 erros): ease arrays `[0.6, 0.01]` → `"easeOut"`
2. **PremiumSalesSection** (2 erros): similar fix
3. **API route** (1 erro): NextRequest.ip deprecado

### Próxima Iteração: Homepage Strategy

#### Problema Identificado:

- `page.tsx` → `page-real-estate.tsx` (design inferior)
- `page-client.tsx` tem IpeConcept + premium components (melhor UX)

#### Solução:

```typescript
// app/page.tsx - Redirect para versão premium
export default function HomePage() {
  return <IpeConceptHomePage />;
}
```

pnpm update tailwindcss@latest
pnpm update eslint@latest eslint-config-next@latest

```

## Próximos Passos

1. ✅ Diagnosticar EPERM (não reproduzido)
2. 🔄 Resolver peer dependencies
3. 🔄 Atualizar stack crítico
4. 🔄 Otimizar PostCSS/Tailwind config
```
