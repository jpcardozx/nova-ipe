# 🔍 Análise Crítica: Fluxo de Migração WordPress → Catálogo

**Data:** 10 de outubro de 2025  
**Status:** 🔴 **FLUXO DIFUSO E INCOMPLETO**

---

## 🎯 Problema Identificado

O usuário reportou: **"fluxo de migracao difuso em /wordpress-catalogo e faltando funcionalidades relevantes"**

### Investigação Realizada

1. ✅ **Não existe pasta `/wordpress-catalogo`** no projeto
2. ✅ **Existe sistema de migração WordPress → Lightsail** (documentado)
3. ✅ **Existe sistema de catálogo** (`/app/catalogo`)
4. ❌ **NÃO EXISTE integração WordPress → Next.js Catalog**
5. ❌ **Fluxo de migração WordPress → Sanity AUSENTE**

---

## 📊 Mapeamento do Cenário Atual

### 🗂️ O Que Existe

#### 1. Sistema WordPress (Legado - Lightsail)
```
Localização: AWS Lightsail (13.223.237.99)
Plugin: WPL (Realty)
Fotos: /wp-content/uploads/WPL/{id}/
Status: ✅ Migrado de Locaweb para Lightsail
```

**Documentação:**
- `README_MIGRACAO.md` - Guia Locaweb → Lightsail
- `EXECUTAR_MIGRACAO.md` - Scripts modular
- `docs/MIGRACAO_WORDPRESS_LIGHTSAIL.md` - Detalhes técnicos

**Scripts:**
- `scripts/migration-modular.sh` - 25 batches
- `scripts/backup-wordpress-full.sh`
- `scripts/lightsail-access.sh`

#### 2. Sistema Sanity CMS (Novo)
```
Localização: Sanity Studio
Schema: imovel (Property)
Status: ✅ Funcionando com Next.js
```

**Arquivos principais:**
- `lib/sanity/queries.ts` - GROQ queries
- `sanity/schemas/imovel.ts` - Schema
- Type: `ImovelClient` (src/types/imovel-client.ts)

#### 3. Catálogo Next.js
```
Localização: /app/catalogo
Componentes: ModularCatalog, PropertyCard, PropertyGrid
Status: ✅ Renderizando dados do Sanity
```

**Arquitetura:**
```
Sanity CMS → lib/sanity/queries.ts → ImovelClient → Catalog Components
```

#### 4. Helper de Imagens Lightsail
```typescript
// lib/helpers/imageHelpers.ts
// Conecta com: http://13.223.237.99/wp-content/uploads/WPL/{id}/
```

**Status:** ✅ Funcionando como fallback quando Sanity não tem imagem

---

### ❌ O Que Falta

#### 1. Sistema de Importação WordPress → Sanity
```
⚠️ AUSENTE: Script para migrar fichas WPL → Sanity
⚠️ AUSENTE: Mapeamento de campos WordPress → Schema Sanity
⚠️ AUSENTE: Validação de dados na importação
⚠️ AUSENTE: Controle de duplicatas
```

#### 2. Dashboard de Gerenciamento WordPress
```
⚠️ AUSENTE: /app/dashboard/wordpress-catalog/page.tsx (mencionado em docs)
⚠️ AUSENTE: Interface para revisar fichas WordPress
⚠️ AUSENTE: Aprovação/rejeição de imóveis
⚠️ AUSENTE: Migração seletiva (bulk operations)
```

#### 3. Sistema de Sincronização
```
⚠️ AUSENTE: Sync automático WordPress → Sanity
⚠️ AUSENTE: Webhooks para atualizações
⚠️ AUSENTE: Conflict resolution (mesmo imóvel em 2 sistemas)
```

#### 4. Migração de Fotos
```
⚠️ PARCIAL: Helper existe, mas sem importação em massa
⚠️ AUSENTE: Script para migrar fotos Lightsail → Sanity CDN
⚠️ AUSENTE: Cloudflare R2 integration (mencionado no STRATEGIC_PLAN)
```

#### 5. WordPress Catalog Service
```
⚠️ AUSENTE: lib/services/wordpress-catalog-service.ts (planejado)
⚠️ AUSENTE: CRUD operations no WordPress via API
⚠️ AUSENTE: SQL Schema no Supabase (wordpress_properties table)
```

---

## 🏗️ Arquitetura Planejada vs. Implementada

