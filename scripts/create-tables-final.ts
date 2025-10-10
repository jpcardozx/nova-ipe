#!/usr/bin/env tsx
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { readFileSync } from 'fs'
import { join } from 'path'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function createTablesDirectSQL() {
  console.log('🗄️  Criando tabelas WordPress via Supabase Client\n')
  console.log('═'.repeat(60))
  
  const statements = [
    // 1. Drop tables se existem
    `DROP TABLE IF EXISTS wordpress_migration_tasks CASCADE`,
    `DROP TABLE IF EXISTS wordpress_properties CASCADE`,
    
    // 2. Criar wordpress_properties
    `CREATE TABLE wordpress_properties (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      wpl_id INTEGER UNIQUE NOT NULL,
      data JSONB NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'migrated', 'rejected')),
      photo_count INTEGER DEFAULT 0,
      photo_urls TEXT[],
      thumbnail_url TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      reviewed_by UUID,
      reviewed_at TIMESTAMPTZ,
      notes TEXT,
      migrated_at TIMESTAMPTZ,
      sanity_id TEXT
    )`,
    
    // 3. Criar wordpress_migration_tasks
    `CREATE TABLE wordpress_migration_tasks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      property_id UUID REFERENCES wordpress_properties(id) ON DELETE CASCADE,
      status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
      progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
      error_message TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      started_at TIMESTAMPTZ,
      completed_at TIMESTAMPTZ
    )`,
    
    // 4. Índices
    `CREATE INDEX idx_wp_properties_status ON wordpress_properties(status)`,
    `CREATE INDEX idx_wp_properties_wpl_id ON wordpress_properties(wpl_id)`,
    `CREATE INDEX idx_wp_properties_created_at ON wordpress_properties(created_at DESC)`,
    `CREATE INDEX idx_wp_migration_tasks_property ON wordpress_migration_tasks(property_id)`,
    `CREATE INDEX idx_wp_migration_tasks_status ON wordpress_migration_tasks(status)`,
    
    // 5. RLS
    `ALTER TABLE wordpress_properties ENABLE ROW LEVEL SECURITY`,
    `ALTER TABLE wordpress_migration_tasks ENABLE ROW LEVEL SECURITY`,
    
    // 6. Políticas RLS
    `CREATE POLICY "Allow all operations for service role" ON wordpress_properties FOR ALL USING (true)`,
    `CREATE POLICY "Allow all operations for service role tasks" ON wordpress_migration_tasks FOR ALL USING (true)`
  ]
  
  let success = 0
  let failed = 0
  
  for (const [index, sql] of statements.entries()) {
    const shortSQL = sql.substring(0, 60).replace(/\n/g, ' ') + '...'
    process.stdout.write(`\r${index + 1}/${statements.length} - ${shortSQL}`)
    
    try {
      // Usa a REST API do Supabase que não suporta SQL direto, então vamos tentar via fetch
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql`,
        {
          method: 'POST',
          headers: {
            'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query: sql })
        }
      )
      
      if (response.ok) {
        success++
      } else {
        const error = await response.text()
        // Se RPC não existe, é esperado
        if (error.includes('Could not find') || error.includes('exec_sql')) {
          // Função RPC não existe, vamos usar método alternativo
          break
        }
        failed++
      }
    } catch (err) {
      failed++
    }
  }
  
  console.log('\n\n⚠️  Supabase REST API não suporta SQL direto\n')
  console.log('📋 SOLUÇÃO: Vou criar as tabelas usando o Dashboard SQL Editor\n')
  console.log('═'.repeat(60))
  console.log('\n📝 SQL para executar no Dashboard:\n')
  
  const fullSQL = readFileSync(join(process.cwd(), 'supabase/migrations/20251008_wordpress_catalog.sql'), 'utf-8')
  console.log('```sql')
  console.log(fullSQL.substring(0, 500) + '\n... (arquivo completo em supabase/migrations/)')
  console.log('```\n')
  
  console.log('🌐 Acesse: https://supabase.com/dashboard/project/ifhfpaehnjpdwdocdzwd/sql/new')
  console.log('📄 Cole o conteúdo de: supabase/migrations/20251008_wordpress_catalog.sql')
  console.log('▶️  Clique em "RUN"\n')
  console.log('═'.repeat(60))
}

createTablesDirectSQL()
