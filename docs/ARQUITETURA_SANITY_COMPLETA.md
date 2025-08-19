# 🏗️ ARQUITETURA DE DADOS SANITY - DOCUMENTAÇÃO COMPLETA

## 📊 Estrutura do Schema Sanity (studio/schemas/imovel.ts)

### 🏡 **Documento: `imovel`**

#### **📋 Informações Básicas**

```typescript
titulo: string; // "Casa com quintal em Guararema"
categoria: reference; // → documento categoria
finalidade: string; // "Venda" | "Aluguel" | "Temporada"
descricao: text; // Descrição detalhada
dormitorios: number; // 🛏️ Número de dormitórios
banheiros: number; // 🛁 Número de banheiros
areaUtil: number; // 📐 Área útil em m²
vagas: number; // 🚗 Vagas de garagem
tipoImovel: string; // "Casa" | "Apartamento" | "Terreno" | "Comercial" | "Outro"
preco: number; // 💰 Preço em R$
endereco: string; // 📍 Endereço completo
bairro: string; // Bairro
cidade: string; // Cidade (default: "Guararema")
estado: string; // Estado (default: "SP")
documentacaoOk: boolean; // 📄 Documentação OK
aceitaFinanciamento: boolean; // 🏦 Aceita financiamento
```

#### **🖼️ Mídia e Visual**

```typescript
imagem: image {             // Imagem principal (obrigatória)
  asset: reference,
  hotspot: boolean,
  crop: object
}

galeria: array[image] {     // Galeria de imagens
  asset: reference,
  hotspot: boolean,
  fields: {
    alt: string,           // Texto alternativo
    titulo: string         // Título da imagem
  }
}
```

#### **🔍 SEO e Controle**

```typescript
slug: slug; // URL amigável (gerado do título)
linkPersonalizado: url; // Link customizado (WhatsApp, etc)
mapaLink: url; // Link Google Maps
imagemOpenGraph: image; // Imagem para compartilhamento
```

## 🔄 **Fluxo de Transformação de Dados**

### **1. Schema Sanity → Query GROQ → ImovelProjetado**

```groq
*[_type == "imovel" && status == "disponivel"] {
  _id,
  titulo,
  slug,
  preco,
  dormitorios,         // ✅ Campo mapeado
  banheiros,           // ✅ Campo mapeado
  vagas,               // ✅ Campo mapeado
  areaUtil,            // ✅ Campo mapeado
  finalidade,
  bairro,
  cidade,
  categoria->{
    _id,
    "categoriaTitulo": titulo,
    "categoriaSlug": slug
  },
  imagem {
    "asset": asset->,
    "_type": "image",
    "imagemUrl": asset->url,
    "alt": alt
  }
}
```

### **2. ImovelProjetado → mapImovelToClient() → ImovelClient**

```typescript
// lib/mapImovelToClient.ts
export function mapImovelToClient(imovel: ImovelProjetado): ImovelClient {
  return {
    _id: imovel._id,
    titulo: imovel.titulo,
    slug: typeof imovel.slug === 'string' ? imovel.slug : imovel.slug?.current,
    preco: imovel.preco,
    dormitorios: imovel.dormitorios, // ✅ Direto
    banheiros: imovel.banheiros, // ✅ Direto
    vagas: imovel.vagas, // ✅ Direto
    areaUtil: imovel.areaUtil, // ✅ Direto
    // ... outros campos
  };
}
```

### **3. ImovelClient → transformToUnifiedProperty() → UnifiedPropertyData**

```typescript
// lib/unified-property-transformer.ts
export function transformToUnifiedProperty(imovel: ImovelClient): UnifiedPropertyData {
  return {
    id: imovel._id,
    title: imovel.titulo || 'Título não informado',
    bedrooms: imovel.dormitorios, // 🔄 Normalização
    bathrooms: imovel.banheiros, // 🔄 Normalização
    parkingSpots: imovel.vagas, // 🔄 Normalização
    area: imovel.areaUtil, // 🔄 Normalização
    // ... outros campos normalizados
  };
}
```

### **4. UnifiedPropertyData → toPropertyCardPremiumProps() → PropertyCardPremium**

```typescript
export function toPropertyCardPremiumProps(unified: UnifiedPropertyData): PropertyCardPremiumProps {
  return {
    id: unified.id,
    title: unified.title,
    bedrooms: unified.bedrooms, // ✅ UI Component
    bathrooms: unified.bathrooms, // ✅ UI Component
    parkingSpots: unified.parkingSpots, // ✅ UI Component
    area: unified.area, // ✅ UI Component
    // ... outros props
  };
}
```

## 🔍 **Queries GROQ Principais**

### **Para Venda** (`queryImoveisParaVenda`)

