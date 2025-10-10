# GUIA VISUAL - Correções de Schema

**Guia rápido visual para executar correções**

---

## 🎯 OBJETIVO

Corrigir 7 problemas críticos no schema SQL em **30 minutos**.

---

## 📋 PRÉ-REQUISITOS

```bash
# 1. Verificar conexão com banco
psql -h YOUR_HOST -U YOUR_USER -d YOUR_DB -c "SELECT NOW();"

# 2. Fazer backup
pg_dump -h YOUR_HOST -U YOUR_USER -d YOUR_DB > backup_$(date +%Y%m%d_%H%M%S).sql

# 3. Verificar arquivos existem
ls -la docs/SCRIPTS_CORRECAO_SCHEMA.sql
```

---

## ⚡ EXECUÇÃO RÁPIDA (30 minutos)

### PASSO 1: Consolidar user_profiles (10 min)

```bash
# Abrir editor SQL
psql -h YOUR_HOST -U YOUR_USER -d YOUR_DB
```

```sql
-- Copiar e colar SEÇÃO 1 do arquivo SCRIPTS_CORRECAO_SCHEMA.sql
-- Linhas 1-170

-- Verificar resultado
SELECT COUNT(*) FROM user_profiles;
SELECT * FROM user_profiles LIMIT 1;

-- ✅ Sucesso se:
-- - Tabela existe
-- - Trigger handle_new_user existe
-- - RLS está habilitado
```

**Validação:**
```sql
-- Ver políticas RLS
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename = 'user_profiles';
-- Deve mostrar 4 policies
```

---

### PASSO 2: Adicionar Foreign Keys (5 min)

```sql
-- Copiar e colar SEÇÃO 2 do arquivo SCRIPTS_CORRECAO_SCHEMA.sql
-- Linhas 172-230

-- Verificar resultado
SELECT
  conname AS constraint_name,
  conrelid::regclass AS table_name,
  confrelid::regclass AS referenced_table
FROM pg_constraint
WHERE contype = 'f'
  AND conrelid::regclass::text IN ('rent_adjustments', 'calculation_settings', 'pdf_templates');

-- ✅ Sucesso se mostrar 9 constraints
```

**Diagrama de FKs:**
```
rent_adjustments
├── approved_by  ──→ auth.users.id
├── created_by   ──→ auth.users.id
├── updated_by   ──→ auth.users.id
├── sent_by      ──→ auth.users.id
└── deleted_by   ──→ auth.users.id

calculation_settings
├── created_by   ──→ auth.users.id
└── updated_by   ──→ auth.users.id

pdf_templates
├── created_by   ──→ auth.users.id
└── updated_by   ──→ auth.users.id
```

---

### PASSO 3: Corrigir RLS Policies (10 min)

```sql
-- Copiar e colar SEÇÃO 3 do arquivo SCRIPTS_CORRECAO_SCHEMA.sql
-- Linhas 232-320

-- Verificar resultado
SELECT schemaname, tablename, policyname, cmd, qual
FROM pg_policies
WHERE tablename IN ('rent_adjustments', 'adjustment_history', 'calculation_settings', 'pdf_templates');

-- ✅ Sucesso se todas as policies foram recriadas sem erro
```

**Teste de RLS:**
```sql
-- Simular usuário normal
SET ROLE authenticated;
SET request.jwt.claims TO '{"sub": "test-uuid-here"}';

-- Tentar query (deve funcionar)
SELECT COUNT(*) FROM rent_adjustments;

-- Reset
RESET ROLE;
```

---

### PASSO 4: Regenerar Tipos TypeScript (5 min)

```bash
# Sair do psql
\q

# Regenerar tipos
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/supabase_new.ts

# Comparar diferenças
diff types/supabase.ts types/supabase_new.ts | head -50

# Se OK, substituir
mv types/supabase_new.ts types/supabase.ts

# Verificar compilação
npm run type-check
# ou
npx tsc --noEmit
```

**Estrutura esperada em types/supabase.ts:**
```typescript
export type Database = {
  public: {
    Tables: {
      user_profiles: { Row: {...}, Insert: {...}, Update: {...} }  // ✅ NOVO
      rent_adjustments: { Row: {...}, Insert: {...}, Update: {...} }  // ✅ NOVO
      adjustment_history: { Row: {...}, Insert: {...}, Update: {...} }  // ✅ NOVO
      calculation_settings: { Row: {...}, Insert: {...}, Update: {...} }  // ✅ NOVO
      pdf_templates: { Row: {...}, Insert: {...}, Update: {...} }  // ✅ NOVO
      calendar_events: {  // ✅ CORRIGIDO
        Row: {
          start_datetime: string  // ✅ era start_date
          end_datetime: string    // ✅ era end_date
          assigned_to: string[]   // ✅ era attendees
          // ...
        }
      }
      // ...
    }
  }
}
```

