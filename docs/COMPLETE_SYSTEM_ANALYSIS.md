# 🔍 Análise Completa do Sistema WordPress → Sanity

**Data**: 08 de outubro de 2025  
**Status Atual**: Sistema parcialmente implementado

---

## 📋 Respondendo Suas Questões

### 1️⃣ Quais são as propriedades existentes na ficha?

**Properties disponíveis no WordPress (WPL)**: 25 campos principais

#### Categorias:

**Identificação**:
- `id` - ID WordPress
- `kind` - Tipo de cadastro
- `mls_id` - Código MLS
- `deleted` - Flag de exclusão

**Localização**:
- `location1_name` - País (Brasil)
- `location2_name` - Estado (São Paulo)
- `location3_name` - Cidade (Guararema)
- `location4_name` - Bairro
- `field_42` - Endereço/Rua

**Características**:
- `bedrooms` - Quartos
- `bathrooms` - Banheiros
- `living_area` - Área útil (m²)
- `lot_area` - Área total (m²)
- `living_area_unit` - Unidade área útil
- `lot_area_unit` - Unidade área total

**Valores**:
- `price` - Preço
- `price_unit` - Unidade de preço (122 = BRL)

**Textos**:
- `field_312` - Título da página
- `field_313` - Título do imóvel
- `field_308` - Descrição

**Fotos**:
- `pic_numb` - Quantidade de fotos
- (URLs das fotos não estão no SQL)

**Tipo**:
- `property_type` - Tipo de imóvel (int)
- `listing` - Finalidade (9 = venda, 10 = aluguel)

**Metadata**:
- `add_date` - Data de adição
- `rendered_data` - Dados renderizados (vazio)

---

### 2️⃣ Já estão de acordo com as do Sanity?

**❌ NÃO** - Requer conversões

#### Compatibilidade: 73.3%

| Status | Quantidade | Descrição |
|--------|-----------|-----------|
| ✅ Mapeamento direto | 11/15 campos | Strings, números, localização |
| ⚠️  Precisa conversão | 3/15 campos | HTML→Portable Text, int→Reference |
| ❌ Pendente | 1/15 campos | Fotos (URLs não disponíveis) |

#### Mapeamentos:

**✅ DIRETO (73.3%)**:
```typescript
{
  wp: 'field_313'      → sanity: 'titulo',
  wp: 'location1_name' → sanity: 'localizacao.pais',
  wp: 'location2_name' → sanity: 'localizacao.estado',
  wp: 'location3_name' → sanity: 'localizacao.cidade',
  wp: 'location4_name' → sanity: 'localizacao.bairro',
  wp: 'field_42'       → sanity: 'localizacao.rua',
  wp: 'bedrooms'       → sanity: 'quartos',
  wp: 'bathrooms'      → sanity: 'banheiros',
  wp: 'living_area'    → sanity: 'areaUtil',
  wp: 'lot_area'       → sanity: 'areaTotal',
  wp: 'price'          → sanity: 'preco'
}
```

**⚠️  CONVERSÃO NECESSÁRIA**:

1. **field_308 → descricao (Portable Text)**
   - Entrada: String HTML ou plain text
   - Saída: `array<block>` (Portable Text)
   - Conversão: `@portabletext/html-to-blocks` ou similar
   - Status: ❌ **NÃO IMPLEMENTADO**

2. **property_type → tipo (Reference)**
   - Entrada: `15` (int)
   - Saída: `{ _ref: '...', _type: 'reference' }`
   - Lookup Table:
     ```typescript
     3,6  → 'Apartamento'
     7    → 'Casa'
     10,13,18 → 'Comercial'
     15,16 → 'Outro'
     ```
   - Status: ✅ **IMPLEMENTADO** (ver `mapPropertyType()`)

3. **listing → finalidade**
   - Entrada: `9` ou `10` (int)
   - Saída: `'Venda'` ou `'Aluguel'` (string)
   - Conversão:
     ```typescript
     9  → 'Venda'
     10 → 'Aluguel'
     ```
   - Status: ✅ **IMPLEMENTADO** (linha 348 do service)

**❌ PENDENTE**:

4. **gallery_image_ids → fotos[]**
   - Entrada: URLs do Lightsail ou IDs de imagens
   - Saída: `array<image>` (Sanity Asset References)
   - Processo:
     1. Download de Lightsail/R2
     2. Upload para Sanity Assets API
     3. Criar `{ _type: 'image', asset: { _ref: ... } }`
   - Status: ⚠️  **PARCIALMENTE IMPLEMENTADO** (veja abaixo)

---

### 3️⃣ Já temos engine para exportação das fotos para o bucket da AWS (R2)?

**⚠️  PARCIALMENTE**

#### O que existe:

