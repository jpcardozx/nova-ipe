# 🏗️ Arquitetura Visual do Sistema Modular

## 📊 Hierarquia de Componentes

```
┌─────────────────────────────────────────────────────────────┐
│                    CatalogWrapper.tsx                        │
│  (Adapter - mantém compatibilidade com sistema antigo)      │
│                                                              │
│  • Gerencia busca do Hero                                   │
│  • Filtra propriedades                                      │
│  • Analytics de sessão                                      │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       ├─► CatalogHeroOptimized
                       │    (Hero section com busca)
                       │
                       └─► ModularCatalog.tsx
                            │
    ┌───────────────────────┴───────────────────────┐
    │        Sistema Modular Principal              │
    │                                                │
    │  ┌──────────────────────────────────────┐    │
    │  │   HorizontalFilters.tsx               │    │
    │  │   (Filtros acima do grid)            │    │
    │  │                                      │    │
    │  │  • Tipo de Imóvel                   │    │
    │  │  • Faixa de Preço                   │    │
    │  │  • Dormitórios                      │    │
    │  │  • Filtros Avançados (expansível)   │    │
    │  └──────────────────────────────────────┘    │
    │                                                │
    │  ┌──────────────────────────────────────┐    │
    │  │   ViewControls.tsx                   │    │
    │  │   (Controles de visualização)        │    │
    │  │                                      │    │
    │  │  • View Mode Toggle                 │    │
    │  │  • Sort Dropdown                    │    │
    │  │  • Results Counter                  │    │
    │  └──────────────────────────────────────┘    │
    │                                                │
    │  ┌──────────────────────────────────────┐    │
    │  │   PropertyGrid.tsx                   │    │
    │  │   (Container inteligente)            │    │
    │  │                                      │    │
    │  │  ┌────────────────────────────────┐ │    │
    │  │  │  PropertyCard.tsx               │ │    │
    │  │  │  (Grid View)                    │ │    │
    │  │  │                                 │ │    │
    │  │  │  • Image + Hover Overlay       │ │    │
    │  │  │  • Badges (Destaque, Tipo)     │ │    │
    │  │  │  • Características             │ │    │
    │  │  │  • Botões de Ação              │ │    │
    │  │  │  • Favoritos                   │ │    │
    │  │  └────────────────────────────────┘ │    │
    │  │                                      │    │
    │  │  ┌────────────────────────────────┐ │    │
    │  │  │  PropertyListItem.tsx           │ │    │
    │  │  │  (List View)                    │ │    │
    │  │  │                                 │ │    │
    │  │  │  • Layout Horizontal           │ │    │
    │  │  │  • Máxima Informação           │ │    │
    │  │  │  • Descrição Expandida         │ │    │
    │  │  │  • Preço por m²                │ │    │
    │  │  └────────────────────────────────┘ │    │
    │  └──────────────────────────────────────┘    │
    │                                                │
    └────────────────────────────────────────────────┘
```

## 🔄 Fluxo de Dados

```
┌──────────────┐
│   User       │
│   Action     │
└──────┬───────┘
       │
       ├─► Search (Hero)
       │   └─► CatalogWrapper.handleSearch()
       │       └─► Filter properties
       │           └─► Pass to ModularCatalog
       │
       ├─► Filter Change (HorizontalFilters)
       │   └─► ModularCatalog.handleFilterChange()
       │       └─► Apply filters
       │           └─► Update filteredProperties
       │               └─► Re-render PropertyGrid
       │
       ├─► View Mode Change (ViewControls)
       │   └─► ModularCatalog.setViewMode()
       │       └─► PropertyGrid re-renders
       │           └─► Switch between Card/ListItem
       │
       ├─► Sort Change (ViewControls)
       │   └─► ModularCatalog.setSortMode()
       │       └─► PropertyGrid.sortedProperties
       │           └─► Re-render sorted
       │
       ├─► Property Click (Card/ListItem)
       │   └─► ModularCatalog.handlePropertyClick()
       │       └─► Navigate to /imovel/[slug]
       │
       ├─► Favorite Toggle (Card/ListItem)
       │   └─► ModularCatalog.handleFavoriteToggle()
       │       └─► useFavorites hook
       │           └─► Update localStorage
       │               └─► Analytics.trackFavorite()
       │
       └─► Contact Click (Card/ListItem)
           └─► ModularCatalog.handleContactClick()
               └─► Analytics.trackContact()
                   └─► Open WhatsApp/Phone
```

## 🎨 Estado Global

```
ModularCatalog State:
┌─────────────────────────────────────┐
│ viewMode: ViewMode                  │ ← ViewControls
│ sortMode: SortMode                  │ ← ViewControls
│ filters: FilterState                │ ← HorizontalFilters
├─────────────────────────────────────┤
│ Computed:                           │
│ • filteredProperties                │ ← useMemo
│ • sortedProperties (in Grid)        │ ← useMemo
├─────────────────────────────────────┤
│ External:                           │
│ • favorites (useFavorites hook)     │
│ • analytics (useUserAnalytics hook) │
└─────────────────────────────────────┘
```