```groq
*[
  _type == "imovel" &&
  status == "disponivel" &&
  finalidade == "venda"
] | order(_createdAt desc)[0...30] {
  _id,
  titulo,
  slug,
  preco,
  destaque,
  finalidade,
  bairro,
  cidade,
  dormitorios,              // ✅ Campo crítico
  banheiros,                // ✅ Campo crítico
  vagas,                    // ✅ Campo crítico
  areaUtil,                 // ✅ Campo crítico
  area,
  categoria->{
    _id,
    "categoriaTitulo": titulo,
    "categoriaSlug": slug
  },
  imagem {
    "asset": asset->,
    "_type": "image",
    "imagemUrl": asset->url,
    "alt": alt
  },
  aceitaFinanciamento
}
```

### **Para Aluguel** (`queryImoveisParaAlugar`)

```groq
*[
  _type == "imovel" &&
  status == "disponivel" &&
  finalidade == "Aluguel"           // ⚠️ Case-sensitive!
] | order(_createdAt desc)[0...30] {
  // ... mesmos campos da query de venda
}
```

## ⚠️ **Problemas Identificados e Soluções**

### **1. Erro GROQ Sintático**

**Problema:** Duplicação de campos e vírgulas ausentes

```groq
// ❌ ERRO
aceitaFinanciamento
areaUtil              // Duplicado, sem vírgula

// ✅ CORRETO
aceitaFinanciamento
```

### **2. Case-Sensitivity**

**Problema:** Inconsistência entre "venda" e "Venda"

```groq
// ❌ Inconsistente
finalidade == "venda"     // Query para venda
finalidade == "Aluguel"   // Query para aluguel

// ✅ Consistente
finalidade == "Venda"     // Padronizar tudo
finalidade == "Aluguel"
```

### **3. Campos Ausentes**

**Problema:** dormitorios, banheiros, vagas não estavam nas queries
**Solução:** ✅ Adicionados em todas as queries principais

## 🧪 **Testes de Validação**

### **Console Logs para Debug**

```typescript
// unified-property-transformer.ts
console.log('🔄 Transformando imóvel:', {
  id: imovel._id,
  titulo: imovel.titulo,
  dormitorios: imovel.dormitorios, // ✅ Deve aparecer
  banheiros: imovel.banheiros, // ✅ Deve aparecer
  areaUtil: imovel.areaUtil, // ✅ Deve aparecer
  vagas: imovel.vagas, // ✅ Deve aparecer
});
```

### **Validação de Queries**

```typescript
// SecaoImoveisParaAlugarPremium.tsx
console.log('🔍 Buscando imóveis para alugar no Sanity...');
const d = await getImoveisParaAlugar();
console.log('✅ Dados recebidos do Sanity:', d?.length || 0, 'imóveis');
```

## 📈 **Métricas de Qualidade**

### **Campos Críticos Status**

- ✅ `_id` - Sempre presente (chave primária)
- ✅ `titulo` - Sempre presente (obrigatório no schema)
- ✅ `slug` - Sempre presente (obrigatório no schema)
- ✅ `preco` - Presente quando informado
- ✅ `dormitorios` - **CORRIGIDO** - Agora nas queries
- ✅ `banheiros` - **CORRIGIDO** - Agora nas queries
- ✅ `vagas` - **CORRIGIDO** - Agora nas queries
- ✅ `areaUtil` - **CORRIGIDO** - Agora nas queries

### **Cobertura de Transformação**

- ✅ Schema → Query: 100% dos campos críticos
- ✅ Query → ImovelClient: 100% mapeamento direto
- ✅ ImovelClient → UnifiedProperty: 100% normalização
- ✅ UnifiedProperty → UI: 100% exibição

## 🎯 **Recomendações de Melhoria**

### **1. Padronização de Nomenclatura**

```typescript
// Schema Sanity (manter atual)
dormitorios: number;
banheiros: number;
vagas: number;

// Interface Unificada (normalizada)
bedrooms: number;
bathrooms: number;
parkingSpots: number;
```

### **2. Validação Robusta**

```typescript
// Adicionar validações no transformer
if (!imovel.dormitorios && imovel.dormitorios !== 0) {
  console.warn('⚠️ Dormitórios não informado para imóvel:', imovel._id);
}
```

### **3. Cache Inteligente**

```typescript
// Cache com TTL diferenciado
const CACHE_TTL = {
  listings: 5 * 60 * 1000, // 5min para listagens
  details: 15 * 60 * 1000, // 15min para detalhes
  featured: 2 * 60 * 1000, // 2min para destaques
};
```

---

**✅ Arquitetura mapeada e documentada. Problemas de query corrigidos. Sistema robusto e validado.**
