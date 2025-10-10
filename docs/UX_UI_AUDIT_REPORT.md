# 🎨 Relatório de Auditoria UX/UI - Dashboard Nova Ipê

**Data:** 09 de outubro de 2025  
**Escopo:** Dashboard e componentes relacionados  
**Foco:** Inconsistências de design, fragilidades de UX e polimento visual

---

## 📊 Sumário Executivo

### Issues Identificadas: 18
- 🔴 **Críticas:** 4
- 🟠 **Altas:** 6
- 🟡 **Médias:** 8

---

## 🔴 Issues Críticas

### 1. Inconsistência nos Focus States de Inputs
**Severidade:** 🔴 Crítica  
**Localização:** Múltiplos componentes

**Problema:**
Campos de busca têm estilos de focus inconsistentes:
- Header: `focus:ring-2 focus:ring-blue-500`
- Search inputs: Variam entre `focus:ring-blue-500`, `focus:ring-amber-500`, `focus:ring-2`
- Alguns sem focus ring definido

**Impacto:**
- Acessibilidade comprometida
- Experiência visual inconsistente
- Usuários com navegação por teclado afetados

**Solução:**
Padronizar todos os focus states para:
```css
focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent
```

---

### 2. Border Colors Inconsistentes em Dark Mode
**Severidade:** 🔴 Crítica  
**Localização:** Cards, containers, dropdowns

**Problema:**
Diferentes tonalidades de borders em dark mode:
- `dark:border-gray-800` (maioria)
- `dark:border-gray-700` (alguns casos)
- `dark:border-gray-800/50` (raros)
- `dark:border-opacity-30` (inconsistente)

**Impacto:**
- Visual desorganizado em dark mode
- Falta de hierarquia clara
- Profissionalismo afetado

**Solução:**
Padronização:
- Borders principais: `dark:border-gray-800`
- Borders secundários: `dark:border-gray-700`
- Borders sutis: `dark:border-gray-800/50`

---

### 3. Spacing Inconsistente em Cards
**Severidade:** 🔴 Crítica  
**Localização:** Dashboard page, componentes de cards

**Problema:**
Padding interno varia entre:
- `p-3` (alguns cards)
- `p-4` (hover states)
- `p-6` (cards principais)
- Sem padrão definido para diferentes tipos

**Impacto:**
- Alinhamento visual quebrado
- Densidade de informação irregular
- Sensação de "amadorismo"

**Solução:**
Hierarquia de spacing:
- Cards principais: `p-6`
- Cards secundários: `p-4`
- List items: `p-3`
- Compact items: `p-2`

---

### 4. Placeholder Text Colors Inconsistentes
**Severidade:** 🔴 Crítica  
**Localização:** Todos os inputs de busca

**Problema:**
Placeholders com cores variadas:
- `placeholder:text-gray-400`
- `placeholder:text-slate-400`
- `placeholder:text-gray-500`
- `placeholder-slate-500`
- `placeholder-gray-500`

**Impacto:**
- Leitura inconsistente
- Alguns muito claros, outros muito escuros
- Problemas de acessibilidade (contraste)

**Solução:**
Padronizar:
```css
placeholder:text-gray-400 dark:placeholder:text-gray-500
```

---

## 🟠 Issues de Alta Prioridade

### 5. Hover States com Cores Conflitantes
**Severidade:** 🟠 Alta  
**Localização:** Links, botões, menu items

**Problema:**
Algumas transições de hover usam cores que conflitam com o design system:
- Quick actions: `group-hover:text-blue-600 dark:group-hover:text-blue-400`
- Mas links principais: `hover:text-blue-800 dark:hover:text-blue-300`
- Inconsistência nas tonalidades

**Solução:**
Definir palette clara:
- Primary hover: `hover:text-blue-600 dark:hover:text-blue-400`
- Links: `hover:text-blue-700 dark:hover:text-blue-300`

---

### 6. Shadow Styles Não Padronizados
**Severidade:** 🟠 Alta  
**Localização:** Cards, dropdowns, modals

**Problema:**
Múltiplos estilos de sombra:
- `shadow-sm`
- `shadow-md`
- `shadow-lg`
- `shadow-2xl`
- `dark:shadow-gray-900/50`
- `dark:shadow-gray-950/50`

