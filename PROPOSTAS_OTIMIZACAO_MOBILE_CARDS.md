# 🎨 5 PROPOSTAS: Otimização Mobile - Cards Exploração

## 📊 Problema Atual

**Mobile:** Cards empilhados verticalmente ocupam **muito espaço vertical** (~700px por card × 3 cards = **2100px** só nesta seção)

```tsx
// ATUAL: h-56 (224px de imagem) + espaçamento
<div className="h-56 w-full rounded-2xl">
```

---

## 🚀 PROPOSTA 1: **Carrossel Horizontal Mobile** (Recomendada ⭐)

### Conceito
Transformar cards empilhados em **carrossel horizontal swipeable** no mobile.

### Vantagens
- ✅ **Reduz altura em 70%**: ~700px → ~250px
- ✅ UX moderna (swipe natural)
- ✅ Mantém 100% do conteúdo visível
- ✅ Indicadores de navegação

### Implementação
```tsx
// Adicionar: embla-carousel-react ou swiper
import useEmblaCarousel from 'embla-carousel-react'

<div className="md:grid md:grid-cols-3 md:gap-8">
  {/* Mobile: Carrossel */}
  <div className="md:hidden overflow-hidden" ref={emblaRef}>
    <div className="flex gap-4 px-4">
      {cenariosDeMoradia.map((cenario) => (
        <div className="flex-[0_0_85%] min-w-0"> {/* 85% width */}
          <CardContent />
        </div>
      ))}
    </div>
  </div>
  
  {/* Desktop: Grid normal */}
  <div className="hidden md:grid md:grid-cols-3 gap-8">
    {cenariosDeMoradia.map((cenario) => (
      <CardContent />
    ))}
  </div>
</div>

{/* Dots de navegação mobile */}
<div className="flex justify-center gap-2 mt-4 md:hidden">
  {cenariosDeMoradia.map((_, idx) => (
    <button className={cn("h-2 rounded-full transition-all",
      idx === currentSlide ? "w-8 bg-amber-500" : "w-2 bg-gray-300"
    )} />
  ))}
</div>
```

### Dependências
```bash
pnpm add embla-carousel-react
```

---

## 🚀 PROPOSTA 2: **Cards Compactos Mobile** (Mais Simples)

### Conceito
Reduzir drasticamente altura dos cards no mobile com layout compacto horizontal.

### Vantagens
- ✅ **Reduz altura em 60%**: ~700px → ~280px
- ✅ Sem dependências extras
- ✅ Implementação rápida
- ✅ Mantém scroll vertical familiar

### Implementação
```tsx
<div className={cn(
  "relative",
  // Mobile: horizontal compact
  "flex md:block items-center gap-4 h-24 md:h-auto",
  // Desktop: mantém layout atual
  "md:grid md:grid-cols-3 md:gap-8"
)}>
  {cenariosDeMoradia.map((cenario) => (
    <Link href={cenario.href} className={cn(
      "group",
      // Mobile: card horizontal
      "flex md:block items-center gap-3 md:gap-0",
      "w-full md:w-auto"
    )}>
      {/* Imagem */}
      <div className={cn(
        "relative rounded-xl md:rounded-2xl overflow-hidden",
        "w-24 h-24 md:w-full md:h-56", // Mobile: 96px, Desktop: 224px
        "flex-shrink-0"
      )}>
        <Image src={cenario.bgImage} fill className="object-cover" />
        
        {/* Ícone sobreposto no mobile */}
        <div className="absolute inset-0 flex items-center justify-center md:hidden">
          <div className="p-3 rounded-xl bg-black/50 backdrop-blur-sm">
            {cenario.icone}
          </div>
        </div>
      </div>
      
      {/* Conteúdo compacto mobile */}
      <div className="flex-1 md:hidden">
        <h3 className="font-bold text-base text-gray-900">{cenario.label}</h3>
        <p className="text-xs text-gray-600 line-clamp-2">{cenario.descricao}</p>
      </div>
      
      {/* Desktop: mantém layout atual */}
      <div className="hidden md:block">
        {/* Layout atual... */}
      </div>
    </Link>
  ))}
</div>
```

---

## 🚀 PROPOSTA 3: **Tabs Expansíveis** (Mais Interativo)

### Conceito
Cards colapsados em tabs/acordeão, expande ao tocar.

