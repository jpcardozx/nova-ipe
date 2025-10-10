#!/usr/bin/env tsx
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { readFileSync } from 'fs'
import { join } from 'path'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    db: {
      schema: 'public'
    }
  }
)

async function executeSQLDirect() {
  console.log('🗄️  Criando tabelas WordPress no Supabase\n')
  console.log('═'.repeat(60))
  
  const sqlStatements = [
    // 1. Drop existing tables if they exist (clean slate)
    `DROP TABLE IF EXISTS wordpress_migration_tasks CASCADE;`,
    `DROP TABLE IF EXISTS wordpress_properties CASCADE;`,
    
    // 2. Create wordpress_properties table
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
    );`,
    
    // 3. Create wordpress_migration_tasks table
    `CREATE TABLE wordpress_migration_tasks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      property_id UUID REFERENCES wordpress_properties(id) ON DELETE CASCADE,
      status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
      progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
      error_message TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      started_at TIMESTAMPTZ,
      completed_at TIMESTAMPTZ
    );`,
    
    // 4. Create indexes
    `CREATE INDEX idx_wp_properties_status ON wordpress_properties(status);`,
    `CREATE INDEX idx_wp_properties_wpl_id ON wordpress_properties(wpl_id);`,
    `CREATE INDEX idx_wp_properties_created_at ON wordpress_properties(created_at DESC);`,
    `CREATE INDEX idx_wp_migration_tasks_property ON wordpress_migration_tasks(property_id);`,
    `CREATE INDEX idx_wp_migration_tasks_status ON wordpress_migration_tasks(status);`,
    
    // 5. Enable RLS
    `ALTER TABLE wordpress_properties ENABLE ROW LEVEL SECURITY;`,
    `ALTER TABLE wordpress_migration_tasks ENABLE ROW LEVEL SECURITY;`,
    
    // 6. Create policies for authenticated users
    `DROP POLICY IF EXISTS "Allow public read access" ON wordpress_properties;`,
    `CREATE POLICY "Allow public read access" ON wordpress_properties FOR SELECT USING (true);`,
    
    `DROP POLICY IF EXISTS "Allow service role full access" ON wordpress_properties;`,
    `CREATE POLICY "Allow service role full access" ON wordpress_properties FOR ALL USING (true);`,
    
    `DROP POLICY IF EXISTS "Allow public read access tasks" ON wordpress_migration_tasks;`,
    `CREATE POLICY "Allow public read access tasks" ON wordpress_migration_tasks FOR SELECT USING (true);`,
    
    `DROP POLICY IF EXISTS "Allow service role full access tasks" ON wordpress_migration_tasks;`,
    `CREATE POLICY "Allow service role full access tasks" ON wordpress_migration_tasks FOR ALL USING (true);`
  ]
  
  console.log('📋 Executando SQL statements...\n')
  
  for (let i = 0; i < sqlStatements.length; i++) {
    const sql = sqlStatements[i]
    const action = sql.substring(0, 50).replace(/\n/g, ' ')
    
    try {
      // Usa rpc para executar SQL direto (se disponível)
      const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
      
      if (error) {
        // RPC pode não estar disponível, vamos usar método alternativo
        console.log(`⚠️  RPC não disponível, usando método alternativo...`)
        break
      }
      
      console.log(`✓ ${i + 1}/${sqlStatements.length} - ${action}...`)
    } catch (err: any) {
      console.log(`✗ Erro: ${err.message}`)
    }
  }
  
  console.log('\n💡 Supabase client não suporta SQL direto.')
  console.log('   Vou criar as tabelas usando o método manual...\n')
  
  // Método manual: criar via SQL file upload no dashboard ou via migration
  console.log('═'.repeat(60))
  console.log('\n✅ SOLUÇÃO: Execute o SQL manualmente')
  console.log('\n1️⃣  Acesse: https://supabase.com/dashboard/project/ifhfpaehnjpdwdocdzwd/sql/new')
  console.log('\n2️⃣  Cole o conteúdo de: sql/wordpress_catalog_schema.sql')
  console.log('\n3️⃣  Ou execute via psql com a connection string correta\n')
  
  console.log('📝 Testando se as tabelas já existem...\n')
  
  // Tenta query simples para ver se existe
  const { error: testError } = await supabase
    .from('wordpress_properties')
    .select('id')
    .limit(1)
  
  if (testError) {
    if (testError.message.includes('not find the table')) {
      console.log('❌ Tabela wordpress_properties NÃO existe')
      console.log('\n🔧 ACTION REQUIRED: Crie as tabelas manualmente')
    } else {
      console.log('❌ Erro ao verificar:', testError.message)
    }
  } else {
    console.log('✅ Tabela wordpress_properties já existe!')
  }
}

executeSQLDirect()