**Solução:**
Hierarquia de elevação:
```css
/* Level 1 - Cards */
shadow-sm dark:shadow-gray-900/10

/* Level 2 - Elevated cards */
shadow-md dark:shadow-gray-900/30

/* Level 3 - Dropdowns */
shadow-lg dark:shadow-gray-900/50

/* Level 4 - Modals */
shadow-2xl dark:shadow-gray-950/80
```

---

### 7. Badge Colors Sem Dark Mode
**Severidade:** 🟠 Alta  
**Localização:** Sidebar, notificações

**Problema:**
Alguns badges não têm variantes dark:
```tsx
<span className="bg-blue-500 text-white"> // OK
<span className="text-red-600 bg-red-50 border-red-200"> // SEM dark mode
```

**Solução:**
Adicionar variantes dark para todos os badges.

---

### 8. Transition Durations Inconsistentes
**Severidade:** 🟠 Alta  
**Localização:** Todos os componentes animados

**Problema:**
Durações variadas:
- `duration-200`
- `duration-300`
- `duration-500`
- Framer Motion: `0.15s`, `0.2s`, `0.4s`

**Solução:**
Padronizar:
- Micro-interactions: `duration-150` (0.15s)
- Transitions padrão: `duration-200` (0.2s)
- Animações complexas: `duration-300` (0.3s)

---

### 9. Text Size Hierarchy Confusa
**Severidade:** 🟠 Alta  
**Localização:** Headers, cards, listas

**Problema:**
- Headings sem escala clara
- `text-lg` usado para diferentes níveis
- Falta de distinção entre h2 e h3

**Solução:**
Hierarquia tipográfica:
```css
h1: text-2xl font-bold
h2: text-xl font-semibold
h3: text-lg font-medium
body: text-base
small: text-sm
```

---

### 10. Icon Sizes Despadronizados
**Severidade:** 🟠 Alta  
**Localização:** Todos os ícones

**Problema:**
Tamanhos variados:
- `h-3 w-3`, `h-4 w-4`, `h-5 w-5`, `h-6 w-6`, `h-8 w-8`, `h-12 w-12`
- Sem contexto claro de uso

**Solução:**
```css
/* Mini icons */
h-3 w-3: badges, inline

/* Small icons */  
h-4 w-4: inputs, buttons pequenos

/* Regular icons */
h-5 w-5: buttons padrão, menu items

/* Large icons */
h-6 w-6: headers, destaques

/* Empty states */
h-12 w-12: estados vazios, placeholders
```

---

## 🟡 Issues de Prioridade Média

### 11. Rounded Corners Inconsistentes
**Localização:** Cards, buttons, inputs

**Problema:**
- `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-full`
- Sem padrão claro

**Solução:**
- Buttons/Inputs: `rounded-lg` (8px)
- Cards: `rounded-xl` (12px)
- Modal/Large containers: `rounded-2xl` (16px)
- Circular elements: `rounded-full`

---

### 12. Gap Spacing Não Uniforme
**Localização:** Flexbox, Grid layouts

**Problema:**
- `gap-2`, `gap-3`, `gap-4`, `gap-6`
- Escolhas arbitrárias

**Solução:**
- Compact: `gap-2` (8px)
- Regular: `gap-4` (16px)
- Spacious: `gap-6` (24px)

---

### 13. Empty States Sem Padrão
**Localização:** Listas vazias, no data states

**Problema:**
- Alguns com ícones grandes
- Outros sem ícones
- Cores e estilos diferentes

**Solução:**
Componente reutilizável `EmptyState`:
- Icon: `h-12 w-12 text-gray-300 dark:text-gray-700`
- Heading: `font-medium text-gray-900 dark:text-gray-100`
- Description: `text-sm text-gray-500 dark:text-gray-400`

---

### 14. Loading States Primitivos
**Localização:** Dashboard, componentes assíncronos

**Problema:**
Spinner simples sem skeleton loading
```tsx
<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
```

**Solução:**
Implementar skeleton loading para melhor UX.

---

### 15. Responsive Breakpoints Arbitrários
**Localização:** Grid layouts, componentes

**Problema:**
- Uso inconsistente de `sm:`, `md:`, `lg:`
- Alguns components quebram em tablet

