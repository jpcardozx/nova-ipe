# Fluxo de Dados - Sistema de Catálogo

## 📊 Visão Geral do Pipeline

```
┌─────────────┐
│  Sanity CMS │  (Fonte de dados)
└──────┬──────┘
       │
       │ query getAllProperties()
       ▼
┌─────────────────────┐
│  Property (raw)     │  Estrutura Sanity
├─────────────────────┤
│ imagem: {           │
│   asset: {          │
│     url: "..."      │
│   }                 │
│ }                   │
└──────┬──────────────┘
       │
       │ transformPropertyToImovelClient()
       ▼
┌─────────────────────┐
│  ImovelClient       │  Formato interno
├─────────────────────┤
│ imagem: {           │
│   imagemUrl: "..."  │
│   asset: {          │
│     url: "..."      │
│   }                 │
│ }                   │
└──────┬──────────────┘
       │
       │ CatalogWrapper receives
       ▼
┌─────────────────────┐
│  ModularCatalog     │  
├─────────────────────┤
│ preparedProperties  │  ✨ NOVA CAMADA ✨
│ map(property => ({  │
│   ...property,      │
│   imagemPrincipal:  │  ← SOLUÇÃO!
│     imagem?.url     │
│ }))                 │
└──────┬──────────────┘
       │
       │ passes to PropertyGrid
       ▼
┌─────────────────────┐
│  PropertyCard       │  Componente de UI
├─────────────────────┤
│ expects:            │
│   imagemPrincipal   │  ✅ Agora presente!
└─────────────────────┘
```

---

## 🔄 Transformações de Dados

### 1️⃣ Sanity → Property

**Query** (`lib/sanity/queries.ts`):
```typescript
imagem {
  asset-> {
    _id,
    url,
    metadata
  },
  alt,
  hotspot,
  "imagemUrl": asset->url
}
```

**Resultado**:
```json
{
  "imagem": {
    "asset": {
      "_id": "image-abc123",
      "url": "https://cdn.sanity.io/images/..."
    },
    "alt": "Casa moderna",
    "imagemUrl": "https://cdn.sanity.io/images/..."
  }
}
```

---

### 2️⃣ Property → ImovelClient

**Transformer** (`lib/sanity/queries.ts`):
```typescript
imagem: property.imagem ? {
  imagemUrl: property.imagem.asset?.url,
  alt: property.imagem.alt,
  asset: {
    _ref: property.imagem.asset?._id,
    _type: 'sanity.imageAsset'
  }
} : undefined
```

**Resultado**:
```json
{
  "imagem": {
    "imagemUrl": "https://cdn.sanity.io/images/...",
    "alt": "Casa moderna",
    "asset": {
      "_ref": "image-abc123",
      "_type": "sanity.imageAsset"
    }
  }
}
```

---

### 3️⃣ ImovelClient → PreparedProperty ✨ NOVO

**Mapper** (`app/catalogo/components/ModularCatalog.tsx`):
```typescript
const preparedProperties = useMemo(() => {
  return properties.map(property => ({
    ...property,
    // ✅ Adiciona imagemPrincipal
    imagemPrincipal: 
      property.imagem?.imagemUrl || 
      property.imagem?.asset?.url || 
      '',
    
    // ✅ Mapeia campos de filtro
    tipo: property.finalidade || property.tipo,
    quartos: property.dormitorios || property.quartos,
    banheiros: property.banheiros,
    preco: property.preco
  }));
}, [properties]);
```

**Resultado**:
```json
{
  "imagemPrincipal": "https://cdn.sanity.io/images/...",
  "imagem": {
    "imagemUrl": "https://cdn.sanity.io/images/...",
    "alt": "Casa moderna"
  },
  "tipo": "Venda",
  "quartos": 3,
  "banheiros": 2,
  "preco": 500000
}
```

---

### 4️⃣ PreparedProperty → PropertyCard

**Component** (`app/catalogo/components/grid/PropertyCard.tsx`):
```tsx
{property.imagemPrincipal ? (
  <img 
    src={property.imagemPrincipal}  // ✅ Campo existe!
    alt={property.titulo}
    onError={(e) => {
      (e.target as HTMLImageElement).style.display = 'none';
    }}
  />
) : (
  // Fallback UI
  <div className="bg-gradient-to-br from-gray-100 to-gray-200">
    <svg>🏠</svg>
    <span>Sem imagem disponível</span>
  </div>
)}
```

---

## 🎯 Por Que Essa Abordagem?

### ✅ Vantagens

1. **Mínima Invasão**
   - Não modifica pipeline existente
   - Adiciona apenas camada de compatibilidade
   - ~30 linhas de código

2. **Retrocompatibilidade**
   - Suporta `imagemUrl` e `asset.url`
   - Funciona com dados antigos e novos
   - Fallback para strings vazias

3. **Performance**
   - `useMemo` previne recálculos
   - Mapeamento simples e rápido
   - Sem transformações pesadas

4. **Manutenibilidade**
   - Fácil de entender
   - Um lugar para mudar (ModularCatalog)
   - Bem documentado

### ❌ Alternativas Rejeitadas

