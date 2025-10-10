# 🚀 WordPress → Supabase/R2 Migration - Status Final

## ✅ COMPLETADO

### 1. Infraestrutura
- ✅ Cloudflare R2 configurado e testado
- ✅ Bucket `wpl-realty` acessível
- ✅ Supabase credenciais válidas
- ✅ Supabase CLI instalado (v2.48.3)
- ✅ Projeto linked: `ifhfpaehnjpdwdocdzwd`

### 2. Scripts e Ferramentas
- ✅ SQL Parser funcionando (141 properties encontradas)
- ✅ Migration criada: `supabase/migrations/20251008_wordpress_catalog.sql`
- ✅ Import script pronto: `scripts/import-to-supabase-correct.ts`

## ⏳ PENDENTE - Ação Manual Necessária

### Criar Tabelas no Supabase (1 minuto)

**Por que manual?**
- Supabase REST API não suporta SQL direto
- `supabase db push` tem timeout em connection pooler
- Solução: SQL Editor no Dashboard (mais rápido e confiável)

**Como fazer:**

1️⃣  **Acesse o SQL Editor**
```
https://supabase.com/dashboard/project/ifhfpaehnjpdwdocdzwd/sql/new
```

2️⃣  **Cole o SQL**
```bash
cat supabase/migrations/20251008_wordpress_catalog.sql
```

Ou copie diretamente do arquivo:
`supabase/migrations/20251008_wordpress_catalog.sql` (6.4 KB)

3️⃣  **Execute (RUN)**

4️⃣  **Verifique**
```bash
npx tsx scripts/check-existing-imports.ts
```

Deve mostrar:
```
✅ Total registros na tabela: 0
💡 Tabela existe mas está vazia
```

## 📊 Schema Criado

### Tabela `wordpress_properties`
```sql
- id (UUID, PK)
- wpl_id (INTEGER, UNIQUE) -- ID original do WordPress
- data (JSONB) -- Dados completos
- status (TEXT) -- pending, reviewing, approved, migrated, rejected
- photo_count (INTEGER)
- photo_urls (TEXT[])
- thumbnail_url (TEXT)
- created_at, updated_at (TIMESTAMPTZ)
- reviewed_by, reviewed_at, notes
- migrated_at, sanity_id
```

### Tabela `wordpress_migration_tasks`
```sql
- id (UUID, PK)
- property_id (UUID, FK)
- status (TEXT) -- queued, processing, completed, failed
- progress (INTEGER 0-100)
- error_message (TEXT)
- created_at, started_at, completed_at (TIMESTAMPTZ)
```

**Recursos:**
- ✅ Índices otimizados
- ✅ RLS habilitado
- ✅ Políticas para service_role
- ✅ Referential integrity

## 🎯 Próximos Passos (Após Criação das Tabelas)

### Fase 1: Import Inicial (5 min)
```bash
# 1. Importar 141 properties
npx tsx scripts/import-to-supabase-correct.ts

# 2. Verificar
npx tsx scripts/check-existing-imports.ts

# Esperado: 141/141 properties importadas
```

### Fase 2: Type Generation (1 min)
```bash
# Gerar types TypeScript do schema Supabase
npx supabase gen types typescript --linked > types/supabase.ts

# Atualizar imports no código
```

### Fase 3: Migração de Fotos (30-45 min)
```bash
# Migrar ~4GB de fotos do Lightsail para R2
npx tsx scripts/migrate-all-photos-to-r2.ts

# Monitor progress
watch -n 10 'npx tsx scripts/check-r2-stats.ts'
```

### Fase 4: Dashboard Testing (10 min)
```bash
# Start dev server
npm run dev

# Acesse
http://localhost:3000/dashboard/wordpress-catalog
```

**Testes:**
- [ ] Listagem de properties
- [ ] Filtros (status, busca)
- [ ] Modal de detalhes
- [ ] Workflow buttons (Aprovar/Rejeitar)
- [ ] Visualização de fotos do R2

## 🔌 Webhooks Estratégicos (Após Import)

### 1. Property Status Change Webhook
**Trigger:** `UPDATE wordpress_properties WHERE status changed`
**Objetivo:** Notificar equipe quando property é aprovada/rejeitada
**Payload:**
```typescript
{
  property_id: string
  wpl_id: number
  old_status: string
  new_status: string
  changed_by: string
  timestamp: string
}
```

### 2. Photo Upload Complete Webhook
**Trigger:** `UPDATE wordpress_properties WHERE photo_count > 0`
**Objetivo:** Iniciar processamento de thumbnails/otimização
**Payload:**
```typescript
{
  property_id: string
  photo_count: number
  photo_urls: string[]
  bucket: 'wpl-realty'
}
```

### 3. Migration Task Webhook
**Trigger:** `INSERT/UPDATE wordpress_migration_tasks`
**Objetivo:** Tracking de progresso de migração
**Payload:**
```typescript
{
  task_id: string
  property_id: string
  status: 'queued' | 'processing' | 'completed' | 'failed'
  progress: number
  error?: string
}
```

### 4. Property Approved → Sanity Webhook
**Trigger:** `UPDATE wordpress_properties WHERE status = 'approved'`
**Objetivo:** Iniciar migração automática para Sanity
**Action:** Chama edge function para criar property no Sanity

### 5. Bulk Import Webhook
**Trigger:** Batch insert > 10 properties
**Objetivo:** Notificar admin de imports em massa
**Payload:**
```typescript
{
  batch_size: number
  source: 'sql_import' | 'api' | 'manual'
  timestamp: string
}
```

### 6. Storage Quota Webhook
**Trigger:** Scheduled (daily)
**Objetivo:** Alertar quando R2 storage > 80%
**Payload:**
```typescript
{
  bucket: 'wpl-realty'
  used_gb: number
  total_gb: number
  percentage: number
}
```

