# 🔧 GUIA: EXECUTAR MIGRATIONS SUPABASE - ALÍQUOTAS

## ✅ STATUS ATUAL

**Supabase Conectado:** ✅ SIM
- **URL:** `https://ifhfpaehnjpdwdocdzwd.supabase.co`
- **Projeto ID:** `ifhfpaehnjpdwdocdzwd`
- **Configuração:** `.env.local` ✅

**Migrations Disponíveis:**
1. ✅ `20251008_wordpress_catalog.sql` (já existe - WordPress Catalog)
2. ⏳ `20250108_create_aliquotas_tables.sql` (criada - PRECISA EXECUTAR)

---

## 🚀 MÉTODO 1: DASHBOARD SUPABASE (RECOMENDADO)

### Passo 1: Acessar Supabase Dashboard
```
https://supabase.com/dashboard/project/ifhfpaehnjpdwdocdzwd
```

### Passo 2: Ir para SQL Editor
1. No menu lateral, clique em **"SQL Editor"**
2. Clique em **"New query"**

### Passo 3: Copiar SQL da Migration
Abra o arquivo:
```
supabase/migrations/20250108_create_aliquotas_tables.sql
```

### Passo 4: Colar e Executar
1. Copie TODO o conteúdo do arquivo
2. Cole no SQL Editor
3. Clique em **"Run"** (ou pressione Ctrl+Enter)

### Passo 5: Verificar Sucesso
Se executou com sucesso, você verá:
```
Success. No rows returned
```

---

## 🔍 MÉTODO 2: VERIFICAR TABELAS CRIADAS

Após executar, rode este SQL para confirmar:

```sql
-- Verificar se tabelas foram criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'rent_adjustments',
    'adjustment_history',
    'calculation_settings',
    'pdf_templates'
  )
ORDER BY table_name;
```

**Resultado esperado:**
```
adjustment_history
calculation_settings
pdf_templates
rent_adjustments
```

---

## 📊 MÉTODO 3: VERIFICAR DADOS INICIAIS

Após executar, verifique se os dados iniciais foram criados:

```sql
-- Ver configuração padrão IGPM
SELECT * FROM calculation_settings WHERE is_default = true;

-- Ver template PDF padrão
SELECT * FROM pdf_templates WHERE is_default = true;
```

---

## ⚠️ MÉTODO 4: SE DER ERRO

### Erro Comum 1: "relation already exists"
**Significa:** Tabela já existe (migration já foi executada)

**Solução:** Não precisa fazer nada! ✅

### Erro Comum 2: "permission denied"
**Significa:** Falta permissão de admin

**Solução:**
1. Verifique se está logado como admin no Supabase
2. Use o Service Role Key se necessário

### Erro Comum 3: "syntax error"
**Significa:** Erro na migration SQL

**Solução:**
1. Certifique-se de copiar TODO o arquivo
2. Não edite nada ao copiar
3. Execute linha por linha se necessário

---

## 🎯 MÉTODO 5: EXECUTAR POR PARTES (SE HOUVER ERRO)

Se der erro ao executar tudo de uma vez, execute em partes:

### Parte 1: Criar Tabelas
```sql
-- Copie apenas as seções CREATE TABLE
-- (linhas 1-200 aproximadamente)
```

### Parte 2: Criar Índices
```sql
-- Copie apenas as seções CREATE INDEX
-- (após as tabelas)
```

### Parte 3: Criar Functions e Triggers
```sql
-- Copie apenas as seções CREATE FUNCTION e CREATE TRIGGER
```

### Parte 4: Dados Iniciais
```sql
-- Copie apenas as seções INSERT INTO
-- (final do arquivo)
```

---

## 🔐 MÉTODO 6: VERIFICAR RLS (Row Level Security)

Após executar, verifique se RLS está ativo:

```sql
-- Ver status RLS das tabelas
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'rent_adjustments',
    'adjustment_history',
    'calculation_settings',
    'pdf_templates'
  );
```

**Resultado esperado:** Todas com `rls_enabled = true`

---

## 📝 MÉTODO 7: SCRIPT DE TESTE RÁPIDO

Após executar migration, rode este teste:

```sql
-- 🧪 TESTE COMPLETO
DO $$
DECLARE
  v_tables_count INTEGER;
  v_settings_count INTEGER;
  v_template_count INTEGER;
BEGIN
  -- Contar tabelas criadas
  SELECT COUNT(*) INTO v_tables_count
  FROM information_schema.tables 
  WHERE table_schema = 'public' 
    AND table_name IN (
      'rent_adjustments',
      'adjustment_history',
      'calculation_settings',
      'pdf_templates'
    );
  
  -- Contar configurações padrão
  SELECT COUNT(*) INTO v_settings_count
  FROM calculation_settings 
  WHERE is_default = true AND active = true;
  
  -- Contar templates padrão
  SELECT COUNT(*) INTO v_template_count
  FROM pdf_templates 
  WHERE is_default = true AND active = true;
  
  -- Exibir resultado
  RAISE NOTICE '✅ Tabelas criadas: % de 4', v_tables_count;
  RAISE NOTICE '✅ Configurações padrão: % de 1', v_settings_count;
  RAISE NOTICE '✅ Templates padrão: % de 1', v_template_count;
  
  IF v_tables_count = 4 AND v_settings_count = 1 AND v_template_count = 1 THEN
    RAISE NOTICE '🎉 MIGRATION EXECUTADA COM SUCESSO!';
  ELSE
    RAISE WARNING '⚠️ Migration incompleta. Verifique os logs.';
  END IF;
END $$;
```

---

## 🔄 MÉTODO 8: ROLLBACK (SE PRECISAR DESFAZER)

Se precisar remover tudo e recomeçar:

```sql
-- ⚠️ ATENÇÃO: Isso APAGA TUDO!
-- Use apenas se quiser recomeçar do zero

-- Desabilitar triggers primeiro
DROP TRIGGER IF EXISTS log_rent_adjustments_history ON rent_adjustments;
DROP TRIGGER IF EXISTS update_rent_adjustments_updated_at ON rent_adjustments;
DROP TRIGGER IF EXISTS update_calculation_settings_updated_at ON calculation_settings;
DROP TRIGGER IF EXISTS update_pdf_templates_updated_at ON pdf_templates;

-- Remover functions
DROP FUNCTION IF EXISTS log_adjustment_history() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Remover views
DROP VIEW IF EXISTS adjustment_statistics CASCADE;
DROP VIEW IF EXISTS active_rent_adjustments CASCADE;

-- Remover tabelas (na ordem correta)
DROP TABLE IF EXISTS adjustment_history CASCADE;
DROP TABLE IF EXISTS rent_adjustments CASCADE;
DROP TABLE IF EXISTS calculation_settings CASCADE;
DROP TABLE IF EXISTS pdf_templates CASCADE;

-- Agora pode executar a migration novamente
```

---

## 📚 INFORMAÇÕES ADICIONAIS

### Arquivo da Migration:
```
/home/jpcardozx/projetos/nova-ipe/supabase/migrations/20250108_create_aliquotas_tables.sql
```

### Tamanho do Arquivo:
- ~650 linhas de SQL
- 4 tabelas principais
- 2 views
- 2 functions
- 4 triggers
- RLS habilitado
- Dados iniciais (1 setting + 1 template)

### Tabelas Criadas:
1. **rent_adjustments** (Principal)
   - Armazena todos os reajustes de aluguel
   - Conecta com `crm_clients` (CRM existente)
   - Status workflow completo
   
2. **adjustment_history** (Histórico)
   - Log de todas as ações
   - Auditoria completa
   - Automático via trigger
   
3. **calculation_settings** (Configurações)
   - Métodos de cálculo (IGPM, IPCA, etc)
   - Taxas padrão
   - Períodos de validade
   
4. **pdf_templates** (Templates)
   - Templates para geração de PDF
   - Layouts customizáveis
   - Variáveis dinâmicas

---

## ✅ CHECKLIST PÓS-EXECUÇÃO

Depois de executar, marque:

- [ ] Migration executada sem erros
- [ ] 4 tabelas criadas
- [ ] RLS habilitado em todas
- [ ] Configuração IGPM padrão criada
- [ ] Template PDF padrão criado
- [ ] Views criadas (active_rent_adjustments, adjustment_statistics)
- [ ] Triggers funcionando
- [ ] Teste rápido passou

---

## 🎯 PRÓXIMO PASSO

Após executar a migration com sucesso:

1. ✅ Gerar types TypeScript (opcional):
   ```bash
   npx supabase gen types typescript --project-id ifhfpaehnjpdwdocdzwd > types/supabase-aliquotas.ts
   ```

2. ✅ Criar API routes (próxima etapa da implementação)

3. ✅ Criar componentes UI (wizard, dashboard, etc)

---

## 📞 SUPORTE

Se tiver qualquer problema:
1. Copie a mensagem de erro completa
2. Cole no chat
3. Vou ajustar a migration conforme necessário

---

**Criado em:** 08/01/2025  
**Status:** ⏳ Aguardando execução da migration  
**Próximo:** Executar SQL no Supabase Dashboard
