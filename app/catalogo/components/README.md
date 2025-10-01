# 📁 Estrutura Modular do Catálogo

## 🎯 Objetivo

Reorganização completa dos componentes do catálogo para melhorar:
- ✅ **Modularização** - Componentes independentes e reutilizáveis
- ✅ **Responsividade** - Mobile-first design
- ✅ **Performance** - Otimizações com useMemo e lazy loading
- ✅ **Manutenibilidade** - Código limpo e bem organizado
- ✅ **UX** - Experiência de usuário aprimorada

## 📂 Nova Estrutura

```
/app/catalogo/components/
├── ModularCatalog.tsx          # 🎭 Wrapper principal (integração completa)
├── CatalogWrapper.tsx          # 🔌 Adapter para o sistema antigo
├── filters/
│   └── HorizontalFilters.tsx   # 🎚️ Filtros horizontais (acima do grid)
└── grid/
    ├── PropertyGrid.tsx        # 📊 Grid principal (container)
    ├── PropertyCard.tsx        # 🃏 Card individual (grid view)
    ├── PropertyListItem.tsx    # 📋 Item de lista (list view)
    └── ViewControls.tsx        # 🎛️ Controles de visualização
```

## 🚀 Componentes Principais

### 1. **HorizontalFilters** (`filters/HorizontalFilters.tsx`)
Filtros que ocupam espaço horizontal, posicionados **acima do grid**.

**Features:**
- ✅ Scroll horizontal em mobile
- ✅ Chips interativos para seleção rápida
- ✅ Filtros avançados expansíveis
- ✅ Contador de resultados em tempo real
- ✅ Animações suaves com Framer Motion

**Filtros Principais:**
- Tipo de Imóvel (Casa, Apartamento, Terreno, Comercial)
- Faixa de Preço (R$ 300k, R$ 500k, R$ 1M+)
- Dormitórios (1+, 2+, 3+, 4+, 5+)

**Filtros Avançados:**
- Banheiros
- Área Mínima (m²)
- Localização/Bairro

### 2. **PropertyGrid** (`grid/PropertyGrid.tsx`)
Container inteligente que gerencia a exibição dos imóveis.

**Features:**
- ✅ 4 modos de visualização (compact, comfortable, spacious, list)
- ✅ Ordenação inteligente (preço, área, relevância, data)
- ✅ Grid responsivo com breakpoints otimizados
- ✅ Animações staggered com Framer Motion
- ✅ Estado vazio com feedback visual

**View Modes:**
```typescript
- compact: 5 colunas (XL), ideal para muitos imóveis
- comfortable: 4 colunas (XL), balanço perfeito
- spacious: 3 colunas (LG), máximo detalhe
- list: Layout horizontal, máxima informação
```

### 3. **PropertyCard** (`grid/PropertyCard.tsx`)
Card individual para visualização em grid.

**Features:**
- ✅ Imagem com hover overlay e ações
- ✅ Badges (destaque, tipo)
- ✅ Botões de contato (WhatsApp, Telefone)
- ✅ Favoritos com animação
- ✅ Compartilhamento nativo
- ✅ Lazy loading de imagens
- ✅ Altura adaptativa por viewMode

### 4. **PropertyListItem** (`grid/PropertyListItem.tsx`)
Item horizontal para visualização em lista.

**Features:**
- ✅ Layout horizontal otimizado
- ✅ Máximo de informação visível
- ✅ Descrição expandida
- ✅ Preço por m² (quando disponível)
- ✅ Botões de ação em destaque
- ✅ Responsivo (vertical em mobile)

### 5. **ViewControls** (`grid/ViewControls.tsx`)
Controles para alternar visualização e ordenação.

**Features:**
- ✅ Toggle de view modes (ícones visuais)
- ✅ Dropdown de ordenação
- ✅ Contador de resultados
- ✅ Design compacto e intuitivo
- ✅ Mobile-friendly

### 6. **ModularCatalog** (`ModularCatalog.tsx`)
Wrapper principal que integra todos os componentes.

**Features:**
- ✅ Gerenciamento de estado centralizado
- ✅ Integração com hooks customizados (useFavorites, useUserAnalytics)
- ✅ Lógica de filtros avançada
- ✅ Handlers de eventos (click, favorite, contact)
- ✅ Analytics integrado
- ✅ Footer mobile com contador de resultados

## 🎨 Design System

### Cores
- **Primária**: Amber/Orange (500, 600)
- **Sucesso**: Green (500, 600) - WhatsApp
- **Info**: Blue (500, 600) - Telefone
- **Destaque**: Red (500) - Favoritos
- **Neutras**: Gray (50-900)