## 📦 Dependências Entre Componentes

```
HorizontalFilters
├─ framer-motion (animations)
├─ lucide-react (icons)
└─ @/lib/utils (cn function)

PropertyGrid
├─ framer-motion (animations)
├─ lucide-react (icons)
├─ @/lib/utils (cn function)
├─ PropertyCard
└─ PropertyListItem

PropertyCard
├─ framer-motion (animations)
├─ lucide-react (icons)
└─ @/lib/utils (cn function)

PropertyListItem
├─ framer-motion (animations)
├─ lucide-react (icons)
└─ @/lib/utils (cn function)

ViewControls
├─ lucide-react (icons)
└─ @/lib/utils (cn function)

ModularCatalog
├─ HorizontalFilters
├─ PropertyGrid
├─ ViewControls
├─ useFavorites (hook)
└─ useUserAnalytics (hook)

CatalogWrapper
├─ CatalogHeroOptimized
├─ ModularCatalog
└─ useUserAnalytics (hook)
```

## 🔌 Interfaces e Types

```typescript
// FilterState (HorizontalFilters)
interface FilterState {
    tipo?: string;
    priceMin?: number;
    priceMax?: number;
    bedrooms?: string;
    bathrooms?: string;
    areaMin?: number;
    location?: string;
}

// ViewMode (PropertyGrid)
type ViewMode = 'compact' | 'comfortable' | 'spacious' | 'list';

// SortMode (PropertyGrid)
type SortMode = 'price_asc' | 'price_desc' | 'newest' | 'area_desc' | 'relevance';

// Property (all components)
interface Property {
    id: string;
    titulo: string;
    tipo?: string;
    preco?: number;
    area?: number;
    quartos?: number;
    banheiros?: number;
    bairro?: string;
    cidade?: string;
    endereco?: string;
    imagemPrincipal?: string;
    galeria?: string[];
    destaque?: boolean;
    slug?: string;
    descricao?: string;
    createdAt?: string;
}
```

## 🎯 Event Handlers

```typescript
// ModularCatalog handlers
interface ModularCatalogHandlers {
    handleFilterChange: (filters: FilterState) => void;
    handlePropertyClick: (property: Property) => void;
    handleFavoriteToggle: (propertyId: string) => void;
    handleContactClick: (propertyId: string, method: string) => void;
}

// Propagation chain
User Action
  ↓
Component Event (onClick, onChange)
  ↓
Handler Function (handle*)
  ↓
State Update / Side Effect
  ↓
Re-render / Navigation / External API
```

## 📊 Performance Optimizations

```
useMemo Locations:
├─ filteredProperties (ModularCatalog)
│   └─ Filters: tipo, preço, dormitórios, etc.
│
└─ sortedProperties (PropertyGrid)
    └─ Sorts: price, area, date, relevance

useCallback Locations:
├─ handleFilterChange (ModularCatalog)
├─ handlePropertyClick (ModularCatalog)
├─ handleFavoriteToggle (ModularCatalog)
└─ handleContactClick (ModularCatalog)

Lazy Loading:
├─ Images (loading="lazy")
├─ Intersection Observer (future)
└─ Dynamic imports (future)

Animation Performance:
├─ Transform/Opacity only
├─ GPU acceleration (will-change)
└─ Stagger delay optimization
```

## 🔍 Debug Flow

```
1. Console Logs:
   ├─ "✅ Carregadas X propriedades"
   ├─ "Active Filters:", activeFilters
   ├─ "Filtered Properties:", filteredProperties.length
   └─ "Analytics:", trackAction(), trackFavorite(), etc.

2. React DevTools:
   ├─ Component Props
   ├─ Component State
   ├─ Hooks State
   └─ Performance Profiler

3. Network Tab:
   ├─ Image Loading
   ├─ API Calls
   └─ Bundle Size

4. Lighthouse:
   ├─ Performance Score
   ├─ Accessibility Score
   └─ Core Web Vitals
```

## 🗺️ Navigation Flow

```
User Journey:
┌────────────────┐
│  /catalogo     │ Landing
└────────┬───────┘
         │
         ├─► Search (Hero)
         │   └─► Filter results
         │
         ├─► Apply Filters
         │   └─► Refine results
         │
         ├─► Change View/Sort
         │   └─► Adjust display
         │
         ├─► Click Property
         │   └─► Navigate to /imovel/[slug]
         │
         ├─► Add to Favorites
         │   └─► Store in localStorage
         │
         └─► Contact (WhatsApp/Phone)
             └─► External action
```

## 💾 Data Persistence

```
LocalStorage:
┌─────────────────────────────────┐
│ property-favorites: string[]    │ ← useFavorites
│ user-preferences: object        │ ← Future
│ recent-searches: string[]       │ ← Future
└─────────────────────────────────┘

Session Analytics:
┌─────────────────────────────────┐
│ page_views                      │
│ property_views                  │
│ favorites_added                 │
│ contacts_initiated              │
│ search_queries                  │
└─────────────────────────────────┘
```

---

**Versão**: 2.0.0  
**Data**: 30/09/2025  
**Autor**: JP Cardoso