### 7. Property Review Reminder Webhook
**Trigger:** Scheduled (daily)
**Objetivo:** Lembrar pending reviews > 7 dias
**Payload:**
```typescript
{
  pending_count: number
  oldest_pending_days: number
  properties: Array<{ wpl_id, created_at }>
}
```

### 8. Photo Migration Progress Webhook
**Trigger:** Every 100 photos migrated
**Objetivo:** Update progress dashboard
**Payload:**
```typescript
{
  migrated: number
  total: number
  percentage: number
  avg_size_kb: number
  estimated_remaining_minutes: number
}
```

### 9. Error Rate Monitor Webhook
**Trigger:** Error rate > 5% in migration tasks
**Objetivo:** Alert team de problemas
**Payload:**
```typescript
{
  error_count: number
  total_tasks: number
  error_rate: number
  top_errors: Array<{ message, count }>
}
```

### 10. Property Data Quality Webhook
**Trigger:** Property inserted with missing fields
**Objetivo:** Flag low-quality data
**Payload:**
```typescript
{
  property_id: string
  wpl_id: number
  missing_fields: string[]
  quality_score: number
}
```

## ⚡ Edge Functions Estratégicas

### 1. `migrate-property-to-sanity`
**Trigger:** Webhook quando property approved
**Função:**
```typescript
- Valida dados da property
- Cria documento no Sanity
- Migra fotos do R2 para Sanity Assets
- Atualiza sanity_id em wordpress_properties
- Marca como 'migrated'
```

### 2. `optimize-property-photos`
**Trigger:** Webhook após photo upload
**Função:**
```typescript
- Gera thumbnails (200x200, 400x400, 800x800)
- Otimiza JPEG quality (85%)
- Cria WebP versions
- Atualiza thumbnail_url
```

### 3. `property-search-indexer`
**Trigger:** INSERT/UPDATE wordpress_properties
**Função:**
```typescript
- Extrai dados relevantes (location, type, price)
- Atualiza search_vector (full-text search)
- Índice para Algolia/Meilisearch (opcional)
```

### 4. `batch-import-processor`
**Trigger:** HTTP POST /import-batch
**Função:**
```typescript
- Recebe array de properties
- Valida schema
- Insert em batch (transaction)
- Retorna summary
```

### 5. `property-quality-scorer`
**Trigger:** INSERT wordpress_properties
**Função:**
```typescript
- Calcula quality_score (0-100)
- Critérios: fotos, descrição, location, price
- Flags missing data
- Sugere melhorias
```

### 6. `photo-migration-worker`
**Trigger:** Cron job ou manual
**Função:**
```typescript
- Pega properties com photo_count = 0
- Download do Lightsail
- Upload para R2
- Atualiza photo_urls
- Rate-limited (max 10 concurrent)
```

### 7. `storage-cleanup`
**Trigger:** Cron (weekly)
**Função:**
```typescript
- Lista fotos orphaned (sem property)
- Move para bucket archive
- Delete após 30 dias
- Report de space saved
```

### 8. `property-duplicate-detector`
**Trigger:** INSERT wordpress_properties
**Função:**
```typescript
- Compara com existing (location, size, price)
- Calcula similarity score
- Flags potential duplicates
- Merge suggestions
```

### 9. `analytics-aggregator`
**Trigger:** Cron (daily)
**Função:**
```typescript
- Count by status
- Count by location
- Average price by type
- Photo stats
- Insert em dashboard_metrics table
```

### 10. `sanity-webhook-handler`
**Trigger:** HTTP POST from Sanity
**Função:**
```typescript
- Recebe updates do Sanity
- Sync back para wordpress_properties
- Update sanity_id, migrated_at
- Bi-directional sync
```

## 📁 Estrutura de Arquivos

```
projetos/nova-ipe/
├── supabase/
│   ├── migrations/
│   │   └── 20251008_wordpress_catalog.sql ✅
│   ├── functions/           (edge functions - criar depois)
│   └── config.toml
├── scripts/
│   ├── import-to-supabase-correct.ts ✅
│   ├── migrate-all-photos-to-r2.ts (próximo)
│   ├── check-existing-imports.ts ✅
│   └── check-r2-stats.ts
├── lib/services/
│   ├── wordpress-catalog-service.ts ✅
│   └── cloudflare-r2-service.ts ✅
├── types/
│   └── supabase.ts (gerar depois)
└── sql/
    └── wordpress_catalog_schema.sql ✅
```

## 🎯 KPIs do Projeto

**Performance:**
- Import speed: 141 properties em ~30s
- Photo migration: 4GB em ~30-45 min
- Dashboard load: < 2s para 1000 properties

**Economia:**
- R2 vs Sanity Assets: 30% cheaper
- R2 egress: $0 (vs Sanity $100/TB)
- Total savings: ~$150/mês

**Quality:**
- Review workflow: 100% das properties
- Selective migration: Top 100 apenas
- Data quality score: > 80% average

## 📞 Suporte

**Documentação:**
- Supabase: https://supabase.com/docs
- Cloudflare R2: https://developers.cloudflare.com/r2/
- Next.js: https://nextjs.org/docs

**Troubleshooting:**
```bash
# Logs do Supabase
supabase functions logs <function-name>

# Logs do R2
npx tsx scripts/check-r2-stats.ts

# Health check completo
npx tsx scripts/health-check-all.ts
```

---

**Status:** 🟡 Aguardando criação manual das tabelas no Dashboard
**Tempo estimado:** 1 minuto
**Próximo passo:** Executar SQL no dashboard e então importar 141 properties