### Planejado (docs/STRATEGIC_PLAN.md)
```
┌──────────────┐
│  WordPress   │
│  (Lightsail) │
└──────┬───────┘
       │
       │ 1. Export WPL Data
       ▼
┌──────────────────────┐
│  Supabase            │
│  wordpress_properties│  ← Staging area
└──────┬───────────────┘
       │
       │ 2. Review & Approve
       ▼
┌──────────────────┐
│  Cloudflare R2   │  ← Photo storage
└──────┬───────────┘
       │
       │ 3. Final Migration
       ▼
┌──────────────┐
│  Sanity CMS  │
└──────┬───────┘
       │
       │ 4. Render
       ▼
┌──────────────┐
│  Next.js     │
│  Catalog     │
└──────────────┘
```

### Implementado (Atual)
```
┌──────────────┐
│  WordPress   │  ⚠️ Isolado, sem integração
│  (Lightsail) │
└──────────────┘

┌──────────────┐
│  Sanity CMS  │  ✅ Funcionando
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Next.js     │  ✅ Catalog renderizando
│  Catalog     │
└──────────────┘

lib/helpers/imageHelpers.ts  ⚠️ Fallback manual
```

**Gap:** Não há ponte WordPress → Sanity

---

## 📋 Funcionalidades Faltantes (Detalhadas)

### 🔴 Críticas (Bloqueadoras)

#### 1. WordPress Data Importer
**Status:** ❌ NÃO EXISTE  
**Impacto:** Sem isso, migração é 100% manual

**O que precisa:**
```typescript
// scripts/wordpress-importer/importer.ts (existe, mas vazio/incompleto)
// Deveria ter:
- Conexão com MySQL WordPress
- Query das tabelas wpl_properties
- Mapeamento para schema Sanity
- Bulk import com rate limiting
- Error handling e rollback
```

**Script esperado:**
```bash
npx tsx scripts/wordpress-importer/import.ts --source=lightsail --dry-run
```

#### 2. Dashboard WordPress Catalog
**Status:** ❌ NÃO EXISTE  
**Mencionado em:** `docs/STRATEGIC_PLAN.md`

**O que precisa:**
```
/app/dashboard/wordpress-catalog/
├── page.tsx              ← Main dashboard
├── components/
│   ├── PropertyReview.tsx
│   ├── BulkActions.tsx
│   └── MigrationStats.tsx
└── actions.ts            ← Server actions
```

**Funcionalidades esperadas:**
- Listar fichas WordPress
- Preview lado a lado (WP vs. Sanity)
- Aprovar/rejeitar em massa
- Status tracking (pending, approved, rejected, migrated)

#### 3. Supabase WordPress Tables
**Status:** ❌ SQL NÃO EXECUTADO  
**Arquivo existe:** `sql/wordpress_catalog_schema.sql`

**Problema:** Schema documentado mas não criado no Supabase

**Solução:**
```sql
-- Executar no Supabase SQL Editor
CREATE TABLE wordpress_properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wp_id BIGINT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  price NUMERIC(12,2),
  data JSONB,
  status TEXT DEFAULT 'pending',
  approved_at TIMESTAMP,
  migrated_to_sanity_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE wordpress_migration_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_id TEXT NOT NULL,
  wp_property_id BIGINT,
  status TEXT DEFAULT 'pending',
  error_log TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

### 🟡 Importantes (Funcionais)

#### 4. Photo Migration System
**Status:** 🟡 PARCIAL (helper existe, mass migration não)

**Existe:**
- `lib/helpers/imageHelpers.ts` - URL generator

**Falta:**
- Bulk download: Lightsail → Local
- Bulk upload: Local → Cloudflare R2 ou Sanity CDN
- Progress tracking
- Deduplication

**Script esperado:**
```typescript
// scripts/migrate-all-photos-to-r2.ts
// (arquivo existe mas incompleto)
```

#### 5. Field Mapping Configuration
**Status:** ❌ NÃO EXISTE

**Problema:** WordPress WPL tem campos diferentes do Sanity

**Mapeamento necessário:**
```typescript
// lib/wordpress/field-mapping.ts
export const WPL_TO_SANITY_MAPPING = {
  // WordPress WPL → Sanity imovel
  'post_title': 'titulo',
  'wpl_beds': 'dormitorios',
  'wpl_baths': 'banheiros',
  'wpl_price': 'preco',
  'wpl_location_text': 'bairro',
  'wpl_listing_type': 'finalidade', // Sale/Rent → Venda/Aluguel
  // ... etc
}
```

#### 6. Data Validation Layer
**Status:** ❌ NÃO EXISTE

**O que precisa:**
```typescript
// lib/wordpress/validators.ts
export function validateWordPressProperty(data: any) {
  // Verifica campos obrigatórios
  // Sanitiza HTML/scripts
  // Valida formatos (preço, CEP, etc)
  // Retorna: { valid: boolean, errors: string[] }
}
```

---

### 🟢 Nice-to-Have (Futuro)

#### 7. Real-time Sync
- Webhooks WordPress → Supabase
- Auto-approve regras (ex: preço > R$ 500k)
- Conflict resolution UI

#### 8. WordPress API Integration
- REST API WordPress
- CRUD operations from Next.js
- Direct publish (bypass Sanity)

#### 9. Advanced Features
- Duplicate detection (same address/price)
- Auto-categorization (ML)
- SEO optimization transfer

---

## 🎯 Plano de Ação Recomendado

### Phase 1: Fundação (2-3 dias) 🔴 CRÍTICO

**Objetivo:** Criar infraestrutura base para migração

#### Task 1.1: Criar WordPress Importer Script
```bash
# Arquivo: scripts/wordpress-importer/import-from-wp.ts
```

**Funcionalidades:**
- [x] Conexão MySQL WordPress ✅ (credenciais já existem)
- [ ] Query wpl_properties table
- [ ] Transform para ImovelClient type
- [ ] Validação de dados
- [ ] Export para JSON/CSV intermediário
- [ ] Dry-run mode

**Output esperado:**
```bash
npx tsx scripts/wordpress-importer/import-from-wp.ts --dry-run