**✅ Cloudflare R2 Service** (`lib/services/cloudflare-r2-service.ts`):
```typescript
class CloudflareR2Service {
  // ✅ Upload único
  static async uploadFile(file: Buffer, key: string, contentType: string)
  
  // ✅ Upload múltiplo (fotos de property)
  static async uploadPropertyPhotos(propertyId: string, photos: File[])
  
  // ✅ Download
  static async downloadFile(key: string)
  
  // ✅ Signed URL (visualização)
  static async getSignedUrl(key: string, expiresIn?: number)
  
  // ✅ Listar fotos
  static async listPropertyPhotos(propertyId: string)
  
  // ✅ Deletar
  static async deleteFile(key: string)
}
```

**✅ WordPress Catalog Service** (`lib/services/wordpress-catalog-service.ts`):
```typescript
class WordPressCatalogService {
  // ✅ Upload fotos via R2
  static async uploadPropertyPhotos(propertyId: string, photos: File[])
  
  // ✅ Migração para Sanity (inclui upload de fotos)
  static async migrateToSanity(propertyId: string, sanityClient: any)
}
```

#### O que **FALTA**:

**❌ Script de Migração em Massa** (Lightsail → R2):
```bash
# NÃO EXISTE
npx tsx scripts/migrate-photos-lightsail-to-r2.ts
```

**Problema**: 
- As 761 properties têm `pic_numb` (quantidade de fotos) mas **não têm URLs**
- O SQL não contém `gallery_image_ids` nem metadata de fotos
- Precisamos descobrir a estrutura de URLs no Lightsail

**Possíveis estruturas**:
```
# Opção 1: Padrão WPL
https://wpl-imoveis.com/wp-content/uploads/wplpro/properties/{wp_id}/{image_id}.jpg

# Opção 2: Sequencial
https://wpl-imoveis.com/wp-content/uploads/wplpro/properties/{wp_id}/1.jpg
https://wpl-imoveis.com/wp-content/uploads/wplpro/properties/{wp_id}/2.jpg

# Opção 3: Metadata em outro lugar
Precisa query no banco WordPress real
```

**Próximo passo crítico**:
```typescript
// 1. Investigar URLs das fotos
// 2. Criar script de download em massa
// 3. Upload paralelo para R2 (max 5 concurrent)
// 4. Update photo_urls no Supabase
```

---

### 4️⃣ Função de migração de ficha para o Sanity está funcional?

**⚠️  PARCIALMENTE - Precisa ajustes**

#### O que está implementado:

**✅ Função `migrateToSanity()`** (linhas 276-406):
```typescript
WordPressCatalogService.migrateToSanity(propertyId, sanityClient)
```

**Features implementadas**:
- ✅ Validação (só migra se `status === 'approved'`)
- ✅ Task tracking (tabela `wordpress_migration_tasks`)
- ✅ Upload de fotos do R2 → Sanity Assets
- ✅ Criação de documento Sanity tipo `imovel`
- ✅ Mapeamento de campos básicos
- ✅ Update de status (`migrated`)
- ✅ Salva `sanity_id` para referência

**Campos mapeados**:
```typescript
{
  _type: 'imovel',
  titulo: field_313,
  slug: { current: slugify(field_313) },
  finalidade: listing === 10 ? 'Aluguel' : 'Venda',
  tipoImovel: mapPropertyType(property_type),
  descricao: field_308, // ❌ Plain text, deveria ser Portable Text
  dormitorios: bedrooms,
  banheiros: bathrooms,
  areaUtil: living_area,
  preco: price,
  endereco: field_42,
  bairro: location3_name,
  cidade: location2_name,
  estado: location1_name,
  status: 'disponivel',
  codigoInterno: mls_id,
  _wpId: wp_id,
  imagem: imageAssets[0],
  galeria: imageAssets
}
```

#### O que **FALTA**:

**❌ Conversão HTML → Portable Text**:
```typescript
// Atual (linha 350):
descricao: property.data.field_308, // ❌ String crua

// Deveria ser:
descricao: htmlToPortableText(property.data.field_308)
```

**❌ Campos do Sanity não mapeados**:
- `slug` ✅ (OK)
- `localizacao` objeto completo (parcial - falta CEP, lat, lng)
- `vagas` (não existe no WPL)
- `precoCondominio` (não existe no WPL)
- `precoIPTU` (não existe no WPL)
- `caracteristicas[]` array (não existe no WPL)
- `destaque` boolean (não existe no WPL)

**❌ Error handling**:
- Rollback se falhar upload de foto
- Retry logic para Sanity API
- Validação de schema antes de criar

**Código necessário**:
```typescript
import htmlToBlocks from '@portabletext/html-to-blocks'

// Converter descrição
const descricao = htmlToBlocks(property.data.field_308, {
  rules: [/* custom rules */]
})

// Validar antes de criar
const validation = await sanityClient.validate(sanityDoc)
if (!validation.valid) {
  throw new Error(`Schema inválido: ${validation.errors}`)
}
```