### Vantagens
- ✅ **Reduz altura em 80%** inicialmente: ~700px → ~140px
- ✅ Usuário escolhe o que ver
- ✅ Mais interativo
- ✅ Economia extrema de espaço

### Implementação
```tsx
const [activeTab, setActiveTab] = useState<number | null>(null)

<div className="space-y-2 md:grid md:grid-cols-3 md:gap-8">
  {cenariosDeMoradia.map((cenario, idx) => (
    <div key={cenario.label} className={cn(
      "border-2 rounded-xl transition-all duration-300",
      activeTab === idx ? "border-amber-400" : "border-gray-200",
      "md:border-0" // Desktop sem bordas
    )}>
      {/* Header compacto (sempre visível mobile) */}
      <button
        onClick={() => setActiveTab(activeTab === idx ? null : idx)}
        className={cn(
          "w-full flex items-center justify-between p-4",
          "md:hidden" // Desktop não é clicável
        )}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2.5 rounded-lg",
            iconBgClasses[cenario.accentColor]
          )}>
            {cenario.icone}
          </div>
          <div className="text-left">
            <h3 className="font-bold text-gray-900">{cenario.label}</h3>
            <span className="text-xs text-gray-500">{cenario.tag}</span>
          </div>
        </div>
        <ChevronDown className={cn(
          "w-5 h-5 transition-transform",
          activeTab === idx && "rotate-180"
        )} />
      </button>
      
      {/* Conteúdo expansível mobile */}
      <div className={cn(
        "md:block overflow-hidden transition-all",
        activeTab === idx 
          ? "max-h-96 opacity-100" 
          : "max-h-0 opacity-0 md:max-h-none md:opacity-100"
      )}>
        <div className="px-4 pb-4 md:p-0">
          <div className="relative h-48 md:h-56 rounded-xl overflow-hidden mb-3">
            <Image src={cenario.bgImage} fill className="object-cover" />
          </div>
          <p className="text-sm text-gray-600">{cenario.descricao}</p>
          <Link href={cenario.href} className="inline-flex items-center gap-2 mt-3 text-amber-600 font-semibold text-sm">
            {cenario.cta}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
      
      {/* Desktop: layout normal (sempre visível) */}
      <div className="hidden md:block">
        {/* Layout atual completo */}
      </div>
    </div>
  ))}
</div>
```

---

## 🚀 PROPOSTA 4: **Grid 2 Colunas Mobile** (Balanceado)

### Conceito
2 cards por linha no mobile ao invés de empilhados.

### Vantagens
- ✅ **Reduz altura em 50%**: ~700px → ~350px
- ✅ Aproveita largura mobile
- ✅ Zero dependências
- ✅ Simples de implementar

### Implementação
```tsx
<div className={cn(
  // Mobile: 2 colunas
  "grid grid-cols-2 gap-3",
  // Tablet+: 3 colunas
  "md:grid-cols-3 md:gap-8"
)}>
  {cenariosDeMoradia.map((cenario) => (
    <Link href={cenario.href} className="group">
      {/* Imagem menor mobile */}
      <div className={cn(
        "relative rounded-xl overflow-hidden",
        "h-32 md:h-56", // Mobile: 128px, Desktop: 224px
        "mb-3"
      )}>
        <Image src={cenario.bgImage} fill className="object-cover" />
        
        {/* Ícone menor no mobile */}
        <div className={cn(
          "absolute -bottom-3 left-2 md:-top-6 md:left-6",
          "p-2 md:p-4 rounded-xl shadow-lg",
          iconBgClasses[cenario.accentColor]
        )}>
          <div className="scale-75 md:scale-100">
            {cenario.icone}
          </div>
        </div>
      </div>
      
      {/* Conteúdo compacto mobile */}
      <div className="pt-2">
        <h3 className={cn(
          "font-bold text-gray-900 mb-1",
          "text-sm md:text-xl", // Menor no mobile
          "line-clamp-1"
        )}>
          {cenario.label}
        </h3>
        
        <p className={cn(
          "text-gray-600 mb-2",
          "text-xs md:text-sm", // Menor no mobile
          "line-clamp-2 md:line-clamp-3"
        )}>
          {cenario.descricao}
        </p>
        
        {/* Tag compacta mobile */}
        <span className={cn(
          "inline-block text-xs font-medium px-2 py-1 rounded-full",
          "bg-amber-100 text-amber-700"
        )}>
          {cenario.tag}
        </span>
      </div>
    </Link>
  ))}
</div>
```

