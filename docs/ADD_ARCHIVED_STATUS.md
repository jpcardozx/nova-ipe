# 🔧 Ação Necessária: Adicionar Status 'archived'

## Problema Identificado
O schema atual da tabela `wordpress_properties` não inclui o status `archived` no constraint CHECK.

## Solução
Execute o SQL abaixo no **Supabase Dashboard SQL Editor**:

**URL**: https://supabase.com/dashboard/project/ifhfpaehnjpdwdocdzwd/sql/new

```sql
-- Adicionar 'archived' aos status permitidos
ALTER TABLE wordpress_properties 
DROP CONSTRAINT IF EXISTS wordpress_properties_status_check;

ALTER TABLE wordpress_properties 
ADD CONSTRAINT wordpress_properties_status_check 
CHECK (status IN ('pending', 'reviewing', 'approved', 'migrated', 'rejected', 'archived'));
```

## Após Executar
Rode o comando:
```bash
npx tsx scripts/import-deleted-as-archived.ts
```

## Badge System Completo

| Status | Badge | Descrição | Uso |
|--------|-------|-----------|-----|
| `pending` | 🟢 | Properties ativas aguardando review | Default para properties ativas |
| `reviewing` | 🔵 | Em processo de revisão | Durante review manual |
| `approved` | ✅ | Aprovadas para migração | Trigger auto-migration para Sanity |
| `migrated` | 🎉 | Já migradas para Sanity | Após sucesso na migração |
| `rejected` | ❌ | Rejeitadas no review | Properties com problemas |
| **`archived`** | 📦 | **Deletadas na origem** | **Properties com deleted=1** |

## Workflow

```
SQL (761 properties)
├─ 141 ATIVAS (deleted=0)
│  └─ Status: pending → reviewing → approved → migrated
└─ 620 DELETADAS (deleted=1)
   └─ Status: archived (preservadas para histórico)
```

## Próximos Passos

1. ✅ Execute o SQL acima
2. ⏭️ Rode: `npx tsx scripts/import-deleted-as-archived.ts`
3. ⏭️ Resolva fotos: Precisamos investigar de onde vêm as URLs das fotos
4. ⏭️ Dashboard testing

---

**Aguardando**: Confirmação de execução do SQL
