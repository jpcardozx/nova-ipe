# 📋 Sistema de Importação WordPress → Sanity
## Hierarquização de Pastas e Fichas de Imóveis

---

## 🏗️ Arquitetura do Sistema

### 1. Estrutura de Diretórios

```
/home/jpcardozx/projetos/nova-ipe/
│
├── scripts/wordpress-importer/          # 🔧 Core do sistema de importação
│   ├── types.ts                         # Definições de tipos WPL → Sanity
│   ├── importer.ts                      # Engine de importação com checkpoint
│   ├── import.ts                        # CLI entry point (executável)
│   └── checkpoint.json                  # Estado persistido (criado em runtime)
│
├── app/dashboard/wordpress-catalog/     # 📊 Interface de gerenciamento
│   └── page.tsx                         # Dashboard UI (criado)
│
├── app/api/wordpress-import/            # 🔌 API Routes
│   ├── status/route.ts                  # GET - Status da importação
│   ├── start/route.ts                   # POST - Iniciar/continuar importação
│   └── reset/route.ts                   # POST - Resetar checkpoint
│
└── exports/imoveis/                     # 📦 Dados originais do WordPress
    └── imoveis-export-20251008/
        ├── database/
        │   └── imoveis-completo.sql     # 6.7MB, 761 properties
        ├── relatorio-imoveis.txt        # Lista formatada
        └── indice-pastas-fotos.txt      # Índice de 763 pastas
```

### 2. Dados no Servidor Lightsail (Não migrados ainda)

```
/opt/bitnami/wordpress/wp-content/uploads/WPL/
├── 1/
│   ├── img_foto01.jpg (original)
│   ├── img_foto02.jpg
│   └── thumb_img_foto01.jpg (thumbnail)
├── 2/
│   ├── img_foto01.jpg
│   └── ...
└── ... (763 pastas, 4.2GB total)
```

---

## 🗂️ Hierarquia de Dados

### Nível 1: Database SQL → Properties Array

```
wp_wpl_properties table (MySQL)
  ↓ parsing via RegEx
  ↓ /INSERT INTO `wp_wpl_properties` VALUES \(([\s\S]+?)\);/gi
  ↓
Array<WPLProperty> (761 items)
```

### Nível 2: WPL Schema → Sanity Schema

```typescript
WPLProperty {
  id: number                    → _wpId (referência original)
  mls_id: string               → codigoInterno
  listing: number (0-10)       → finalidade: 'Venda'|'Aluguel'|'Temporada'
  property_type: number (3-18) → tipoImovel: 'Casa'|'Apartamento'|etc
  location1_name: string       → estado
  location2_name: string       → cidade
  location3_name: string       → bairro
  field_42: string             → endereco (rua)
  field_312/313: string        → titulo
  field_308: string            → descricao
  price: string                → preco (number)
  bedrooms: string             → dormitorios (number)
  bathrooms: string            → banheiros (number)
  living_area: string          → areaUtil (number)
  pic_numb: string             → _wpPhotos (contagem para futuro)
}
  ↓ transformToSanity()
  ↓
SanityProperty {
  _type: 'imovel'
  titulo, slug, categoria, finalidade, tipoImovel
  descricao, dormitorios, banheiros, areaUtil, preco
  endereco, bairro, cidade, estado
  status: 'disponivel', codigoInterno
  _wpId, _wpPhotos                    # Campos especiais
}
```

### Nível 3: Batch Processing

```
761 properties
  ↓ split into batches
  ↓
Batch 1: Properties 1-30     (completedBatches: [1])
Batch 2: Properties 31-60    (completedBatches: [1, 2])
Batch 3: Properties 61-90    (completedBatches: [1, 2, 3])
...
Batch 26: Properties 751-761 (completedBatches: [1, 2, ..., 26])
```

### Nível 4: Sanity Documents

```
Sanity Studio Dataset
├── imovel (documents)
│   ├── imovel-123abc (ID gerado pelo Sanity)
│   │   ├── _wpId: 1 (referência WordPress)
│   │   ├── codigoInterno: "IPE001"
│   │   ├── titulo: "Casa com 3 Quartos..."
│   │   ├── slug: "casa-com-3-quartos"
│   │   ├── _wpPhotos: 11 (quantas fotos tem)
│   │   └── ... (outros campos)
│   ├── imovel-456def
│   │   ├── _wpId: 2
│   │   └── ...
│   └── ... (761 documents)
│
└── categoria (references)
    ├── categoria-xyz
    └── ...
```

---

## 🔄 Fluxo de Importação

### Phase 1: Property Records (ATUAL)

```
1. Load SQL file
2. Parse INSERT statements → Array<WPLProperty>
3. Load checkpoint (or create new)
4. For each property:
   a. Check if already exists (_wpId query)
   b. Transform WPL → Sanity
   c. Create document in Sanity
   d. Save checkpoint
5. Process in batches of 30
6. Log errors with property ID + message
```

### Phase 2: Photo Processing (FUTURO)