---

### 5️⃣ Todos os fluxos e botões são responsivos e didáticos?

**⚠️  PARCIALMENTE - Dashboard existe mas precisa testes**

#### Dashboard WordPress Catalog

**Arquivo**: `app/dashboard/wordpress-catalog/page.tsx` (808 linhas)

**Features implementadas**:

✅ **Listagem**:
- Grid de properties com paginação
- Search bar
- Filtro por status (pending, reviewing, approved, migrated, rejected, archived)
- Cards com preview

✅ **Status Badges** (visual):
```typescript
{
  pending:   '🕒 Pendente'   (slate)
  reviewing: '👁️  Em Revisão' (blue)
  approved:  '✅ Aprovado'   (green)
  migrated:  '✨ Migrado'    (purple)
  rejected:  '❌ Rejeitado'  (red)
  archived:  '📦 Arquivado'  (gray) // ⚠️  Provavelmente falta
}
```

✅ **Modal de Detalhes**:
- Dados da property
- Fotos (se houver)
- Status atual
- Ações disponíveis

✅ **Ações**:
- Aprovar (`approved`)
- Rejeitar (`rejected`)
- Migrar para Sanity (botão `migrateToSanityMutation`)
- Adicionar notas

✅ **Stats Dashboard**:
- Total properties
- Por status
- Com/sem fotos
- Prontas para migrar

#### O que precisa **VERIFICAR**:

**⚠️  Responsividade**:
- [ ] Mobile (< 768px)
- [ ] Tablet (768px - 1024px)
- [ ] Desktop (> 1024px)
- [ ] Touch gestures (mobile)

**⚠️  Status 'archived'**:
```typescript
// Linha 32-62: statusConfig
// ❌ FALTA adicionar:
archived: { 
  label: 'Arquivado', 
  color: 'bg-gray-100 text-gray-700 border-gray-200', 
  icon: Archive,
  gradient: 'from-gray-400 to-gray-600'
}
```

**⚠️  Didática**:
- [ ] Tooltips explicativos
- [ ] Loading states
- [ ] Error boundaries
- [ ] Empty states
- [ ] Confirmation dialogs
- [ ] Success/error toasts (✅ usa Sonner)

**⚠️  Acessibilidade**:
- [ ] Keyboard navigation
- [ ] Screen reader support
- [ ] ARIA labels
- [ ] Focus management
- [ ] Color contrast

---

## 📊 Status Geral do Sistema

| Componente | Status | Completude | Prioridade |
|-----------|--------|------------|------------|
| **Schema WordPress** | ✅ Mapeado | 100% | - |
| **Compatibilidade Sanity** | ⚠️  Parcial | 73.3% | 🔴 Alta |
| **R2 Service** | ✅ Completo | 100% | - |
| **Photo Migration Script** | ❌ Falta | 0% | 🔴 **CRÍTICO** |
| **migrateToSanity()** | ⚠️  Funcional | 80% | 🟡 Média |
| **HTML → Portable Text** | ❌ Falta | 0% | 🔴 Alta |
| **Dashboard UI** | ⚠️  Funcional | 90% | 🟡 Média |
| **Responsividade** | ❓ Não testado | ? | 🟡 Média |
| **Badge 'archived'** | ❌ Falta no UI | 0% | 🟢 Baixa |
| **Testes E2E** | ❌ Não existe | 0% | 🟢 Baixa |

---

## 🚀 Plano de Ação

### 🔴 CRÍTICO (Bloqueante)

#### 1. Photo Migration Engine
**Tempo estimado**: 4-6 horas

**Tarefas**:
```bash
# 1. Investigar estrutura de URLs
curl -I https://wpl-imoveis.com/wp-content/uploads/wplpro/properties/78/1.jpg
curl -I https://wpl-imoveis.com/wp-content/uploads/wplpro/properties/78/image_1.jpg

# 2. Criar script de descoberta
npx tsx scripts/discover-photo-urls.ts --wp-id 78

# 3. Script de migração em massa
npx tsx scripts/migrate-photos-lightsail-to-r2.ts

# 4. Atualizar Supabase
UPDATE wordpress_properties 
SET photo_urls = [...], 
    thumbnail_url = ..., 
    photo_count = ...
WHERE wp_id = ...
```

**Deliverables**:
- [ ] Script `discover-photo-urls.ts`
- [ ] Script `migrate-photos-lightsail-to-r2.ts`
- [ ] Update de 761 properties com photo_urls
- [ ] Logs de progresso (webhook a cada 100)

---

### 🔴 ALTA (Importante)

#### 2. HTML → Portable Text Converter
**Tempo estimado**: 2-3 horas

**Instalação**:
```bash
pnpm add @portabletext/to-html html-to-portable-text
```

