# 🚀 Guia de Implementação - WordPress Catalog System

## ✅ O Que Foi Implementado

### 1. **Schema SQL** (`sql/wordpress_catalog_schema.sql`)
- ✅ Tabelas: `wordpress_properties`, `wordpress_migration_tasks`
- ✅ Full-text search em português (títulos, descrições, localização)
- ✅ RLS (Row Level Security) habilitado
- ✅ Triggers automáticos (updated_at, search_vector)
- ✅ View de estatísticas (`wordpress_catalog_stats`)

### 2. **Service Layer** (`lib/services/wordpress-catalog-service.ts`)
- ✅ Import SQL → Supabase
- ✅ Upload de fotos → Supabase Storage
- ✅ Workflow de aprovação (pending → reviewing → approved → migrated)
- ✅ Migração seletiva → Sanity

### 3. **UI Components**
- ✅ `components/ui/tabs.tsx` - Tabs component customizado
- ✅ `app/dashboard/wordpress-catalog/page.tsx` - UI completa

### 4. **UI/UX Features**
- ✅ Grid responsivo com Framer Motion animations
- ✅ Search full-text + filtros por status
- ✅ Stats cards animados
- ✅ Modal de detalhes com 3 tabs (Detalhes, Fotos, Ações)
- ✅ Workflow buttons dinâmicos por status
- ✅ TanStack Query para cache inteligente
- ✅ Skeleton loaders durante carregamento
- ✅ Empty states quando não há dados

---

## 📋 Próximos Passos para Implementação

### **Passo 1: Executar Schema SQL no Supabase**

```bash
# 1. Copie o conteúdo do arquivo
cat /home/jpcardozx/projetos/nova-ipe/sql/wordpress_catalog_schema.sql

# 2. Acesse Supabase Dashboard
# https://app.supabase.com → Seu Projeto → SQL Editor

# 3. Cole o SQL completo e clique em "Run" ou Ctrl+Enter
```

**Validar criação:**
```sql
-- Verificar tabelas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'wordpress%';

-- Deve retornar:
-- wordpress_properties
-- wordpress_migration_tasks
```

---

### **Passo 2: Criar Bucket no Supabase Storage (se não existe)**

```bash
# Acesse: Storage → Create bucket
# Nome: documents (provavelmente já existe)
# Public: false
# Allowed MIME types: image/*, application/pdf
```

**Ou via SQL:**
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT DO NOTHING;
```

---

### **Passo 3: Testar a UI**

```bash
cd /home/jpcardozx/projetos/nova-ipe

# Iniciar dev server
npm run dev

# Acessar
# http://localhost:3000/dashboard/wordpress-catalog
```

**O que você verá:**
- ✅ Header com logo animado
- ✅ Stats vazios (0 total, 0 prontas)
- ✅ Mensagem "Nenhuma ficha encontrada"

Isso é **normal** porque ainda não importamos os dados!

---

### **Passo 4: Importar Dados do SQL para Supabase**

Agora vamos criar o script de import real:

<function_calls>
<invoke name="create_file">
<parameter name="content">#!/usr/bin/env tsx
/**
 * Import WordPress properties to Supabase
 * Lê o SQL export e insere no Supabase (não no Sanity!)
 */

import { readFileSync } from 'fs'
import { join } from 'path'
import { WordPressCatalogService } from '../lib/services/wordpress-catalog-service'
import { parsePropertiesFromSQL } from './wordpress-importer/importer'

const SQL_PATH = join(process.cwd(), 'exports/imoveis/imoveis-export-20251008/database/imoveis-completo.sql')

async function main() {
  console.log('🚀 WordPress → Supabase Import\n')
  console.log('═'.repeat(50))
  
  try {
    // 1. Parse SQL
    console.log('\n📖 Lendo arquivo SQL...')
    const sqlContent = readFileSync(SQL_PATH, 'utf-8')
    console.log(`✓ Arquivo carregado (${(sqlContent.length / 1024 / 1024).toFixed(2)} MB)`)
    
    // 2. Extract properties
    console.log('\n🔍 Extraindo properties do SQL...')
    const properties = parsePropertiesFromSQL(sqlContent)
    console.log(`✓ ${properties.length} properties encontradas`)
    
    if (properties.length === 0) {
      console.error('❌ Nenhuma property encontrada no SQL!')
      process.exit(1)
    }
    
    // 3. Import to Supabase
    console.log('\n📤 Importando para Supabase...')
    console.log('─'.repeat(50))
    
    let processed = 0
    const { processed: totalProcessed, total } = await WordPressCatalogService.importToSupabase(
      properties,
      (current, total) => {
        if (current > processed) {
          processed = current
          const percent = ((current / total) * 100).toFixed(1)
          process.stdout.write(`\r⏳ Progresso: ${current}/${total} (${percent}%)`)
        }
      }
    )
    
    console.log(`\n\n✅ Import concluído!`)
    console.log(`   • Total processado: ${totalProcessed}/${total}`)
    console.log(`   • Duplicatas ignoradas: ${total - totalProcessed}`)
    
    console.log('\n📊 Próximos passos:')
    console.log('   1. Acesse http://localhost:3000/dashboard/wordpress-catalog')
    console.log('   2. Revise as fichas e aprove as melhores')
    console.log('   3. Upload de fotos será implementado em seguida')
    
  } catch (error) {
    console.error('\n❌ Erro durante import:', error)
    process.exit(1)
  }
}

main()