```
1. Query Sanity: *[_type == "imovel" && _wpPhotos > 0]
2. For each property with photos:
   a. Download WPL folder from Lightsail (rsync)
   b. Upload photos to Sanity assets (5 at a time)
   c. Update property: imagem (main), galeria (array)
   d. Save photo checkpoint
3. Delete local photo cache
```

---

## 🛡️ Sistema de Segurança

### Checkpoint Structure

```json
{
  "lastProcessedId": 42,
  "totalProcessed": 42,
  "totalFailed": 2,
  "errors": [
    {
      "id": 15,
      "error": "Invalid price value",
      "timestamp": "2025-01-08T10:30:00Z"
    }
  ],
  "completedBatches": [1],
  "startedAt": "2025-01-08T10:00:00Z",
  "lastUpdatedAt": "2025-01-08T10:31:30Z"
}
```

### Duplicate Detection

```typescript
// Query antes de criar cada documento
const existing = await client.fetch(
  `*[_type == "imovel" && _wpId == $wpId][0]._id`,
  { wpId: wplProperty.id }
)

if (existing) {
  console.log(`Property ${wplProperty.id} already exists, skipping...`)
  return
}
```

### Error Recovery

```
Erro no imóvel 42
  ↓ capturado pelo try/catch
  ↓ salvo em checkpoint.errors[]
  ↓ totalFailed++
  ↓ continua próximo imóvel
  
Checkpoint salvo após CADA imóvel
  ↓ se script quebrar
  ↓ próxima execução continua do lastProcessedId
  ↓ duplicados ignorados automaticamente
```

---

## 📊 Mapeamento de Tipos

### Property Types (WPL → Sanity)

```typescript
const PROPERTY_TYPE_MAPPINGS = {
  3: 'Apartamento',   // Apartment
  6: 'Apartamento',   // Flat
  7: 'Casa',          // House
  10: 'Comercial',    // Office
  13: 'Comercial',    // Commercial Property
  15: 'Outro',        // Land
  16: 'Outro',        // Penthouse
  18: 'Comercial',    // Store/Shop
  0: 'Outro'          // Unknown/Other
}
```

### Listing Types (WPL → Sanity)

```typescript
const LISTING_TYPE_MAPPINGS = {
  9: 'Venda',         // For Sale (Compra e Venda)
  10: 'Aluguel',      // For Rent (Aluguel)
  0: 'Venda'          // Default
}
```

---

## 🎯 Como Usar o Sistema

### 1. Via CLI (Desenvolvimento/Debug)

```bash
cd /home/jpcardozx/projetos/nova-ipe

# Verificar variáveis de ambiente
echo $NEXT_PUBLIC_SANITY_PROJECT_ID
echo $NEXT_PUBLIC_SANITY_DATASET
echo $SANITY_API_TOKEN

# Executar importação
tsx scripts/wordpress-importer/import.ts

# Monitorar progresso
watch -n 1 cat scripts/wordpress-importer/checkpoint.json
```

### 2. Via Dashboard (Produção/UI)

```
1. Acesse: http://localhost:3000/dashboard/wordpress-catalog
2. Clique em "Iniciar Importação"
3. Acompanhe progresso em tempo real
4. Veja erros e retry se necessário
5. Download de relatórios
```

---

## 📈 Estrutura de Relatórios

### Status Dashboard

```
┌─────────────────────────────────────┐
│  Total: 761                         │
│  Importados: 42 ✓                   │
│  Erros: 2 ✗                         │
│  Restantes: 719 ⏳                   │
├─────────────────────────────────────┤
│  Progresso: [████░░░░░░] 5.5%      │
└─────────────────────────────────────┘
```

### Error Log

```
Imóvel ID: 15
Erro: Invalid price value
Timestamp: 08/01/2025 10:30:00
---
Imóvel ID: 28
Erro: Missing title
Timestamp: 08/01/2025 10:31:00
```

---

## 🔮 Roadmap de Fases

### ✅ Phase 1: Core Import System
- [x] Type definitions (WPL → Sanity)
- [x] SQL parser with escape handling
- [x] Checkpoint system
- [x] Duplicate detection
- [x] Batch processing (30 properties)
- [x] Error logging
- [x] CLI script
- [x] Dashboard UI
- [x] API routes (status, start, reset)

### 🔜 Phase 2: Property Import Execution
- [ ] Executar primeira importação (batch 1-30)
- [ ] Validar dados no Sanity Studio
- [ ] Verificar slugs únicos
- [ ] Testar duplicate detection (re-run)
- [ ] Analisar erros e ajustar parser se necessário
- [ ] Completar 761 properties

### 📅 Phase 3: Category Management
- [ ] Criar ou mapear categorias no Sanity
- [ ] Atualizar transformToSanity() com categoria reference
- [ ] Re-processar properties sem categoria

### 📸 Phase 4: Photo Processing
- [ ] Script de download de fotos (Lightsail → local)
- [ ] Upload de fotos para Sanity assets
- [ ] Associação imagem + galeria a cada property
- [ ] Photo checkpoint system
- [ ] Batch processing (5-10 fotos por vez)