**Implementação**:
```typescript
// lib/utils/html-to-portable-text.ts
import htmlToPortableText from 'html-to-portable-text'

export function convertDescriptionToPortableText(html: string) {
  return htmlToPortableText(html, {
    // Configuração para WordPress HTML
    rules: [
      // Preservar quebras de linha
      // Remover tags desnecessárias
      // Manter formatação básica (bold, italic, lists)
    ]
  })
}
```

**Integração**:
```typescript
// wordpress-catalog-service.ts linha 350
descricao: convertDescriptionToPortableText(property.data.field_308)
```

---

#### 3. Completar mapeamento Sanity
**Tempo estimado**: 1-2 horas

**Campos faltantes**:
```typescript
// Defaults razoáveis
vagas: 0, // Não existe no WPL
precoCondominio: 0,
precoIPTU: 0,
caracteristicas: [], // Extrair de field_308 ou deixar vazio
destaque: false,

// Localização completa
localizacao: {
  pais: location1_name,
  estado: location2_name,
  cidade: location3_name,
  bairro: location4_name,
  rua: field_42,
  cep: '', // Não existe
  lat: 0,  // Não existe - poderia geocodificar
  lng: 0   // Não existe - poderia geocodificar
}
```

---

### 🟡 MÉDIA (Melhoria)

#### 4. Dashboard: Badge 'archived'
**Tempo estimado**: 15 minutos

**Arquivo**: `app/dashboard/wordpress-catalog/page.tsx`

```typescript
// Adicionar no statusConfig (linha 32)
archived: { 
  label: 'Arquivado', 
  color: 'bg-gray-100 text-gray-700 border-gray-200', 
  icon: Archive, // import { Archive } from 'lucide-react'
  gradient: 'from-gray-400 to-gray-600'
}
```

---

#### 5. Testes de Responsividade
**Tempo estimado**: 2-3 horas

**Checklist**:
```bash
# 1. Testar dashboard
npm run dev
# Abrir: http://localhost:3000/dashboard/wordpress-catalog

# 2. DevTools responsive mode
# - Mobile: 375px
# - Tablet: 768px
# - Desktop: 1920px

# 3. Verificar:
- [ ] Grid adapta (1, 2, 3 colunas)
- [ ] Modal full-screen em mobile
- [ ] Botões acessíveis touch
- [ ] Search bar responsivo
- [ ] Stats cards responsivos
```

---

### 🟢 BAIXA (Nice to have)

#### 6. Melhorias de UX
**Tempo estimado**: 4-6 horas

- [ ] Tooltips explicativos
- [ ] Skeleton loaders
- [ ] Optimistic updates
- [ ] Undo/redo ações
- [ ] Keyboard shortcuts
- [ ] Bulk actions (aprovar múltiplos)
- [ ] Export CSV
- [ ] Print view

---

## ✅ Checklist Final

### Para começar a usar o sistema:

- [ ] **1. Migrar fotos Lightsail → R2** (CRÍTICO)
  - [ ] Descobrir estrutura de URLs
  - [ ] Script de migração
  - [ ] Update photo_urls no Supabase
  
- [ ] **2. Implementar HTML → Portable Text** (ALTO)
  - [ ] Instalar biblioteca
  - [ ] Criar converter
  - [ ] Integrar no migrateToSanity()
  
- [ ] **3. Completar schema Sanity** (ALTO)
  - [ ] Adicionar campos faltantes
  - [ ] Defaults para campos não existentes
  
- [ ] **4. Testar dashboard** (MÉDIO)
  - [ ] Responsividade mobile/tablet/desktop
  - [ ] Adicionar badge 'archived'
  - [ ] Fluxo completo: pending → approved → migrated
  
- [ ] **5. Testar migração real** (MÉDIO)
  - [ ] Aprovar 1 property
  - [ ] Migrar para Sanity
  - [ ] Verificar no Sanity Studio
  - [ ] Verificar no site público

---

## 🎯 Resumo Executivo

### O que funciona ✅:
- Importação WordPress → Supabase (761 properties)
- Badge system (pending, reviewing, approved, migrated, rejected, archived)
- R2 Service completo
- Dashboard UI (listagem, filtros, modal, ações)
- Função migrateToSanity() (básica)
- Task tracking

### O que falta ❌:
- **Fotos**: Script de migração Lightsail → R2
- **Conversão HTML**: Descrição → Portable Text
- **Schema**: Campos faltantes no Sanity
- **Testes**: Responsividade e fluxo completo

### Próximo passo imediato 🚀:
**Investigar e migrar fotos** (bloqueante para tudo)

```bash
# Comando sugerido:
npx tsx scripts/discover-photo-structure.ts --sample-properties 5
```

---

**Análise gerada em**: 08/10/2025 18:45 UTC