# Output:
# 🔍 Conectando ao WordPress...
# ✅ 761 imóveis encontrados
# 📊 Estatísticas:
#    - Venda: 423
#    - Aluguel: 338
#    - Com fotos: 695
#    - Sem fotos: 66
# ✅ Dados exportados para: exports/wordpress-properties-2025-10-10.json
```

#### Task 1.2: Setup Supabase Tables
```bash
# Executar SQL no Supabase Dashboard
cat sql/wordpress_catalog_schema.sql
```

**Validação:**
```sql
SELECT COUNT(*) FROM wordpress_properties; -- Deve retornar 0
```

#### Task 1.3: Criar Field Mapping
```typescript
// lib/wordpress/field-mapping.ts
// Definir todos os campos WPL → Sanity
```

---

### Phase 2: Importação de Dados (1 dia)

#### Task 2.1: Importar WordPress → Supabase
```bash
npx tsx scripts/wordpress-importer/import-to-supabase.ts

# Importa 761 fichas para staging area
```

#### Task 2.2: Validação e Limpeza
```bash
npx tsx scripts/wordpress-importer/validate-data.ts

# Relatório de erros:
# - Campos faltantes
# - Preços inválidos
# - Endereços duplicados
```

---

### Phase 3: Dashboard de Revisão (2 dias)

#### Task 3.1: Criar Dashboard UI
```
/app/dashboard/wordpress-catalog/
├── page.tsx           ← Lista de propriedades
├── [id]/page.tsx      ← Review individual
└── components/
    ├── PropertyTable.tsx
    ├── ApprovalButtons.tsx
    └── PreviewComparison.tsx
```

**Features:**
- [x] Listagem com filtros (status, preço, tipo)
- [x] Bulk actions (aprovar/rejeitar selecionados)
- [x] Preview side-by-side
- [x] Edit inline antes de migrar

#### Task 3.2: Server Actions
```typescript
// app/dashboard/wordpress-catalog/actions.ts
export async function approveProperty(id: string) { }
export async function rejectProperty(id: string) { }
export async function bulkMigrate(ids: string[]) { }
```

---

### Phase 4: Migração Final (2 dias)

#### Task 4.1: Migração Supabase → Sanity
```bash
npx tsx scripts/wordpress-importer/migrate-to-sanity.ts --batch=50

# Migra propriedades aprovadas para Sanity
```

**Features:**
- Rate limiting (50 por vez)
- Progress tracking
- Error recovery
- Rollback capability

#### Task 4.2: Migração de Fotos
```bash
npx tsx scripts/migrate-photos-wordpress-to-sanity.ts