### 🎨 Phase 5: UI Enhancements
- [ ] Preview de properties antes de publicar
- [ ] Bulk actions (publicar, deletar, editar)
- [ ] Export de relatórios (CSV, JSON)
- [ ] Filtros e busca de properties
- [ ] Photo management UI

---

## 🚨 Troubleshooting

### Erro: "Cannot find checkpoint.json"
**Causa:** Primeira execução, checkpoint ainda não existe  
**Solução:** Normal! Checkpoint é criado automaticamente na primeira property processada

### Erro: "Sanity API Token missing"
**Causa:** Variável de ambiente não configurada  
**Solução:** 
```bash
export SANITY_API_TOKEN="seu-token-aqui"
# ou adicione no .env.local
```

### Erro: "Property already exists"
**Causa:** Duplicate detection funcionando corretamente  
**Solução:** Isso é esperado! Properties já importadas são ignoradas

### Importação travou
**Causa:** Erro não capturado ou problema de rede  
**Solução:** 
1. Verifique checkpoint.json (último ID processado)
2. Re-execute o script (continuará do ponto correto)
3. Analise errors[] no checkpoint

### Muitos erros de parsing
**Causa:** Caracteres especiais no SQL ou estrutura inesperada  
**Solução:**
1. Verifique exports/imoveis/database/imoveis-completo.sql
2. Ajuste regex em parsePropertiesFromSQL()
3. Melhore cleanString() com mais casos

---

## 📚 Referências Técnicas

### Arquivos Chave

1. **Type Definitions**: `scripts/wordpress-importer/types.ts`
   - Interfaces: WPLProperty, SanityProperty, ImportCheckpoint
   - Mappings: PROPERTY_TYPE_MAPPINGS, LISTING_TYPE_MAPPINGS

2. **Core Engine**: `scripts/wordpress-importer/importer.ts`
   - Functions: parsePropertiesFromSQL, transformToSanity, importBatch, runImport
   - Safety: loadCheckpoint, saveCheckpoint, propertyExists

3. **CLI Entry**: `scripts/wordpress-importer/import.ts`
   - Environment validation
   - ASCII art header
   - Error handling

4. **Dashboard UI**: `app/dashboard/wordpress-catalog/page.tsx`
   - Real-time status
   - Progress visualization
   - Error log display

5. **API Routes**: `app/api/wordpress-import/*`
   - status/route.ts: GET checkpoint state
   - start/route.ts: POST trigger import
   - reset/route.ts: POST delete checkpoint

### Sanity Schema

**File**: `studio/schemas/imovel.ts`

Campos principais:
- `titulo`: string (required)
- `slug`: slug (generated)
- `categoria`: reference to 'categoria'
- `finalidade`: 'Venda' | 'Aluguel' | 'Temporada'
- `tipoImovel`: 'Casa' | 'Apartamento' | 'Terreno' | 'Comercial' | 'Outro'
- `descricao`: text
- `dormitorios`, `banheiros`, `areaUtil`, `vagas`: number
- `preco`: number
- `endereco`, `bairro`, `cidade`, `estado`: string
- `documentacaoOk`, `aceitaFinanciamento`: boolean
- `imagem`: image
- `galeria`: array of images
- `status`: 'disponivel' | 'reservado' | 'vendido'
- `codigoInterno`: string (unique)
- `_wpId`: number (custom field - referência WordPress)
- `_wpPhotos`: number (custom field - contagem de fotos)

---

## 🎓 Próximos Passos Recomendados

1. **Testar Sistema em Staging** (se disponível)
   ```bash
   # Usar dataset de teste
   export NEXT_PUBLIC_SANITY_DATASET="staging"
   tsx scripts/wordpress-importer/import.ts
   ```

2. **Importar Primeiro Batch (30 properties)**
   ```bash
   # Executar via CLI
   tsx scripts/wordpress-importer/import.ts
   
   # Ou via dashboard
   # http://localhost:3000/dashboard/wordpress-catalog
   # Clicar em "Iniciar Importação"
   ```

3. **Validar Dados no Sanity Studio**
   ```bash
   # Abrir Sanity Studio
   npm run sanity
   
   # Verificar:
   # - 30 novos documents com _type: 'imovel'
   # - Campo _wpId presente (1-30)
   # - Slugs únicos
   # - Tipos mapeados corretamente
   # - Preços convertidos (string → number)
   ```

4. **Analisar Erros e Ajustar**
   ```bash
   # Ver checkpoint
   cat scripts/wordpress-importer/checkpoint.json
   
   # Ajustar parser se necessário
   # Re-executar import (continuará do ponto correto)
   ```

5. **Escalar para 761 Properties**
   ```bash
   # Após validação do batch 1
   # Continuar importação até completar
   # Monitorar checkpoint.json
   # Verificar errors[] periodicamente
   ```

6. **Planejar Photo Processing**
   ```bash
   # Após 761 properties importadas
   # Criar script de photo upload
   # Testar com 1-2 properties primeiro
   # Escalar gradualmente
   ```

---

**Documentação criada em:** 08/01/2025  
**Versão do sistema:** 1.0.0  
**Status:** Core Import System completo, pronto para execução  
**Próxima milestone:** Executar primeira importação de 30 properties
