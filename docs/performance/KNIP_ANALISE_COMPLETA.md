# 📊 Análise KNIP - Código Não Utilizado

**Data:** 12 de outubro de 2025  
**Ferramenta:** knip v5.64.3  
**Projeto:** Nova IPÊ

---

## 🎯 Sumário Executivo

### Números Gerais

| Categoria | Quantidade | Severidade |
|-----------|-----------|------------|
| **Arquivos não utilizados** | 734 | 🔴 Crítico |
| **Dependências não usadas** | 34 | 🟡 Moderado |
| **DevDependencies não usadas** | 9 | 🟢 Baixo |
| **Exports não utilizados** | 143 | 🟡 Moderado |

**Total de itens para limpeza: 920**

---

## 📁 Arquivos Não Utilizados (734)

### Por Categoria

#### 🎨 Componentes UI/UX (estimados ~300 arquivos)
```
app/components/
├── HeroImovel.tsx
├── HeroImovelSimbolico.tsx
├── HeroInstitucional.tsx
├── EnhancedHero.tsx
├── ProfessionalHero.tsx
├── FormalHero.tsx
├── InteractiveHero.tsx
├── CleanHero.tsx
├── AnimatedCTASection.tsx
├── EnhancedPropertyCard.tsx
├── ElegantPropertyCard.tsx
├── PremiumPropertyCard.tsx
├── OptimizedImovelCard.tsx
├── SimplePropertyCard.tsx
└── ... muitos outros
```

#### 📦 Componentes de Propriedades Duplicados
```
app/components/property/
├── PropertyCard.tsx
├── PropertyCatalog.tsx
├── PropertyCatalogFixed.tsx
├── PropertyCatalogOptimized.tsx
├── PropertyCatalogOptimizedSimple.tsx
└── ...

app/components/premium/
├── ModernPropertyCardV2.tsx
├── PremiumPropertyCardOptimized.tsx
├── PremiumPropertyCarouselOptimized.tsx
└── ...

app/components/layouts/
├── PropertyCard.tsx (duplicado!)
├── PropertySection.tsx
└── PropertySectionLayout.tsx
```

#### 🔧 Utilitários Não Usados
```
app/actions/
├── formActions.ts
└── performance-monitoring.ts

app/utils/
├── data-prefetcher.ts
├── scroll-helper.ts
└── property-transformer.ts
```

#### 🐛 Debug e Ferramentas de Desenvolvimento
```
app/components/
├── debug-tools.ts
├── debug-tools.tsx
└── debug/
    ├── ConnectionStatus.tsx
    └── SupabaseDebugInfo.tsx
```

#### 📄 Páginas e Rotas Não Usadas
```
app/alugar/
├── AlugarPage.tsx
└── OptimizedAlugarPage.tsx

app/catalogo/components/
├── CatalogoHero.tsx
├── CatalogoHeroClean.tsx
├── CatalogoHeroEnhanced.tsx
└── ...
```

---

## 📦 Dependências Não Utilizadas (34)

### Dependências de Produção

#### UI Components
```json
"@hello-pangea/dnd": "18.0.1",           // Drag and drop
"@radix-ui/react-accordion": "^1.1.2",   // Accordion
"@radix-ui/react-dialog": "^1.0.5",      // Modal
"@radix-ui/react-dropdown-menu": "2.1.16", // Dropdown
"@radix-ui/react-slot": "^1.0.2",        // Slot
"@radix-ui/react-tabs": "^1.0.4",        // Tabs
"@radix-ui/react-toast": "^1.1.5",       // Toast notifications
```

**Impacto:** ~400KB bundle size  
**Ação:** Remover ou implementar

#### Autenticação
```json
"@auth/core": "0.41.0",     // Auth.js core (não usado!)
"bcryptjs": "3.0.2",        // Hashing (não usado!)
"iron-session": "8.0.4",    // Sessions (não usado!)
"jose": "6.1.0",            // JWT (já temos jsonwebtoken)
```

**Impacto:** ~150KB bundle size  
**Ação:** Remover - usando Supabase

#### Sanity CMS
```json
"@sanity/block-tools": "3.70.0",  // Deprecated!
"@sanity/icons": "^3.7.4",        // Ícones não usados
"@sanity/image-url": "^1.0.2",    // Já temos implementação custom
"@sanity/schema": "4.10.2",       // Não usado
"@portabletext/react": "^3.0.15", // Não usado
```

**Impacto:** ~200KB bundle size  
**Ação:** Remover ou consolidar

#### Virtualização e Performance
```json
"@tanstack/react-virtual": "3.13.12",
"@types/react-window": "1.8.8",
"react-virtualized-auto-sizer": "1.0.26",
"react-window": "2.2.0",
"react-window-infinite-loader": "2.0.0",
```

**Impacto:** ~100KB bundle size  
**Ação:** Remover se não for usar virtualização