---

## 🎨 DIAGRAMA DE FLUXO

```
┌─────────────────────┐
│   ESTADO ATUAL      │
│   (QUEBRADO)        │
├─────────────────────┤
│ ❌ 3 migrations     │
│    duplicadas       │
│ ❌ Types errados    │
│ ❌ FKs faltando     │
│ ❌ RLS quebrado     │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  PASSO 1            │
│  Consolidar         │
│  user_profiles      │
│  (10 min)           │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  PASSO 2            │
│  Adicionar FKs      │
│  (5 min)            │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  PASSO 3            │
│  Corrigir RLS       │
│  (10 min)           │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  PASSO 4            │
│  Gerar Types        │
│  (5 min)            │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  ESTADO FINAL       │
│  (FUNCIONAL)        │
├─────────────────────┤
│ ✅ 1 migration      │
│    consolidada      │
│ ✅ Types corretos   │
│ ✅ Todas FKs OK     │
│ ✅ RLS funcional    │
└─────────────────────┘
```

---

## 📊 VALIDAÇÃO VISUAL

### Antes vs Depois

#### ANTES ❌
```sql
-- user_profiles: 3 migrations conflitantes
20251010_supabase_auth_migration.sql
20251010_supabase_auth_migration_fixed.sql
20251010_supabase_auth_migration_v2.sql

-- Types: Desatualizados
calendar_events.start_date         (errado)
calendar_events.attendees          (errado)
user_profiles                      (não existe)
rent_adjustments                   (não existe)

-- Foreign Keys: Faltando
rent_adjustments.approved_by       (sem FK)
rent_adjustments.created_by        (sem FK)
calculation_settings.created_by    (sem FK)

-- RLS: Quebrado
SELECT id FROM profiles ...        (tabela não existe)
```

#### DEPOIS ✅
```sql
-- user_profiles: 1 migration consolidada
user_profiles (tabela criada, RLS OK, trigger OK)

-- Types: Atualizados
calendar_events.start_datetime     (correto)
calendar_events.assigned_to        (correto)
user_profiles                      (existe)
rent_adjustments                   (existe)

-- Foreign Keys: Todas definidas
rent_adjustments.approved_by   →   auth.users.id
rent_adjustments.created_by    →   auth.users.id
calculation_settings.created_by →  auth.users.id

-- RLS: Funcional
SELECT auth_user_id FROM user_profiles ... (funciona)
```

---

## 🔍 TROUBLESHOOTING

### Problema: "relation user_profiles already exists"
```sql
-- Verificar estrutura atual
\d user_profiles

-- Se estrutura está errada, dropar e recriar
DROP TABLE IF EXISTS user_profiles CASCADE;
-- Então executar SEÇÃO 1 novamente
```

---

### Problema: "constraint already exists"
```sql
-- Listar constraints existentes
SELECT conname FROM pg_constraint WHERE conrelid = 'rent_adjustments'::regclass;

-- Dropar constraint duplicada
ALTER TABLE rent_adjustments DROP CONSTRAINT IF EXISTS nome_da_constraint;
-- Então executar SEÇÃO 2 novamente
```

---

### Problema: "policy already exists"
```sql
-- Listar policies existentes
SELECT policyname FROM pg_policies WHERE tablename = 'rent_adjustments';

-- Dropar policy duplicada
DROP POLICY IF EXISTS "nome_da_policy" ON rent_adjustments;
-- Então executar SEÇÃO 3 novamente
```

---

### Problema: Types não compilam
```bash
# Ver erros específicos
npx tsc --noEmit

# Se problema em imports
grep -r "from.*types/supabase" app/ lib/

# Atualizar imports se necessário
# Trocar:
import { Database } from '@/types/supabase'
# Para:
import type { Database } from '@/types/supabase'
```

---

## 📈 MÉTRICAS DE SUCESSO

Execute após cada passo:

