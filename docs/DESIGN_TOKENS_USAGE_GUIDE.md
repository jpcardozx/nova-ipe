# 📘 Guia de Uso - Design Tokens & Componentes

## 🎨 Design Tokens

### Como Importar

```typescript
import designTokens, { combineTokens, getInputClasses, getButtonClasses, getCardClasses } from '@/app/dashboard/design-tokens'
```

---

## 📦 Exemplos de Uso

### 1. Input Fields

#### ❌ Antes (Inconsistente)
```tsx
<input
  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
/>
```

#### ✅ Depois (Padronizado)
```tsx
import { getInputClasses } from '@/app/dashboard/design-tokens'

<input
  className={getInputClasses()}
/>

// Com erro
<input
  className={getInputClasses(true)}
/>

// Customizado manualmente
<input
  className={combineTokens(
    designTokens.components.input.base,
    designTokens.components.input.focus,
    designTokens.colors.border.primary,
    designTokens.colors.text.primary
  )}
/>
```

---

### 2. Buttons

#### ❌ Antes
```tsx
<button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
  Clique aqui
</button>
```

#### ✅ Depois
```tsx
import { getButtonClasses } from '@/app/dashboard/design-tokens'

// Primary
<button className={getButtonClasses('primary')}>
  Ação Principal
</button>

// Secondary
<button className={getButtonClasses('secondary')}>
  Ação Secundária
</button>

// Ghost
<button className={getButtonClasses('ghost')}>
  Cancelar
</button>
```

---

### 3. Cards

#### ❌ Antes
```tsx
<div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border">
  {/* content */}
</div>
```

#### ✅ Depois
```tsx
import { getCardClasses } from '@/app/dashboard/design-tokens'

// Card estático
<div className={getCardClasses()}>
  {/* content */}
</div>

// Card interativo (com hover)
<div className={getCardClasses(true)}>
  {/* content */}
</div>
```

---

### 4. Typography

```tsx
import designTokens from '@/app/dashboard/design-tokens'

// Headings
<h1 className={designTokens.typography.h1}>Título Principal</h1>
<h2 className={designTokens.typography.h2}>Subtítulo</h2>
<h3 className={designTokens.typography.h3}>Seção</h3>

// Body text
<p className={designTokens.typography.body.regular}>
  Texto regular
</p>

// Small text
<span className={designTokens.typography.body.small}>
  Texto pequeno
</span>
```

---

### 5. Icons

```tsx
import { Search } from 'lucide-react'
import designTokens from '@/app/dashboard/design-tokens'

// Mini icons (badges, inline)
<Search className={designTokens.icons.mini} />

// Small icons (buttons, inputs)
<Search className={designTokens.icons.small} />

// Regular icons (padrão)
<Search className={designTokens.icons.regular} />

// Large icons (headers)
<Search className={designTokens.icons.large} />

// Empty state icons
<Search className={designTokens.icons.empty} />
```

---

### 6. Spacing

```tsx
import designTokens from '@/app/dashboard/design-tokens'

// Card padding
<div className={designTokens.spacing.card.primary}>
  Padding grande (p-6)
</div>

<div className={designTokens.spacing.card.secondary}>
  Padding médio (p-4)
</div>

<div className={designTokens.spacing.card.compact}>
  Padding compacto (p-3)
</div>

// Gap spacing
<div className={designTokens.spacing.gap.regular}>
  Gap padrão (gap-4)
</div>
```

---

### 7. Colors & Borders

```tsx
import designTokens from '@/app/dashboard/design-tokens'

// Text colors
<p className={designTokens.colors.text.primary}>
  Texto principal
</p>

<p className={designTokens.colors.text.secondary}>
  Texto secundário
</p>

// Borders
<div className={combineTokens(
  designTokens.colors.border.primary,
  designTokens.colors.border.hover
)}>
  Com border e hover
</div>

// Background
<div className={designTokens.colors.background.primary}>
  Background principal
</div>
```

---

### 8. Badges

```tsx
import designTokens from '@/app/dashboard/design-tokens'

// Success
<span className={designTokens.components.badge.success}>
  Sucesso
</span>

// Warning
<span className={designTokens.components.badge.warning}>
  Atenção
</span>

// Error
<span className={designTokens.components.badge.error}>
  Erro
</span>

// Info
<span className={designTokens.components.badge.info}>
  Informação
</span>

// Neutral
<span className={designTokens.components.badge.neutral}>
  Neutro
</span>
```

---

### 9. EmptyState Component