### Espaçamentos
- **Mobile**: px-4, py-4, gap-3
- **Desktop**: px-6, py-6, gap-6
- **XL**: px-8, py-8, gap-8

### Bordas
- **Cards**: rounded-2xl
- **Botões**: rounded-xl
- **Badges**: rounded-lg
- **Pills**: rounded-full

## 📱 Responsividade

### Breakpoints
```typescript
sm: 640px   // Tablet small
md: 768px   // Tablet
lg: 1024px  // Laptop
xl: 1280px  // Desktop
2xl: 1536px // Large Desktop
```

### Grid Breakpoints
```typescript
compact:
  - 2 cols (mobile)
  - 3 cols (md)
  - 4 cols (lg)
  - 5 cols (xl)

comfortable:
  - 1 col (mobile)
  - 2 cols (md)
  - 3 cols (lg)
  - 4 cols (xl)

spacious:
  - 1 col (mobile)
  - 2 cols (md)
  - 3 cols (lg)
```

## 🔧 Libs e Dependências Utilizadas

### Core
- ✅ **React** - Hooks (useState, useMemo, useCallback, useEffect)
- ✅ **Next.js 15** - App Router, Client Components
- ✅ **TypeScript** - Type safety

### UI/UX
- ✅ **Framer Motion** - Animações e transições
- ✅ **Lucide React** - Ícones modernos e leves
- ✅ **Tailwind CSS** - Utility-first styling
- ✅ **cn** (clsx + tailwind-merge) - Conditional classes

### Hooks Customizados
- ✅ **useFavorites** - Gerenciamento de favoritos (localStorage)
- ✅ **useUserAnalytics** - Tracking de eventos

## 🎯 Otimizações de Performance

### 1. **Memoização**
```typescript
useMemo() - filteredProperties, sortedProperties
useCallback() - event handlers
```

### 2. **Lazy Loading**
```typescript
- Imagens com loading="lazy"
- Intersection Observer (futuro)
```

### 3. **Animações Otimizadas**
```typescript
- Stagger children (0.05s delay)
- Transform/Opacity only (GPU accelerated)
- Will-change hints
```

### 4. **Bundle Size**
```typescript
- Tree-shaking automático
- Code splitting por rota
- Dynamic imports (futuro)
```

## 🚀 Como Usar

### Importação Básica
```typescript
import ModularCatalog from '@/app/catalogo/components/ModularCatalog';

<ModularCatalog properties={properties} />
```

### Com Analytics
```typescript
import ModularCatalog from '@/app/catalogo/components/ModularCatalog';

<ModularCatalog 
    properties={properties}
    onSearch={(query) => console.log('Search:', query)}
/>
```

## 🎯 Próximos Passos

### Features Planejadas
- [ ] Filtro por mapa (integração com Google Maps)
- [ ] Comparador de imóveis (até 3)
- [ ] Tour virtual 360°
- [ ] Salvar busca com notificações
- [ ] Agendamento de visita inline
- [ ] Chat ao vivo com corretores
- [ ] Calculadora de financiamento
- [ ] Histórico de visualizações
- [ ] Recomendações personalizadas (AI)

### Melhorias Técnicas
- [ ] Virtualização (react-window)
- [ ] Infinite scroll
- [ ] SSR otimizado (ISR)
- [ ] Service Worker (PWA)
- [ ] Prefetch de imagens
- [ ] Cache inteligente
- [ ] Tests (Jest + Testing Library)
- [ ] Storybook

## 📊 Métricas de Sucesso

### Performance
- ✅ LCP < 2.5s
- ✅ FID < 100ms
- ✅ CLS < 0.1
- ✅ Lighthouse Score > 90

### UX
- ✅ Mobile-first design
- ✅ Touch-friendly (min 44x44px)
- ✅ Acessibilidade (WCAG 2.1 AA)
- ✅ Loading states
- ✅ Error states

## 🤝 Contribuindo

### Code Style
- Use TypeScript strict mode
- Follow ESLint rules
- Use Prettier for formatting
- Write self-documenting code
- Add JSDoc comments

### Commits
```
feat: Add new filter option
fix: Fix mobile layout issue
refactor: Improve property card performance
docs: Update README with new structure
style: Apply consistent spacing
```

## 📝 Notas

- Todos os componentes são **client components** ('use client')
- Animações podem ser desabilitadas via `prefers-reduced-motion`
- Imagens sempre com `alt` para acessibilidade
- Loading states em todas as operações assíncronas
- Error boundaries para fallback gracioso

---

**Última atualização**: 30/09/2025
**Versão**: 2.0.0
**Autor**: JP Cardoso (@jpcardozx)
