# ✅ Checklist Prático - Design System Dashboard

Use este checklist ao criar ou revisar componentes.

---

## 🎯 INPUTS

```tsx
// ✅ PADRÃO CORRETO
import { getInputClasses } from '@/app/dashboard/design-tokens'

<input
  type="text"
  placeholder="Texto aqui..."
  className={getInputClasses()}
/>

// Ou manual:
<input
  className="w-full px-4 py-2
            border border-gray-200 dark:border-gray-800
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-gray-100
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
            focus:border-transparent
            transition-all duration-200
            hover:border-gray-300 dark:hover:border-gray-700"
/>
```

**Verificar:**
- [ ] `focus:outline-none` presente
- [ ] `focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400`
- [ ] `placeholder:text-gray-400 dark:placeholder:text-gray-500`
- [ ] `border-gray-200 dark:border-gray-800`
- [ ] `transition-all duration-200`

---

## 🃏 CARDS

```tsx
// ✅ CARDS PRINCIPAIS (p-6)
<div className="bg-white dark:bg-gray-900
                rounded-xl p-6
                border border-gray-200 dark:border-gray-800
                shadow-sm dark:shadow-gray-900/10">
  {/* content */}
</div>

// ✅ CARDS SECUNDÁRIOS (p-4)
<div className="bg-white dark:bg-gray-900
                rounded-xl p-4
                border border-gray-200 dark:border-gray-800
                shadow-sm dark:shadow-gray-900/10">
  {/* tasks, actions */}
</div>

// ✅ LIST ITEMS (p-3)
<div className="p-3 rounded-xl
                hover:bg-gray-50 dark:hover:bg-gray-800
                transition-all duration-200">
  {/* menu item, activity */}
</div>
```

**Verificar:**
- [ ] Padding correto (p-6, p-4, ou p-3)
- [ ] `rounded-xl` (cards)
- [ ] `border-gray-200 dark:border-gray-800`
- [ ] `shadow-sm dark:shadow-gray-900/10`
- [ ] Dark mode completo

---

## 🔘 BUTTONS

```tsx
import { getButtonClasses } from '@/app/dashboard/design-tokens'

// ✅ PRIMARY
<button className={getButtonClasses('primary')}>
  Ação Principal
</button>

// ✅ SECONDARY
<button className={getButtonClasses('secondary')}>
  Cancelar
</button>

// ✅ GHOST
<button className={getButtonClasses('ghost')}>
  Limpar
</button>
```

**Verificar:**
- [ ] Usa helper `getButtonClasses()`
- [ ] Ou tem padding `px-4 py-2`
- [ ] Rounded `rounded-lg`
- [ ] Transition `transition-all duration-200`

---

## 🏷️ BADGES

```tsx
import designTokens from '@/app/dashboard/design-tokens'

// ✅ STATUS BADGES
<span className={designTokens.components.badge.success}>
  Aprovado
</span>

<span className={designTokens.components.badge.warning}>
  Pendente
</span>

<span className={designTokens.components.badge.error}>
  Rejeitado
</span>

// ✅ COUNT BADGES
<span className="px-2 py-1 rounded-full text-xs font-bold shadow-sm
                 bg-red-500 dark:bg-red-600 text-white">
  5
</span>
```

**Verificar:**
- [ ] Usa tokens para status
- [ ] Dark mode presente
- [ ] `rounded-full` para count
- [ ] `shadow-sm` opcional

---

## 🔗 LINKS

```tsx
// ✅ PADRÃO
<a className="text-blue-600 dark:text-blue-400
              hover:text-blue-700 dark:hover:text-blue-300
              transition-colors duration-200">
  Clique aqui
</a>

// ✅ COM FRAMER MOTION
import { motion } from 'framer-motion'

<motion.a
  href="/link"
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className="text-blue-600 dark:text-blue-400
            hover:text-blue-700 dark:hover:text-blue-300
            transition-colors duration-200">
  Ver mais
</motion.a>
```

**Verificar:**
- [ ] `text-blue-600 dark:text-blue-400`
- [ ] `hover:text-blue-700 dark:hover:text-blue-300`
- [ ] `transition-colors duration-200`

---

## 📝 TYPOGRAPHY

```tsx
import designTokens from '@/app/dashboard/design-tokens'

// ✅ HEADINGS
<h1 className={designTokens.typography.h1}>         // text-2xl font-bold
<h2 className={designTokens.typography.h2}>         // text-xl font-semibold
<h3 className={designTokens.typography.h3}>         // text-lg font-medium

// ✅ BODY
<p className={designTokens.typography.body.regular}> // text-sm
<small className={designTokens.typography.body.small}> // text-xs

// ✅ COM CORES
<p className={combineTokens(
  designTokens.typography.body.regular,
  designTokens.colors.text.primary
)}>
  Texto principal
</p>

<p className={combineTokens(
  designTokens.typography.body.regular,
  designTokens.colors.text.secondary
)}>
  Texto secundário
</p>
```

