# 🚦 Status do Workflow - WordPress → Supabase/R2

## ✅ Fases Completadas

### Fase 1: Cloudflare R2 (COMPLETO)
- ✅ Credenciais configuradas no `.env.local`
- ✅ Bucket `wpl-realty` verificado e acessível
- ✅ Serviço `cloudflare-r2-service.ts` funcionando
- ✅ Teste de conexão bem-sucedido

**Evidências:**
```bash
$ npx tsx scripts/test-r2-simple.ts
✅ 1 bucket(s) encontrado(s): wpl-realty
✅ Bucket "wpl-realty" existe e é acessível!
```

### Fase 2: Parser SQL (COMPLETO)
- ✅ Script `import-to-supabase-correct.ts` criado
- ✅ Parser extrai properties do SQL corretamente
- ✅ 141 properties encontradas no arquivo SQL

**Nota:** Esperávamos ~761 properties, mas o parser encontrou apenas 141. Isso pode indicar:
- Apenas 141 properties ativas (deleted='0')
- Parser precisa de ajustes para capturar todas as linhas

## ❌ Fase 3: Import para Supabase (BLOQUEADO)

### Problema Crítico: Credenciais Supabase Inválidas

**Erro Atual:**
```
Error: { message: 'Invalid API key' }
```

**Teste de Diagnóstico:**
```bash
$ node -e "..." # teste com SERVICE_ROLE_KEY
Count: null
Error: Invalid API key
```

### Credenciais Atuais no `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://ifhfpaehnjpdwdocdzwd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUz... (inválida)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUz... (inválida)
```

### Impacto:
- ❌ Import de 141 properties falhou silenciosamente
- ❌ Todas as queries ao Supabase retornam "Invalid API key"
- ❌ Dashboard não conseguirá acessar os dados

## 🔧 Ações Necessárias

### 1. Atualizar Credenciais do Supabase

**Onde obter as chaves corretas:**
1. Acesse: https://supabase.com/dashboard/project/ifhfpaehnjpdwdocdzwd
2. Settings → API
3. Copie:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` (clique em "Reveal") → `SUPABASE_SERVICE_ROLE_KEY`

**Atualizar `.env.local`:**
```bash
# Backup atual
cp .env.local .env.local.backup

# Editar com as novas chaves
nano .env.local
```

### 2. Reexecutar Setup do Schema
```bash
npx tsx scripts/setup-supabase-schema.ts
```

### 3. Reexecutar Import
```bash
npx tsx scripts/import-to-supabase-correct.ts
```

Deverá mostrar:
```
✅ Import concluído!
   • Total processado: 141/141
```

### 4. Verificar Dados
```bash
npx tsx scripts/check-supabase-count.ts
```

Deverá mostrar:
```
✅ Conexão OK
📊 Total properties: 141
🏠 Últimas 5 properties importadas: ...
```

## 📊 Estatísticas Atuais

| Componente | Status | Detalhes |
|------------|--------|----------|
| **Cloudflare R2** | ✅ Funcionando | Bucket: wpl-realty |
| **SQL Parser** | ✅ Funcionando | 141 properties encontradas |
| **Supabase** | ❌ Bloqueado | Credenciais inválidas |
| **Import** | ⏸️ Pendente | Aguardando fix do Supabase |

## 🎯 Próximos Passos (após fix)

1. ✅ Fix credenciais Supabase
2. ⏭️ Reexecutar import (141 properties)
3. ⏭️ Migrar fotos para R2 (~4GB, 6000+ fotos)
4. ⏭️ Testar dashboard http://localhost:3000/dashboard/wordpress-catalog
5. ⏭️ Review e aprovação de properties
6. ⏭️ Migração seletiva top 100 para Sanity

## 💡 Observações

### Parser SQL
O parser atual encontrou apenas 141 de ~761 properties esperadas. Possíveis causas:
- Filtro `deleted='0'` removendo properties inativas
- Parser não capturando todas as linhas de INSERT multi-valor
- Arquivo SQL contém apenas subset dos dados

**Recomendação:** Após fix do Supabase, investigar se precisamos ajustar o parser.

### Arquitetura
- ✅ Workflow correto: SQL → Supabase (review) → R2 (photos) → Sanity (selective)
- ✅ Separação clara: Supabase = staging, R2 = storage, Sanity = production
- ✅ Custo otimizado: R2 ~30% cheaper + zero egress vs Sanity assets

---

**Última atualização:** $(date +"%Y-%m-%d %H:%M:%S")
**Status Geral:** 🟡 Parcialmente Bloqueado (aguardando credenciais Supabase)
