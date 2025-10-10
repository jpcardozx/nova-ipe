# 🚨 ERRO IDENTIFICADO: Tabelas não existem

## ❌ Erro Atual

```
ERROR:  42P01: relation "calculation_settings" does not exist
LINE 9: INSERT INTO calculation_settings (
```

## 🔍 Diagnóstico

O script de diagnóstico mostrou que as tabelas "existiam" via REST API, mas isso era **cache enganoso**. 

**A verdade:** As tabelas **NÃO foram criadas** ainda no PostgreSQL.

---

## ✅ SOLUÇÃO: Executar Migration Principal PRIMEIRO

### Passo 1: Criar as Tabelas

Execute no **Supabase Dashboard → SQL Editor**:

**Arquivo:** `supabase/migrations/20250108_create_aliquotas_tables.sql`

**Link direto:** https://supabase.com/dashboard/project/ifhfpaehnjpdwdocdzwd/editor

**O que faz:**
- Cria 4 tabelas (rent_adjustments, adjustment_history, calculation_settings, pdf_templates)
- Cria triggers automáticos
- Cria views
- Configura RLS

**Tempo:** ~10 segundos

---

### Passo 2: Inserir Dados Iniciais

**DEPOIS** que as tabelas forem criadas, execute:

**Arquivo:** `supabase/migrations/20250108_insert_initial_data.sql` (arquivo atual)

**O que faz:**
- Insere configuração IGPM padrão
- Insere template PDF padrão

**Tempo:** ~5 segundos

---

## 📋 ORDEM CORRETA DE EXECUÇÃO

```bash
1. ✅ 20250108_create_aliquotas_tables.sql      # Criar estrutura
2. ✅ 20250108_insert_initial_data.sql          # Inserir dados
```

❌ **ERRADO:** Tentar inserir dados antes de criar tabelas

---

## 🎯 AÇÃO IMEDIATA

1. Vá em: https://supabase.com/dashboard/project/ifhfpaehnjpdwdocdzwd/editor

2. Abra: `supabase/migrations/20250108_create_aliquotas_tables.sql`

3. Copie TODO o conteúdo (501 linhas)

4. Cole no SQL Editor

5. Clique em **RUN**

6. Aguarde: "Success. No rows returned"

7. **DEPOIS** execute o arquivo atual (20250108_insert_initial_data.sql)

---

## 💡 Por que o diagnóstico mostrou que existiam?

O script de verificação tentou fazer SELECT nas tabelas:

```typescript
await supabase.from('rent_adjustments').select('id').limit(1);
```

O PostgREST retornou erro genérico que foi interpretado como "existe mas vazia", quando na verdade era "não existe".

**Lição:** Sempre verificar com SQL direto no dashboard para ter certeza!

---

**Status:** ⏳ Aguardando execução de 20250108_create_aliquotas_tables.sql  
**Próximo:** Depois execute 20250108_insert_initial_data.sql (arquivo atual)