```tsx
import EmptyState from '@/app/dashboard/components/EmptyState'
import { CheckCircle2 } from 'lucide-react'

// Simples
<EmptyState
  icon={CheckCircle2}
  title="Nenhuma tarefa pendente"
  description="Você está em dia com todas as suas tarefas"
/>

// Com ação
<EmptyState
  icon={CheckCircle2}
  title="Nenhum item encontrado"
  description="Tente ajustar os filtros"
  action={{
    label: "Limpar filtros",
    onClick: () => clearFilters()
  }}
/>
```

---

### 10. Transitions

```tsx
import designTokens from '@/app/dashboard/design-tokens'

// Transition completa
<div className={designTokens.transition.all}>
  Transição em todas as propriedades
</div>

// Apenas cores
<button className={designTokens.transition.colors}>
  Hover suave
</button>

// Transform
<div className={designTokens.transition.transform}>
  Scale ou translate
</div>
```

---

## 🎯 Padrões de Uso Comum

### Search Input Padrão
```tsx
import designTokens, { combineTokens } from '@/app/dashboard/design-tokens'
import { Search } from 'lucide-react'

<div className="relative">
  <Search className={combineTokens(
    'absolute left-3 top-1/2 transform -translate-y-1/2',
    designTokens.icons.small,
    'text-gray-400 dark:text-gray-500'
  )} />
  <input
    type="text"
    placeholder="Buscar..."
    className={combineTokens(
      'w-full pl-10 pr-4 py-2',
      designTokens.colors.border.primary,
      designTokens.colors.background.primary,
      designTokens.colors.text.primary,
      designTokens.colors.text.placeholder,
      designTokens.radius.input,
      designTokens.colors.focus.full,
      designTokens.transition.all,
      designTokens.colors.border.hover
    )}
  />
</div>
```

### Card Interativo Completo
```tsx
import { getCardClasses } from '@/app/dashboard/design-tokens'
import designTokens from '@/app/dashboard/design-tokens'
import { motion } from 'framer-motion'

<motion.div
  whileHover={{ scale: 1.02, y: -2 }}
  whileTap={{ scale: 0.98 }}
  className={getCardClasses(true)}
>
  <h3 className={designTokens.typography.h3}>
    Título do Card
  </h3>
  <p className={combineTokens(
    designTokens.typography.body.regular,
    designTokens.colors.text.secondary
  )}>
    Descrição do conteúdo
  </p>
</motion.div>
```

### Dropdown Menu Padrão
```tsx
import designTokens from '@/app/dashboard/design-tokens'

<div className={designTokens.components.dropdown.container}>
  <button className={designTokens.components.dropdown.item}>
    Item 1
  </button>
  <div className={designTokens.components.dropdown.divider} />
  <button className={designTokens.components.dropdown.item}>
    Item 2
  </button>
</div>
```

---

## 📋 Checklist de Revisão

Ao criar um novo componente, verifique:

- [ ] Focus states padronizados (`designTokens.colors.focus.full`)
- [ ] Borders consistentes (`designTokens.colors.border.primary`)
- [ ] Placeholders uniformes (`designTokens.colors.text.placeholder`)
- [ ] Spacing adequado (card padding, gaps)
- [ ] Transitions suaves (`designTokens.transition.all`)
- [ ] Dark mode implementado
- [ ] Hover states consistentes
- [ ] Icons com tamanhos corretos
- [ ] Typography hierárquica
- [ ] Shadow system apropriado

---

## 🚀 Migração de Componentes Existentes

### Passo 1: Identificar Padrões
Procure por:
- `focus:ring-*` inconsistentes
- `border-*` variados
- `p-*` sem padrão
- `text-*` sem dark mode
- `transition-*` diferentes

### Passo 2: Substituir por Tokens
Use os helpers:
- `getInputClasses()`
- `getButtonClasses()`
- `getCardClasses()`
- `combineTokens()`

### Passo 3: Testar
- [ ] Light mode OK
- [ ] Dark mode OK
- [ ] Focus visible
- [ ] Hover states funcionando
- [ ] Responsive OK

---

## 💡 Tips & Best Practices

1. **Sempre use os tokens** ao invés de classes hardcoded
2. **Combine tokens** com `combineTokens()` para maior flexibilidade
3. **Teste dark mode** em cada alteração
4. **Mantenha consistência** em componentes similares
5. **Use EmptyState** para estados vazios
6. **Prefira utility helpers** quando disponíveis

---

## 🔄 Atualizações Futuras

Este guia será atualizado conforme novos tokens e componentes forem adicionados.

**Última atualização:** 09/10/2025