# Opção 1: Lightsail → Sanity CDN
# Opção 2: Lightsail → Cloudflare R2 → Sanity
```

---

## 📝 Arquivos a Criar

### Scripts (9 arquivos)

```
scripts/
├── wordpress-importer/
│   ├── import-from-wp.ts          ← Novo ✨
│   ├── import-to-supabase.ts      ← Já existe, completar
│   ├── validate-data.ts           ← Novo ✨
│   ├── migrate-to-sanity.ts       ← Novo ✨
│   └── field-mapping.ts           ← Novo ✨
├── migrate-photos-wp-to-sanity.ts ← Novo ✨
└── wordpress-stats.ts             ← Novo ✨ (analytics)
```

### Library (5 arquivos)

```
lib/
├── wordpress/
│   ├── connection.ts              ← Novo ✨
│   ├── field-mapping.ts           ← Novo ✨
│   ├── validators.ts              ← Novo ✨
│   └── transformers.ts            ← Novo ✨
└── services/
    └── wordpress-catalog-service.ts ← Novo ✨
```

### Dashboard (6 arquivos)

```
app/dashboard/wordpress-catalog/
├── page.tsx                       ← Novo ✨
├── [id]/
│   └── page.tsx                   ← Novo ✨
├── components/
│   ├── PropertyTable.tsx          ← Novo ✨
│   ├── ApprovalPanel.tsx          ← Novo ✨
│   └── MigrationStats.tsx         ← Novo ✨
└── actions.ts                     ← Novo ✨
```

### Types (2 arquivos)

```
types/
├── wordpress.ts                   ← Novo ✨
└── migration.ts                   ← Novo ✨
```

### SQL (1 arquivo - já existe, executar)

```
sql/
└── wordpress_catalog_schema.sql   ← Executar no Supabase
```

---

## 🚨 Decisões Arquiteturais Necessárias

### 1. Storage de Fotos
**Opções:**
- [ ] A) Manter no Lightsail + usar imageHelpers (atual)
- [ ] B) Migrar para Sanity CDN
- [ ] C) Migrar para Cloudflare R2 (planejado)

**Recomendação:** **B) Sanity CDN**
- Centraliza assets
- Processamento automático (resize, webp)
- CDN global

### 2. Staging Area
**Opções:**
- [ ] A) Supabase (planejado)
- [ ] B) JSON local
- [ ] C) Direto WordPress → Sanity

**Recomendação:** **A) Supabase**
- Permite revisão humana
- Versionamento
- Rollback fácil

### 3. Fluxo de Aprovação
**Opções:**
- [ ] A) Manual (admin aprova cada um)
- [ ] B) Semi-automático (regras + review exceções)
- [ ] C) Automático (importa tudo)

**Recomendação:** **B) Semi-automático**
- Auto-aprova: preço válido + fotos + campos completos
- Manual review: casos duvidosos

---

## 📊 Cronograma Realista

| Fase | Tempo | Status |
|------|-------|--------|
| **Phase 1: Fundação** | 2-3 dias | ⏳ Pendente |
| - WordPress Importer | 1 dia | ⏳ |
| - Supabase Setup | 30 min | ⏳ |
| - Field Mapping | 1 dia | ⏳ |
| **Phase 2: Importação** | 1 dia | ⏳ |
| - Import to Supabase | 4h | ⏳ |
| - Validação | 4h | ⏳ |
| **Phase 3: Dashboard** | 2 dias | ⏳ |
| - UI Components | 1 dia | ⏳ |
| - Server Actions | 1 dia | ⏳ |
| **Phase 4: Migração Final** | 2 dias | ⏳ |
| - Sanity Migration | 1 dia | ⏳ |
| - Photo Migration | 1 dia | ⏳ |
| **Total** | **7-8 dias** | |

---

## 🎯 Quick Wins (Começar Hoje)

### 1. Executar SQL no Supabase (5 min)
```bash
# Copiar conteúdo do arquivo
cat sql/wordpress_catalog_schema.sql

# Colar no Supabase SQL Editor
# https://app.supabase.com → SQL Editor
```

### 2. Criar WordPress Connection Helper (30 min)
```typescript
// lib/wordpress/connection.ts
import mysql from 'mysql2/promise'