#### Calendário
```json
"react-big-calendar": "1.19.4",
"react-day-picker": "9.11.1",
```

**Impacto:** ~150KB bundle size  
**Ação:** Remover se não tiver agenda implementada

#### Utilitários
```json
"currency.js": "2.0.4",          // Formatação de moeda
"embla-carousel-autoplay": "8.6.0", // Carousel autoplay
"next-themes": "^0.2.1",         // Theme switcher
"react-use": "17.6.0",           // React hooks utilities
"usehooks-ts": "3.1.1",          // TypeScript hooks
"zustand": "3.7.2",              // State management
```

**Impacto:** ~80KB bundle size  
**Ação:** Avaliar uso individual

#### Documentos e PDFs
```json
"mjml": "4.16.1",      // Email templates
"pdf-lib": "1.17.1",   // PDF manipulation
"jsdom": "27.0.0",     // DOM manipulation
```

**Impacto:** ~500KB bundle size (!!)  
**Ação:** Remover se não processar PDFs

#### Logging
```json
"pino": "10.0.0",
"pino-pretty": "13.1.2",
```

**Impacto:** ~50KB bundle size  
**Ação:** Consolidar com logger existente

---

## 🛠️ DevDependencies Não Utilizadas (9)

```json
"@next/bundle-analyzer": "...",    // Bundle analysis
"@tailwindcss/line-clamp": "...",  // Line clamp (nativo no Tailwind 3.3+)
"@types/handlebars": "...",        // Types deprecated
"eslint": "8.57.1",                // Deprecated version!
"eslint-config-next": "...",       // ESLint config
"pdf-poppler": "...",              // PDF processing
"sharp": "...",                    // Image processing
"source-map-loader": "...",        // Webpack loader
"supabase": "2.39.2",              // Supabase CLI
```

**Ação Recomendada:**
- ✅ Manter `sharp` se processar imagens server-side
- ✅ Manter `supabase` CLI
- ⚠️ Atualizar `eslint` para v9+
- ❌ Remover o resto

---

## 📤 Exports Não Utilizados (143)

### Mais Críticos

#### Auth Module (recém criados!)
```typescript
// lib/auth/index.ts - exports não usados
- createSupabaseServerClient  // Usar direto do supabase-auth.ts
- login                        // Usar direto do supabase-auth.ts
- logout                       // Usar direto do supabase-auth.ts
- checkAuth                    // Usar direto do supabase-auth.ts
- isStudio                     // Não usado
- hasAnyRole                   // Não usado
- canManageUsers               // Não usado
- canAccessDashboard           // Não usado
- canAccessStudio              // Não usado
- requireAdmin                 // Não usado (mas útil manter!)
- generateToken                // Não usado
- verifyStudioAccess           // Não usado
- AuthDebugger                 // Não usado
- authDebugger                 // Não usado
```

**Ação:** Manter por enquanto (podem ser usados no futuro)

#### Sanity Helpers
```typescript
// lib/sanity-image-helpers.ts
- buildSanityImageUrl
- extractSanityImageUrl
- generateSanityImageSrcSet
- isValidSanityImage
- extractImageAlt
- useSanityImage

// lib/sanity/queries.ts
- getImoveisDestaqueVenda
- getImoveisAluguel
- getFeaturedProperties
- getRentalProperties
- getSaleProperties
```

**Ação:** Consolidar ou remover

#### UI Components
```typescript
// app/components/ui/
- SafeHydration
- HeroImage
- ThumbnailImage
- SectionHeader
- SectionLoading
- ClientModal
- TaskModal
```

**Ação:** Remover se não usados

---

## 💰 Impacto no Bundle Size

### Estimativa de Redução Potencial

| Categoria | Tamanho Estimado | Prioridade |
|-----------|------------------|------------|
| PDF/Document libs (mjml, pdf-lib, jsdom) | ~500KB | 🔴 Alta |
| Radix UI não usados | ~400KB | 🔴 Alta |
| Sanity libs duplicadas | ~200KB | 🟡 Média |
| Calendário libs | ~150KB | 🟡 Média |
| Auth libs não usadas | ~150KB | 🟡 Média |
| Virtualização libs | ~100KB | 🟢 Baixa |
| Outros utilitários | ~200KB | 🟢 Baixa |

**Total Potencial de Redução: ~1.7MB (!)**

---

## 🎯 Plano de Ação Recomendado

### Fase 1: Limpeza Crítica (Impacto Imediato) 🔴

```bash
# 1. Remover dependências pesadas não usadas
pnpm remove mjml pdf-lib jsdom @sanity/block-tools

# 2. Remover auth libs duplicadas
pnpm remove @auth/core bcryptjs iron-session jose

# 3. Remover Radix UI não usados
pnpm remove @radix-ui/react-accordion @radix-ui/react-dialog \
  @radix-ui/react-dropdown-menu @radix-ui/react-slot \
  @radix-ui/react-tabs @radix-ui/react-toast
```

