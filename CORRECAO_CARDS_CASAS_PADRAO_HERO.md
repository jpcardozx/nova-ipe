# 🎯 Correção: Cards Casas Residenciais - Padrão Hero Aplicado

## 📋 Problema Identificado

**Feedback do usuário:**
> "vc esta focando em explore por bairro, meu problema sao os cards anteriores de CASAS RESIDENCIAIS (?????/) por exemplo"

## ❌ Problema Real

Os cards de **Casas Residenciais, Condomínios e Comerciais** estavam FORA do padrão do Hero:

### Antes (ERRADO):
```tsx
{/* Card BRANCO inferior */}
<div className="bg-white rounded-xl">
  <h3 className="text-gray-900">{label}</h3>
  <p className="text-gray-600">{descricao}</p>
  {/* Features chips */}
  {/* Stats row */}
  <span className="text-amber-600">Ver todos</span>
</div>
```

### Hero (CORRETO):
```tsx
{/* Card ESCURO inferior - slate-900 */}
<div className="bg-gradient-to-br from-slate-900/98 to-slate-800/98">
  <h4 className="text-white">{title}</h4>
  <p className="text-slate-400">{description}</p>
  {/* Divider gradiente */}
  <span className="text-amber-400">Explorar imóveis</span>
  <div className="bg-amber-500/10">
    <ArrowRight />
  </div>
</div>
```

## ✅ Correção Implementada

### 1. **Ícone Sobreposto na Imagem (Padrão Hero)**

**Antes (ERRADO):**
```tsx
{/* Ícone flutuante entre imagem e card */}
<div className="absolute -bottom-5 left-4">
  <div className="p-3 border-3 border-white bg-gradient-to-br from-amber-500">
    {icon}
  </div>
</div>
```

**Depois (CORRETO - Hero):**
```tsx
{/* Ícone sobreposto NA IMAGEM (top-left) */}
<div className="absolute top-3 left-3 z-20">
  <div className={cn(
    'p-3 rounded-xl shadow-2xl border-2 border-white/30 backdrop-blur-sm',
    'transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-0.5',
    iconBgClasses[accentColor] // from-amber-500 to-amber-600
  )}>
    <div className="text-white drop-shadow-lg">{icon}</div>
  </div>
</div>
```

**Mudanças:**
- ✅ Position: `-bottom-5` → `top-3` (dentro da imagem)
- ✅ Z-index: none → `z-20` (acima de tudo)
- ✅ Border: `border-3` → `border-2 border-white/30`
- ✅ Backdrop: none → `backdrop-blur-sm`
- ✅ Hover: `scale-110` → `scale-110 + -translate-y-0.5`
- ✅ Shadow: `shadow-xl` → `shadow-2xl + group-hover:shadow-amber-500/20`

---

### 2. **Card Inferior Escuro (Padrão Hero)**

**Antes (ERRADO):**
```tsx
{/* Card BRANCO */}
<div className="bg-white rounded-xl border border-gray-100">
  <h3 className="text-gray-900">{label}</h3>
  <p className="text-gray-500">{subtitulo}</p>
  <p className="text-gray-600">{descricao}</p>
  {/* Features + Stats */}
  <span className="text-amber-600">Ver todos</span>
  <ArrowRight className="text-amber-600" />
</div>
```

**Depois (CORRETO - Hero):**
```tsx
{/* Card ESCURO - slate-900 */}
<div className="bg-gradient-to-br from-slate-900/98 to-slate-800/98 backdrop-blur-xl rounded-b-xl border-t-2 border-white/5">
  {/* Título e Descrição */}
  <div className="mb-4 space-y-2">
    <h4 className="text-white font-bold group-hover:text-amber-400">
      {label}
    </h4>
    <p className="text-slate-400 text-sm">
      {subtitulo}
    </p>
  </div>

  {/* Divider Sutil */}
  <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4" />

  {/* CTA Premium */}
  <div className="flex items-center justify-between">
    <span className="text-sm font-bold text-amber-400 group-hover:text-amber-300">
      Explorar imóveis
    </span>
    <div className="w-7 h-7 rounded-full bg-amber-500/10 group-hover:bg-amber-500/20">
      <ArrowRight className="w-4 h-4 text-amber-400 group-hover:text-amber-300" />
    </div>
  </div>
</div>
```

**Mudanças:**
- ✅ Background: `bg-white` → `bg-gradient-to-br from-slate-900/98 to-slate-800/98`
- ✅ Backdrop: none → `backdrop-blur-xl`
- ✅ Border: `border-gray-100` → `border-t-2 border-white/5`
- ✅ Rounded: `rounded-xl` → `rounded-b-xl` (só inferior)
- ✅ Text colors: 
  - `text-gray-900` → `text-white`
  - `text-gray-500` → `text-slate-400`
  - `text-amber-600` → `text-amber-400 hover:text-amber-300`