1. **Reescrever Pipeline**
   ```
   ❌ Muito invasivo
   ❌ Alto risco de bugs
   ❌ Afetaria outros componentes
   ```

2. **Mudar PropertyCard**
   ```
   ❌ Outros componentes também usam
   ❌ Quebraria outros catálogos
   ❌ Mais difícil manter
   ```

3. **Criar Novo Transformer**
   ```
   ❌ Overengineering
   ❌ Duplicação de lógica
   ❌ Mais complexidade
   ```

---

## 🔍 Sistema de Filtros

### Campo → Filtro Mapping

```typescript
// Dados originais podem ter diferentes nomes
property.finalidade    // "Venda" ou "Aluguel"
property.tipoImovel    // "Casa", "Apartamento"
property.dormitorios   // número
property.banheiros     // número
property.preco         // número

// Normalizados para:
tipo         ← finalidade || tipo
tipoImovel   ← tipoImovel
quartos      ← dormitorios || quartos
banheiros    ← banheiros
preco        ← preco
```

### Filtro Inteligente

```typescript
// Filtro por tipo - suporta múltiplos campos
if (filters.tipo) {
  const filterValue = filters.tipo.toLowerCase();
  
  filtered = filtered.filter(p => {
    const finalidade = p.finalidade?.toLowerCase();   // "venda"
    const tipoImovel = p.tipoImovel?.toLowerCase();   // "casa"
    const tipo = p.tipo?.toLowerCase();               // fallback
    
    // Match em qualquer um dos campos
    return finalidade === filterValue || 
           tipoImovel === filterValue || 
           tipo === filterValue;
  });
}
```

**Exemplo de Uso**:
```
Usuario seleciona: "Venda"
  → Filtra por finalidade = "venda" ✅
  
Usuario seleciona: "Casa"  
  → Filtra por tipoImovel = "casa" ✅
  
Funciona para ambos! 🎉
```

---

## 🐛 Debug Flow

### 1. ImageDiagnostic (Dev Mode)

```typescript
// Rodado automaticamente em desenvolvimento
console.group('🖼️ DIAGNÓSTICO DE IMAGENS');

console.log('📊 ESTATÍSTICAS:', {
  total: 10,
  comImagens: 8,
  semImagens: 2,
  percentual: '80%'
});

console.log('🔬 ESTRUTURA:', {
  'imagem.imagemUrl': 'https://...',
  'imagem.asset.url': 'https://...'
});

console.groupEnd();
```

### 2. ModularCatalog Debug

```typescript
// Mostra preparação de dados
console.log('📦 ModularCatalog preparou:', {
  total: 10,
  comImagens: 8,
  semImagens: 2,
  percentual: '80%'
});
```

### 3. PropertyCard Error Handling

```tsx
// Captura erros de carregamento
<img 
  onError={(e) => {
    console.warn('❌ Erro ao carregar imagem');
    // Esconde imagem quebrada
    e.target.style.display = 'none';
  }}
/>
```

---

## 📈 Fluxo de Eventos

```
1. Usuário acessa /catalogo
   ↓
2. Page.tsx busca dados do Sanity
   ↓
3. Transforma Property → ImovelClient
   ↓
4. CatalogWrapper recebe ImovelClient[]
   ↓
5. ModularCatalog mapeia para PreparedProperty[]
   ├─ Adiciona imagemPrincipal
   ├─ Normaliza campos de filtro
   └─ Log de debug (dev mode)
   ↓
6. HorizontalFilters aplica filtros
   ↓
7. PropertyGrid ordena propriedades
   ↓
8. PropertyCard renderiza
   ├─ Usa imagemPrincipal
   ├─ Fallback se ausente
   └─ Trata erros de carregamento
   ↓
9. ✨ Usuário vê catálogo funcional!
```

---

## 🎨 Visual: Antes vs Depois

### ANTES ❌
```
┌──────────────┐
│  Sanity      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ ImovelClient │
│ imagem: {    │
│   imagemUrl  │  ⚠️ Campo existe
│ }            │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ PropertyCard │
│ expects:     │
│ imagemPrin...│  ❌ Mas procura por outro!
└──────────────┘
    ↓
  ⬜ GRAY BOX
```

### DEPOIS ✅
```
┌──────────────┐
│  Sanity      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ ImovelClient │
│ imagem: {    │
│   imagemUrl  │  ✅ Campo existe
│ }            │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Prepared     │  ✨ CAMADA NOVA
│ imagemPrin...│  ✅ Campo mapeado
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ PropertyCard │
│ imagemPrin...│  ✅ Encontra campo!
└──────────────┘
    ↓
  🖼️ IMAGE!
```

---

## 💡 Takeaways

1. **Camada de Compatibilidade** > Reescrever tudo
2. **Mapeamento Simples** > Transformação complexa
3. **Um Lugar para Mudar** > Mudanças espalhadas
4. **Debug Claro** > Silent failures
5. **Fallbacks Elegantes** > Erros feios

---

> 📚 **Documentação Relacionada**:
> - `FIXES.md` - Detalhes técnicos e manutenção
> - `BEFORE_AFTER.md` - Comparação visual
> - `MIGRATION.md` - Guia de migração
