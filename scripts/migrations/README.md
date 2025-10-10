# 🚀 Sistema de Migrations - Alíquotas

Sistema completo de migrations TypeScript para o módulo de alíquotas, com execução segura via Supabase.

---

## 📋 Scripts Disponíveis

### 1. **Migration Completa** (Recomendado)
```bash
pnpm migration:aliquotas
```
**O que faz:**
- ✅ Valida ambiente (.env.local)
- ✅ Testa conexão com Supabase
- ✅ Verifica tabelas existentes
- ✅ Executa migration completa
- ✅ Verifica sucesso pós-execução
- ✅ Logs detalhados e coloridos

**Resultado esperado:**
```
╔════════════════════════════════════════════════════════╗
║  ✨ MIGRATION CONCLUÍDA COM SUCESSO! ✨              ║
╚════════════════════════════════════════════════════════╝
```

---

### 2. **Migration Simples** (Alternativa)
```bash
pnpm migration:simple
```
**Quando usar:**
- Se o método completo falhar
- Para execução mais direta
- Sem validações extras

**Features:**
- ✅ Execução statement por statement
- ✅ Progress bar visual
- ✅ Identifica tipo de cada statement
- ✅ Parse inteligente de SQL

---

### 3. **Verificar Migration**
```bash
pnpm migration:aliquotas:verify
```
**O que faz:**
- Verifica se tabelas existem
- Verifica se dados iniciais foram criados
- Não executa nada, apenas verifica

**Resultado esperado:**
```
✅ Tabela OK: rent_adjustments
✅ Tabela OK: adjustment_history
✅ Tabela OK: calculation_settings
✅ Tabela OK: pdf_templates
✅ Configuração padrão: IGPM
✅ Template padrão: Carta Padrão de Reajuste
```

---

### 4. **Rollback (Desfazer)**
```bash
pnpm migration:aliquotas:rollback
```
**⚠️ ATENÇÃO:** Isso **APAGA** todas as tabelas e dados!

**O que faz:**
- Remove triggers
- Remove functions
- Remove views
- Remove tabelas (na ordem correta)
- Aguarda 3s para cancelar (Ctrl+C)

**Quando usar:**
- Para limpar e recomeçar
- Para testar migration novamente
- Para desenvolvimento/staging apenas

---

### 5. **Forçar Recriação**
```bash
pnpm migration:aliquotas:force
```
**O que faz:**
- Faz rollback automático
- Executa migration novamente
- Útil para atualizar schema

**Quando usar:**
- Se tabelas já existem mas precisa atualizar
- Para recriar do zero sem comando manual

---

## 🏗️ Arquitetura

### Arquivos Criados

```
scripts/migrations/
├── run-aliquotas-migration.ts    # Script principal (450+ linhas)
├── exec-sql-direct.ts            # Executor alternativo
└── exec-sql-simple.ts            # Executor simplificado
```

### Migration SQL
```
supabase/migrations/
└── 20250108_create_aliquotas_tables.sql  # 650 linhas de SQL
```

---

## 📊 O Que a Migration Cria

### Tabelas (4)
1. **rent_adjustments** - Reajustes de aluguel
   - 40+ colunas
   - FK para crm_clients
   - Status workflow
   
2. **adjustment_history** - Histórico de mudanças
   - Log automático via trigger
   - Auditoria completa
   
3. **calculation_settings** - Configurações de cálculo
   - Métodos (IGPM, IPCA, etc)
   - Taxas padrão
   
4. **pdf_templates** - Templates de PDF
   - Layouts customizáveis
   - Variáveis dinâmicas

### Views (2)
- **active_rent_adjustments** - Reajustes ativos
- **adjustment_statistics** - Estatísticas agregadas

### Functions (2)
- **update_updated_at_column()** - Auto-update de timestamps
- **log_adjustment_history()** - Log automático de mudanças

### Triggers (4)
- Auto update de updated_at em todas as tabelas
- Log automático de mudanças em rent_adjustments

### Dados Iniciais
- ✅ Configuração IGPM padrão
- ✅ Template PDF padrão

---

## 🔧 Requisitos

### Ambiente
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=seu-service-role-key
```

### Dependências
```json
{
  "@supabase/supabase-js": "2.57.0",
  "tsx": "latest"  // Executar TypeScript diretamente
}
```

**Instalar tsx:**
```bash
pnpm add -D tsx
```

---

## 🎯 Fluxo de Uso

### Primeira Vez (Setup Inicial)
```bash
# 1. Executar migration
pnpm migration:aliquotas