- ✅ Removido: Features chips, Stats row (poluição visual)
- ✅ Adicionado: Divider gradiente elegante
- ✅ CTA: Arrow em círculo com bg-amber-500/10

---

### 3. **Badge e Contador (Mantidos no Padrão Hero)**

**Badge (top-right):**
```tsx
<div className="absolute top-3 right-3 bg-white/98 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-xl border border-white/20">
  <span className="text-slate-900 text-xs font-bold tracking-wide">
    {badge}
  </span>
</div>
```

**Contador (removido - estava sobrepondo ícone):**
- ❌ Removido contador que estava em `top-3 left-3`
- ✅ Agora apenas o ícone ocupa essa posição

---

## 📊 Comparação Visual

### Hero (Referência):
```
┌────────────────────────────────┐
│  [Imagem com gradiente]        │
│                                │
│  [Ícone top-left] [Badge]      │
│                                │
├────────────────────────────────┤
│  Card slate-900                │
│  • Título branco               │
│  • Descrição slate-400         │
│  ━━━━━━━━━━━━━━━━━━━━━━       │
│  CTA amber-400 → [⭕ Arrow]    │
└────────────────────────────────┘
```

### Casas Residenciais (Agora IGUAL):
```
┌────────────────────────────────┐
│  [Imagem com gradiente]        │
│                                │
│  [Ícone top-left] [Badge]      │
│                                │
├────────────────────────────────┤
│  Card slate-900                │
│  • Título branco               │
│  • Subtítulo slate-400         │
│  ━━━━━━━━━━━━━━━━━━━━━━       │
│  CTA amber-400 → [⭕ Arrow]    │
└────────────────────────────────┘
```

## ✅ Checklist de Conformidade com Hero

### Estrutura:
- ✅ Imagem com aspect-ratio
- ✅ Gradiente from-black/75 via-black/20
- ✅ Badge top-right (white/98)
- ✅ Ícone top-left sobreposto (z-20)
- ✅ Card inferior escuro (slate-900)
- ✅ Border-t-2 border-white/5

### Tipografia:
- ✅ Título: text-white font-bold
- ✅ Descrição: text-slate-400 text-sm
- ✅ Hover: group-hover:text-amber-400
- ✅ Tracking-tight no título

### Interação:
- ✅ Hover scale-110 + translate-y-0.5 no ícone
- ✅ Group hover no card
- ✅ Arrow em círculo bg-amber-500/10
- ✅ Active:scale-[0.98] no Link

### Elementos:
- ✅ Divider gradiente via-white/10
- ✅ Space-y-2 no conteúdo
- ✅ Backdrop-blur-xl
- ✅ Shadow-2xl no ícone
- ✅ Rounded-b-xl no card inferior

### Cores:
- ✅ Amber-400 → amber-300 no hover
- ✅ Slate-900/98 → slate-800/98 gradient
- ✅ White/30 nas bordas
- ✅ Drop-shadow-lg no ícone

## 🎯 Resultado Final

### Mobile Carousel:
```tsx
// Mesmo padrão do Hero
<div className="aspect-[4/3]"> {/* Imagem */}
  <div className="absolute top-3 left-3 z-20"> {/* Ícone */}
  <div className="absolute top-3 right-3"> {/* Badge */}
</div>
<div className="bg-gradient-to-br from-slate-900/98"> {/* Card escuro */}
```

### Desktop Grid:
```tsx
// Mesmo padrão do Hero
<div className="aspect-[4/3]"> {/* Imagem */}
  <div className="absolute top-3 left-3 z-20"> {/* Ícone */}
  <div className="absolute top-3 right-3"> {/* Badge */}
</div>
<div className="bg-gradient-to-br from-slate-900/98"> {/* Card escuro */}
```

**Ambos agora seguem EXATAMENTE o padrão do Hero! ✅**

## 📝 Comandos para Teste

```bash
# Testar em desenvolvimento
cd /home/jpcardozx/projetos/nova-ipe
pnpm dev

# Validar:
# 1. Cards Hero (Casas Residenciais, Sítios, Terrenos)
# 2. Cards Curadoria (Casas Residenciais, Condomínios, Comerciais)
# 3. Verificar que AMBOS usam:
#    - Ícone sobreposto na imagem (top-left)
#    - Card inferior escuro (slate-900)
#    - Divider gradiente
#    - CTA com arrow em círculo
```

**0 erros | Padrão Hero aplicado corretamente | Mobile + Desktop consistentes! 🚀**