**Economia estimada: ~1MB**

### Fase 2: Limpeza de Componentes (Organização) 🟡

```bash
# Criar diretório de backup antes de deletar
mkdir -p .archived/components

# Mover componentes não usados
mv app/components/Hero*.tsx .archived/components/
mv app/components/*PropertyCard*.tsx .archived/components/
mv app/components/premium/ .archived/components/

# Depois de validar, deletar
rm -rf .archived/
```

**Arquivos removidos: ~300**

### Fase 3: Consolidação (Refatoração) 🟢

```bash
# 1. Consolidar helpers de imagem
# 2. Remover queries Sanity duplicadas
# 3. Limpar exports não usados
```

---

## 📋 Script de Limpeza Automática

```bash
#!/bin/bash
# cleanup-knip.sh

echo "🧹 Iniciando limpeza baseada em análise KNIP..."

# Fase 1: Dependências
echo "📦 Removendo dependências não utilizadas..."
pnpm remove \
  mjml pdf-lib jsdom \
  @auth/core bcryptjs iron-session jose \
  @sanity/block-tools @sanity/icons @sanity/schema \
  @radix-ui/react-accordion @radix-ui/react-dialog \
  @radix-ui/react-dropdown-menu @radix-ui/react-slot \
  @radix-ui/react-tabs @radix-ui/react-toast \
  @tanstack/react-virtual react-window \
  react-virtualized-auto-sizer react-window-infinite-loader \
  react-big-calendar react-day-picker \
  currency.js embla-carousel-autoplay \
  react-use usehooks-ts zustand \
  pino pino-pretty

# Fase 2: DevDependencies
echo "🛠️ Removendo devDependencies não utilizadas..."
pnpm remove -D \
  @next/bundle-analyzer \
  @tailwindcss/line-clamp \
  @types/handlebars \
  pdf-poppler \
  source-map-loader

# Fase 3: Atualizar ESLint
echo "⬆️ Atualizando ESLint..."
pnpm remove eslint eslint-config-next
pnpm add -D eslint@9 eslint-config-next@latest

echo "✅ Limpeza concluída!"
echo "📊 Execute 'pnpm build' para validar"
```

---

## ⚠️ Avisos Importantes

### Antes de Deletar

1. **Fazer backup do projeto**
   ```bash
   git commit -am "backup antes de limpeza knip"
   git tag backup-pre-knip
   ```

2. **Testar build após cada remoção**
   ```bash
   pnpm build
   ```

3. **Validar em ambiente de dev**
   ```bash
   pnpm dev
   ```

### Dependências Críticas (NÃO REMOVER)

```json
// Essenciais para o projeto
"next": "^15.4.6",
"react": "^19.1.1",
"react-dom": "^19.1.1",
"@supabase/supabase-js": "2.57.0",
"@supabase/ssr": "0.7.0",
"@sanity/client": "^7.8.2",
"framer-motion": "^12.23.12",
"embla-carousel": "8.6.0",
"embla-carousel-react": "8.6.0"
```

---

## 📈 Métricas Esperadas Pós-Limpeza

| Métrica | Antes | Depois (Estimado) | Melhoria |
|---------|-------|-------------------|----------|
| **Dependências** | 79 | 45 | -43% |
| **DevDependencies** | 22 | 15 | -32% |
| **Arquivos no projeto** | ~2000+ | ~1300 | -35% |
| **Bundle size (estimado)** | ~5MB | ~3.3MB | -34% |
| **node_modules size** | ~800MB | ~600MB | -25% |
| **Build time** | ? | Mais rápido | ? |

---

## 🎯 Próximos Comandos

```bash
# 1. Salvar análise completa
pnpm knip --reporter json > knip-analysis.json

# 2. Ver apenas arquivos críticos
pnpm knip --include files | grep "app/api"

# 3. Ver apenas dependências
pnpm knip --include dependencies

# 4. Executar com fix automático (cuidado!)
# pnpm knip --fix

# 5. Ignorar certos arquivos (criar knip.json)
cat > knip.json << 'EOF'
{
  "ignore": [
    "**/*.backup",
    "**/*.test.ts",
    ".archived/**"
  ],
  "ignoreDependencies": [
    "sharp",
    "supabase"
  ]
}
EOF
```

---

## 🚀 Recomendação Final

**Execute a limpeza em 3 etapas:**

1. **Hoje:** Remover dependências pesadas (Fase 1) - 30 min
2. **Semana:** Mover componentes não usados para .archived (Fase 2) - 2h
3. **Mês:** Consolidar e refatorar (Fase 3) - Sprint completo

**Prioridade:** Começar pela **Fase 1** para ganho imediato de performance!

---

**Gerado por knip v5.64.3**  
*12 de outubro de 2025*