---

## 🚀 PROPOSTA 5: **Hero Card + Mini Cards** (Destaque)

### Conceito
1º card grande (hero), demais cards compactos em grid 2 colunas.

### Vantagens
- ✅ **Reduz altura em 55%**: ~700px → ~320px
- ✅ Destaca opção mais importante
- ✅ Visual hierárquico
- ✅ Sem dependências

### Implementação
```tsx
<div className="space-y-4 md:grid md:grid-cols-3 md:gap-8 md:space-y-0">
  {/* Primeiro card: HERO (mobile) */}
  <Link 
    href={cenariosDeMoradia[0].href}
    className={cn(
      "block group",
      "md:col-span-1" // Desktop: 1/3
    )}
  >
    <div className="relative h-56 rounded-2xl overflow-hidden mb-4">
      <Image 
        src={cenariosDeMoradia[0].bgImage} 
        fill 
        className="object-cover" 
      />
      
      {/* Badge "Mais Popular" */}
      <div className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold">
        ⭐ Mais Buscado
      </div>
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      
      {/* Conteúdo sobre imagem */}
      <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
            {cenariosDeMoradia[0].icone}
          </div>
          <h3 className="font-bold text-xl">{cenariosDeMoradia[0].label}</h3>
        </div>
        <p className="text-sm text-white/90 line-clamp-2">
          {cenariosDeMoradia[0].descricao}
        </p>
      </div>
    </div>
  </Link>
  
  {/* Cards 2 e 3: GRID 2 colunas (mobile) */}
  <div className={cn(
    "grid grid-cols-2 gap-3",
    "md:col-span-2 md:grid-cols-2 md:gap-8"
  )}>
    {cenariosDeMoradia.slice(1).map((cenario) => (
      <Link 
        key={cenario.label}
        href={cenario.href}
        className="group"
      >
        <div className="relative h-32 md:h-56 rounded-xl overflow-hidden mb-3">
          <Image src={cenario.bgImage} fill className="object-cover" />
          
          {/* Ícone compacto */}
          <div className={cn(
            "absolute top-2 left-2 p-2 rounded-lg",
            iconBgClasses[cenario.accentColor]
          )}>
            <div className="scale-75">
              {cenario.icone}
            </div>
          </div>
        </div>
        
        <h3 className="font-bold text-sm md:text-lg text-gray-900 mb-1 line-clamp-1">
          {cenario.label}
        </h3>
        <p className="text-xs md:text-sm text-gray-600 line-clamp-2">
          {cenario.descricao}
        </p>
      </Link>
    ))}
  </div>
</div>
```

---

## 📊 COMPARATIVO DE RESULTADOS

| Proposta | Redução Altura | Complexidade | UX Mobile | Dependências | Recomendação |
|----------|---------------|--------------|-----------|--------------|--------------|
| **1. Carrossel** | **70%** (~250px) | Média | ⭐⭐⭐⭐⭐ Excelente | embla-carousel | **⭐ MELHOR** |
| **2. Compactos** | **60%** (~280px) | Baixa | ⭐⭐⭐⭐ Boa | Nenhuma | **Rápido** |
| **3. Tabs** | **80%** (~140px) | Média | ⭐⭐⭐ Boa | Nenhuma | Economia máxima |
| **4. Grid 2 Col** | **50%** (~350px) | Baixa | ⭐⭐⭐⭐ Boa | Nenhuma | Balanceado |
| **5. Hero + Mini** | **55%** (~320px) | Média | ⭐⭐⭐⭐ Boa | Nenhuma | Visual atraente |

---

## 🎯 RECOMENDAÇÃO FINAL

### 🥇 **PROPOSTA 1: Carrossel Horizontal** (70% redução)

**Por quê:**
- ✅ Maior redução de altura vertical
- ✅ UX moderna e nativa mobile (swipe)
- ✅ Mantém 100% do conteúdo original
- ✅ Padrão de mercado (Airbnb, Booking.com)
- ✅ Fácil implementação com Embla Carousel

**Alternativa sem deps:**
Se preferir evitar dependências → **PROPOSTA 2 ou 4**

---

## 🚀 Quer que eu implemente qual?

Posso implementar qualquer uma das 5 propostas agora! Qual você prefere? 🎨