# 2. Verificar
pnpm migration:aliquotas:verify

# 3. Confirmar no Supabase Dashboard
#    https://supabase.com/dashboard → Table Editor
```

### Durante Desenvolvimento
```bash
# Atualizar schema
pnpm migration:aliquotas:force

# Testar novamente
pnpm migration:aliquotas:rollback
pnpm migration:aliquotas
```

### Em Produção
```bash
# Apenas executar (nunca force ou rollback!)
pnpm migration:aliquotas
```

---

## 🐛 Troubleshooting

### Erro: "Variáveis de ambiente não configuradas"
**Solução:** Configure `.env.local` com credenciais do Supabase

### Erro: "Tabelas já existem"
**Opções:**
```bash
# 1. Forçar recriação (desenvolvimento)
pnpm migration:aliquotas:force

# 2. Fazer rollback manual
pnpm migration:aliquotas:rollback
pnpm migration:aliquotas

# 3. Apenas verificar se está OK
pnpm migration:aliquotas:verify
```

### Erro: "exec_sql function not found"
**Solução:** Use o método simplificado:
```bash
pnpm migration:simple
```

### Erro: "Permission denied"
**Solução:** Verifique se está usando SERVICE_ROLE_KEY (não ANON_KEY)

### Migration para de repente
**Solução:**
1. Verifique logs para ver qual statement falhou
2. Execute comando com `--verbose` (se disponível)
3. Tente executar SQL diretamente no Supabase Dashboard

---

## 📝 Logs e Debug

### Ver Progresso Detalhado
Os scripts já mostram progresso visual:
```
▶ Validando ambiente...
  ✅ Ambiente validado

▶ Testando conexão com Supabase...
  ✅ Conexão estabelecida

▶ Executando migration...
  [1/47] TABLE      rent_adjustments              ✅
  [2/47] TABLE      adjustment_history            ✅
  [3/47] INDEX      idx_adjustments_client        ✅
  ...
```

### Verificar Tabelas Manualmente
```sql
-- No Supabase SQL Editor
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE '%adjustment%'
  OR table_name LIKE '%rent%';
```

---

## ✅ Checklist Pós-Migration

Após executar com sucesso:

- [ ] 4 tabelas criadas
- [ ] 2 views criadas
- [ ] Configuração IGPM padrão existe
- [ ] Template PDF padrão existe
- [ ] RLS (Row Level Security) habilitado
- [ ] Triggers funcionando
- [ ] No Supabase Dashboard: tabelas visíveis

---

## 🔄 Próximos Passos

Após migration bem-sucedida:

1. **Criar API Routes** (2-3 horas)
   ```
   app/api/aliquotas/
   ├── calculate/route.ts
   ├── stats/route.ts
   ├── adjustments/route.ts
   └── pdf/generate/route.ts
   ```

2. **Criar Wizard** (3-4 horas)
   ```
   app/dashboard/aliquotas/new/
   └── components/Wizard/
       ├── CalculatorWizard.tsx
       ├── Step1ClientSelection.tsx
       └── ...
   ```

3. **Criar Dashboard** (1-2 horas)
   ```
   app/dashboard/aliquotas/page.tsx
   └── components/Dashboard/
       ├── Overview.tsx
       └── RecentList.tsx
   ```

---

## 🎓 Como Funciona

### Smart SQL Splitting
Os scripts fazem parse inteligente do SQL:
- Detecta funções (com `$$`)
- Respeita triggers
- Mantém ordem de dependências
- Separa statements corretamente

### Execução Segura
- Valida ambiente antes
- Testa conexão primeiro
- Rollback automático em erro (opcional)
- Logs detalhados de progresso

### Verificação Pós-Execução
- Confirma que tabelas existem
- Verifica dados iniciais
- Testa queries básicas
- Valida RLS

---

## 📞 Suporte

Se algo der errado:

1. **Copie o erro completo** do terminal
2. **Verifique o arquivo SQL** está completo
3. **Tente método alternativo** (simple se completo falhar)
4. **Execute manualmente** no Supabase Dashboard (último recurso)

---

## 🎯 Status

- ✅ Scripts criados e documentados
- ✅ 3 métodos de execução
- ✅ Validações completas
- ✅ Rollback seguro
- ✅ Logs detalhados
- ⏳ Aguardando primeira execução

---

**Criado em:** 08/10/2025  
**Versão:** 1.0.0  
**Linguagem:** TypeScript + Node.js  
**Framework:** Supabase REST API
