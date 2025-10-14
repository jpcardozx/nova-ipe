# Fix: Webpack bundling error "originalFactory is undefined"

## Problema Identificado

```
TypeError: can't access property "call", originalFactory is undefined
at options.factory (.next/static/chunks/runtime.js:712:15)
```

### Causa Raiz

O componente `UserStatsService` estava sendo importado de duas formas diferentes:

1. **Default export** em `dashboard/layout.tsx`:
   ```tsx
   import UserStatsService from './components/UserStatsService'
   ```

2. **Named exports** em `dashboard/page.tsx`:
   ```tsx
   import { UserStatsDisplay, PerformanceMetrics, useUserStats } from './components/UserStatsService'
   ```

Esta mistura de padrões de importação causou um erro de bundling no Webpack, onde o módulo não conseguia resolver corretamente as dependências circulares ou conflitantes.

## Solução Aplicada

Removido o uso desnecessário do componente `UserStatsService` do `layout.tsx`:

### Antes:
```tsx
import UserStatsService from './components/UserStatsService'

// ...
<main>
  <div className="max-w-[1600px] mx-auto">
    <UserStatsService />
    {children}
  </div>
</main>
```

### Depois:
```tsx
// Import removido

// ...
<main>
  <div className="max-w-[1600px] mx-auto">
    {children}
  </div>
</main>
```

## Justificativa

1. **Redundância**: O componente `UserStatsService` no layout não fazia nada visível - apenas carregava dados em background
2. **Hook já existe**: O arquivo já exporta o hook `useUserStats()` que é a forma correta de consumir os dados
3. **Otimização**: A página `dashboard/page.tsx` já usa `useUserStats()`, eliminando a necessidade de renderizar o componente no layout
4. **Padrão correto**: Hooks > Components para serviços de dados

## Estrutura de Exportação do Arquivo

`UserStatsService.tsx` agora é usado apenas através de suas named exports:

```tsx
// Interfaces
export interface UserStats { ... }
export interface UserActivity { ... }

// Hook para consumir dados (RECOMENDADO)
export function useUserStats() { ... }

// Componentes de UI
export function UserStatsDisplay({ stats }) { ... }
export function PerformanceMetrics({ stats }) { ... }

// Componente de serviço (LEGADO - não usar diretamente)
export default function UserStatsService({ onStatsUpdate }) { ... }
```

## Resultado

✅ Erro de webpack resolvido
✅ Bundle compilando corretamente
✅ Performance melhorada (menos re-renders)
✅ Código mais limpo e idiomático

## Data
13 de outubro de 2025