```sql
-- ============================================
-- VALIDAÇÃO AUTOMÁTICA
-- ============================================

-- 1. RLS habilitado?
SELECT
  tablename,
  CASE WHEN rowsecurity THEN '✅ OK' ELSE '❌ FALTA' END as rls_status
FROM pg_tables t
JOIN pg_class c ON c.relname = t.tablename
WHERE schemaname = 'public'
  AND tablename IN ('user_profiles', 'rent_adjustments', 'calendar_events')
ORDER BY tablename;

-- 2. Foreign Keys OK?
SELECT
  COUNT(*) as total_fks,
  COUNT(*) FILTER (WHERE confrelid = 'auth.users'::regclass) as auth_fks
FROM pg_constraint
WHERE contype = 'f'
  AND conrelid::regclass::text IN (
    'rent_adjustments',
    'calculation_settings',
    'pdf_templates'
  );
-- Esperado: total_fks >= 9, auth_fks >= 9

-- 3. Policies criadas?
SELECT
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE tablename IN ('user_profiles', 'rent_adjustments', 'adjustment_history')
GROUP BY tablename
ORDER BY tablename;
-- Esperado:
-- user_profiles: 4 policies
-- rent_adjustments: 4 policies
-- adjustment_history: 1 policy

-- 4. Trigger funcionando?
SELECT
  tgname,
  tgrelid::regclass as table_name
FROM pg_trigger
WHERE tgrelid::regclass::text IN ('user_profiles', 'calendar_events')
  AND NOT tgisinternal
ORDER BY table_name, tgname;
-- Esperado:
-- on_auth_user_created → user_profiles
-- user_profiles_updated_at → user_profiles
-- event_notifications_trigger → calendar_events
```

---

## 🎯 PRÓXIMOS PASSOS

Depois de concluir os 4 passos acima:

### Esta Semana
```bash
# 1. Adicionar índices de performance (SEÇÃO 4)
# Tempo: 15 min
# Impacto: -40% query time

# 2. Migrar JSON → JSONB (SEÇÃO 5)
# Tempo: 10 min
# Impacto: -20% storage, +30% query speed

# 3. Criar Materialized View (SEÇÃO 10)
# Tempo: 10 min
# Impacto: -90% analytics query time
```

### Este Mês
```bash
# 1. Implementar Audit Log (SEÇÃO 12)
# Tempo: 1 hora
# Benefício: Rastreabilidade completa

# 2. Soft Delete Universal (SEÇÃO 11)
# Tempo: 30 min
# Benefício: Recuperação de dados

# 3. Full-text Search
# Tempo: 2 horas
# Benefício: Busca mais rápida e relevante
```

---

## 📞 SUPORTE

### Arquivos de Referência
```
docs/
├── ANALISE_COMPLETA_SCHEMA_MIGRATIONS.md   (Análise detalhada)
├── SCRIPTS_CORRECAO_SCHEMA.sql             (Scripts SQL)
├── RESUMO_EXECUTIVO_ANALISE.md             (Resumo executivo)
└── GUIA_VISUAL_CORRECOES.md                (Este guia)
```

### Comandos Úteis
```bash
# Ver estrutura de uma tabela
psql -c "\d user_profiles"

# Ver todas as tabelas
psql -c "\dt"

# Ver todas as foreign keys
psql -c "SELECT conname, conrelid::regclass, confrelid::regclass FROM pg_constraint WHERE contype = 'f';"

# Ver todas as policies
psql -c "SELECT schemaname, tablename, policyname FROM pg_policies ORDER BY tablename;"

# Ver todos os índices
psql -c "SELECT tablename, indexname FROM pg_indexes WHERE schemaname = 'public' ORDER BY tablename;"
```

---

## ✅ CHECKLIST FINAL

```
Fase 1: Crítico (30 min)
┌────────────────────────────────────────┐
│ ☐ Backup feito                         │
│ ☐ PASSO 1: user_profiles OK            │
│ ☐ PASSO 2: Foreign Keys OK             │
│ ☐ PASSO 3: RLS OK                      │
│ ☐ PASSO 4: Types OK                    │
│ ☐ Validação executada                  │
│ ☐ Login/signup testado                 │
│ ☐ Queries testadas                     │
└────────────────────────────────────────┘

Validação Visual
┌────────────────────────────────────────┐
│ ✅ 0 erros de TypeScript                │
│ ✅ 0 tabelas sem RLS                    │
│ ✅ 0 foreign keys faltando              │
│ ✅ 9+ foreign keys adicionadas          │
│ ✅ 9+ policies criadas                  │
│ ✅ 3+ triggers funcionando              │
└────────────────────────────────────────┘
```

---

**Última atualização:** 2025-10-10
**Tempo estimado total:** 30 minutos
**Dificuldade:** ⭐⭐⭐ (Intermediário)