**Solução:**
Mobile-first approach consistente:
- Mobile: Base styles
- Tablet: `md:` (768px)
- Desktop: `lg:` (1024px)
- Wide: `xl:` (1280px)

---

### 16. Color Contrast em Gradientes
**Localização:** Welcome header, alerts

**Problema:**
Alguns textos em gradientes têm baixo contraste:
```tsx
<div className="bg-gradient-to-r from-blue-600 to-purple-700">
  <p className="text-blue-100"> // Pode ter contraste insuficiente
```

**Solução:**
Verificar WCAG AAA compliance, ajustar para `text-white` ou cores mais claras.

---

### 17. Focus Trap em Modals Ausente
**Localização:** Dropdowns, modals

**Problema:**
Navegação por teclado pode escapar de modais abertos.

**Solução:**
Implementar focus trap com `react-focus-lock` ou similar.

---

### 18. Scroll Behavior Não Suave
**Localização:** Sidebar, listas longas

**Problema:**
Scrollbar padrão sem customização, scroll abrupto.

**Solução:**
```css
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgb(209 213 219) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgb(209 213 219);
  border-radius: 4px;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgb(55 65 81);
}
```

---

## 🎯 Plano de Ação

### Fase 1 - Críticas (Prioridade Máxima)
1. ✅ Padronizar focus states
2. ✅ Corrigir borders dark mode
3. ✅ Unificar spacing de cards
4. ✅ Padronizar placeholders

### Fase 2 - Altas (Esta Sprint)
5. ⏳ Hover states consistentes
6. ⏳ Shadow system
7. ⏳ Badges dark mode
8. ⏳ Transitions uniformes
9. ⏳ Hierarquia tipográfica
10. ⏳ Icon sizes

### Fase 3 - Médias (Próximas)
11-18. Polimentos finais

---

## 📈 Métricas de Melhoria

**Antes:**
- Consistência Visual: 6/10
- Acessibilidade: 7/10
- Dark Mode Quality: 7/10
- Animation Polish: 8/10

**Meta (Após correções):**
- Consistência Visual: 9.5/10
- Acessibilidade: 9/10
- Dark Mode Quality: 9.5/10
- Animation Polish: 9/10

---

## 🛠️ Design Tokens Propostos

```typescript
// design-tokens.ts
export const tokens = {
  colors: {
    focus: {
      light: 'ring-blue-500',
      dark: 'dark:ring-blue-400'
    },
    border: {
      primary: 'border-gray-200 dark:border-gray-800',
      secondary: 'border-gray-300 dark:border-gray-700',
      subtle: 'border-gray-100 dark:border-gray-800/50'
    },
    text: {
      primary: 'text-gray-900 dark:text-gray-100',
      secondary: 'text-gray-600 dark:text-gray-400',
      tertiary: 'text-gray-500 dark:text-gray-500'
    }
  },
  spacing: {
    card: {
      primary: 'p-6',
      secondary: 'p-4',
      compact: 'p-3'
    },
    gap: {
      compact: 'gap-2',
      regular: 'gap-4',
      spacious: 'gap-6'
    }
  },
  radius: {
    button: 'rounded-lg',
    card: 'rounded-xl',
    modal: 'rounded-2xl'
  },
  shadow: {
    card: 'shadow-sm dark:shadow-gray-900/10',
    elevated: 'shadow-md dark:shadow-gray-900/30',
    dropdown: 'shadow-lg dark:shadow-gray-900/50',
    modal: 'shadow-2xl dark:shadow-gray-950/80'
  },
  transition: {
    fast: 'duration-150',
    normal: 'duration-200',
    slow: 'duration-300'
  },
  typography: {
    h1: 'text-2xl font-bold',
    h2: 'text-xl font-semibold',
    h3: 'text-lg font-medium',
    body: 'text-base',
    small: 'text-sm'
  },
  icons: {
    mini: 'h-3 w-3',
    small: 'h-4 w-4',
    regular: 'h-5 w-5',
    large: 'h-6 w-6',
    empty: 'h-12 w-12'
  }
}
```

---

**Próximos Passos:**
1. Revisar e aprovar tokens
2. Aplicar correções por ordem de prioridade
3. Testar acessibilidade (WCAG AAA)
4. Validar em diferentes devices
5. Documentar padrões finais