export async function connectWordPress() {
  return mysql.createConnection({
    host: '13.223.237.99',
    user: 'bitnami',
    password: process.env.WP_DB_PASSWORD,
    database: 'bitnami_wordpress'
  })
}
```

### 3. Criar Simple Importer Script (1h)
```typescript
// scripts/wordpress-importer/simple-export.ts
// Apenas exporta para JSON sem transformação
```

---

## 💡 Sugestões Adicionais

### Melhorias no Sistema Atual

#### 1. Sanity Studio
```typescript
// sanity/schemas/imovel.ts
// Adicionar campo:
{
  name: 'sourceWordPressId',
  type: 'number',
  title: 'WordPress WPL ID',
  description: 'ID original do WPL (para rastreamento)'
}
```

#### 2. Catalog Component
```typescript
// app/catalogo/components/ModularCatalog.tsx
// Adicionar indicador de fonte:
{property.sourceWordPressId && (
  <Badge>Migrado do WPL</Badge>
)}
```

#### 3. Logs e Analytics
```typescript
// lib/analytics/migration-tracker.ts
export function trackMigrationEvent(
  event: 'import' | 'approve' | 'reject' | 'migrate',
  data: any
) {
  // Supabase analytics table
}
```

---

## 📚 Documentação Relacionada

### Existente
- ✅ `README_MIGRACAO.md` - Locaweb → Lightsail
- ✅ `EXECUTAR_MIGRACAO.md` - Scripts modular
- ✅ `docs/MIGRACAO_WORDPRESS_LIGHTSAIL.md` - Detalhes técnicos
- ✅ `docs/STRATEGIC_PLAN.md` - Arquitetura planejada
- ✅ `sql/wordpress_catalog_schema.sql` - Schema Supabase

### A Criar
- ⏳ `docs/WORDPRESS_TO_SANITY_MIGRATION.md` - Guia completo
- ⏳ `docs/FIELD_MAPPING_REFERENCE.md` - Mapa de campos
- ⏳ `docs/DASHBOARD_WORDPRESS_CATALOG_GUIDE.md` - Manual do dashboard

---

## 🔗 Links Úteis

### Credenciais
```bash
# WordPress Lightsail
Host: 13.223.237.99
SSH: bitnami@13.223.237.99 (key: ~/.ssh/LightsailDefaultKey-us-east-1.pem)
MySQL: localhost (dentro da instância)
DB: bitnami_wordpress
User: bn_wordpress
Pass: [ver em /home/bitnami/bitnami_credentials]

# Sanity
Project: [ver sanity.config.ts]
Dataset: production
Token: [ver .env.local SANITY_API_TOKEN]

# Supabase
URL: [ver .env.local NEXT_PUBLIC_SUPABASE_URL]
Key: [ver .env.local SUPABASE_SERVICE_ROLE_KEY]
```

### Comandos Rápidos
```bash
# Acessar WordPress
./scripts/lightsail-access.sh

# Dentro da instância, MySQL
sudo wp db cli

# Ver tabelas WPL
SHOW TABLES LIKE 'wpl_%';

# Contar imóveis
SELECT COUNT(*) FROM wpl_properties WHERE deleted=0;
```

---

## ✅ Checklist de Implementação

### Pré-requisitos
- [ ] Supabase SQL executado
- [ ] Credenciais WordPress confirmadas
- [ ] Acesso SSH Lightsail OK
- [ ] Node packages instalados (`mysql2`, `@sanity/client`)

### Phase 1: Fundação
- [ ] `lib/wordpress/connection.ts` criado
- [ ] `lib/wordpress/field-mapping.ts` criado
- [ ] `scripts/wordpress-importer/import-from-wp.ts` criado
- [ ] Teste de conexão com WordPress OK
- [ ] Export inicial funcionando

### Phase 2: Staging
- [ ] Import to Supabase funcionando
- [ ] Validação implementada
- [ ] 761 fichas importadas
- [ ] Relatório de erros gerado

### Phase 3: Dashboard
- [ ] `/app/dashboard/wordpress-catalog/page.tsx` criado
- [ ] Listagem funcionando
- [ ] Approve/Reject actions OK
- [ ] Bulk operations OK

### Phase 4: Migração
- [ ] Script Supabase → Sanity OK
- [ ] Migração de fotos OK
- [ ] Primeiros 10 imóveis migrados (teste)
- [ ] Migração completa executada

### Validação Final
- [ ] Catálogo mostrando novos imóveis
- [ ] Fotos carregando corretamente
- [ ] SEO metadata OK
- [ ] Performance aceitável
- [ ] Rollback plan documentado

---

## 🎉 Resultado Esperado

Após implementação completa:

```
✅ 761 imóveis do WordPress WPL migrados para Sanity
✅ Dashboard de gerenciamento funcional
✅ Fotos otimizadas e centralizadas
✅ Catálogo Next.js com dados completos
✅ Pipeline de migração reutilizável
✅ Documentação completa
```

---

**Criado por:** GitHub Copilot  
**Data:** 10 de outubro de 2025  
**Próximo passo:** Decidir prioridade e começar Phase 1