**Verificar:**
- [ ] Hierarquia clara (h1 → h2 → h3)
- [ ] Text colors com dark mode
- [ ] Body text `text-sm` padrão

---

## 🎨 ICONS

```tsx
import designTokens from '@/app/dashboard/design-tokens'
import { Search, Home, User } from 'lucide-react'

// ✅ CONTEXTOS
<Search className={designTokens.icons.mini} />      // badges
<Search className={designTokens.icons.small} />     // inputs, small buttons
<Search className={designTokens.icons.regular} />   // buttons, menu
<Search className={designTokens.icons.large} />     // headers
<Search className={designTokens.icons.empty} />     // empty states
```

**Verificar:**
- [ ] Tamanho apropriado ao contexto
- [ ] Cores consistentes com parent

---

## 🚫 EMPTY STATES

```tsx
import EmptyState from '@/app/dashboard/components/EmptyState'
import { CheckCircle2, Activity, Users } from 'lucide-react'

// ✅ SIMPLES
<EmptyState
  icon={CheckCircle2}
  title="Nenhuma tarefa"
  description="Você está em dia!"
/>

// ✅ COM AÇÃO
<EmptyState
  icon={Users}
  title="Nenhum cliente"
  description="Adicione seu primeiro cliente"
  action={{
    label: "Novo cliente",
    onClick: () => router.push('/dashboard/clientes/novo')
  }}
/>
```

**Verificar:**
- [ ] Usa componente `EmptyState`
- [ ] Icon apropriado
- [ ] Mensagem clara
- [ ] Ação opcional quando aplicável

---

## 🔄 TRANSITIONS

```tsx
import designTokens from '@/app/dashboard/design-tokens'

// ✅ PADRÃO (200ms)
<div className={designTokens.transition.all}>
  Transition completa
</div>

// ✅ RÁPIDA (150ms) - hover, tap
<div className={designTokens.transition.fast}>
  Micro-interaction
</div>

// ✅ APENAS CORES
<div className={designTokens.transition.colors}>
  Hover suave
</div>

// ✅ LENTA (300ms) - animações complexas
<div className={designTokens.transition.slow}>
  Transform, layout
</div>
```

**Verificar:**
- [ ] Sempre tem uma transition
- [ ] Duration apropriada ao tipo
- [ ] `duration-200` é o padrão

---

## 📦 SPACING

```tsx
import designTokens from '@/app/dashboard/design-tokens'

// ✅ GAPS
<div className={designTokens.spacing.gap.compact}>   // gap-2
<div className={designTokens.spacing.gap.regular}>   // gap-4
<div className={designTokens.spacing.gap.spacious}>  // gap-6

// ✅ CARD PADDING
<div className={designTokens.spacing.card.primary}>     // p-6
<div className={designTokens.spacing.card.secondary}>   // p-4
<div className={designTokens.spacing.card.compact}>     // p-3
```

**Verificar:**
- [ ] Gaps consistentes
- [ ] Padding apropriado ao tipo de card
- [ ] Não mistura tamanhos sem motivo

---

## ✅ CHECKLIST FINAL

Antes de commitar, verifique:

### Acessibilidade
- [ ] Todos os focus states visíveis
- [ ] Contraste adequado (WCAG AAA)
- [ ] Textos legíveis em ambos os temas

### Dark Mode
- [ ] Todas as cores têm variante `dark:`
- [ ] Testado em dark mode
- [ ] Borders, backgrounds, text colors OK

### Consistência
- [ ] Usa design tokens
- [ ] Spacing padronizado
- [ ] Transitions uniformes
- [ ] Typography hierárquica

### Performance
- [ ] Framer Motion usado com moderação
- [ ] Transitions não pesadas (< 300ms)
- [ ] Sem re-renders desnecessários

---

## 🚀 QUICK COMMANDS

```bash
# Importar tokens
import designTokens from '@/app/dashboard/design-tokens'
import { getInputClasses, getButtonClasses, getCardClasses, combineTokens } from '@/app/dashboard/design-tokens'

# Importar EmptyState
import EmptyState from '@/app/dashboard/components/EmptyState'

# Importar Framer Motion
import { motion } from 'framer-motion'
```

---

## 💡 TIPS RÁPIDOS

1. **Sempre use tokens** → Impossível criar inconsistências
2. **Test dark mode** → Ctrl+Shift+D no Chrome
3. **Check focus** → Tab pelo componente
4. **Use EmptyState** → Não crie custom
5. **Combine tokens** → `combineTokens()` é seu amigo

---

**Última atualização:** 09/10/2025  
**Consulte:** `docs/DESIGN_TOKENS_USAGE_GUIDE.md` para mais exemplos

