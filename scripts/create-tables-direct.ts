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

async function setupSchema() {
  console.log('🗄️  Criando tabelas no Supabase...\n')
  
  const sqlPath = join(process.cwd(), 'sql/wordpress_catalog_schema.sql')
  const sql = readFileSync(sqlPath, 'utf-8')
  
  // Executa SQL via rpc (Supabase suporta raw SQL via função)
  // Como não temos uma função RPC definida, vamos criar as tabelas via JS
  
  console.log('📋 Executando SQL via Supabase client...\n')
  
  // Criar tabela wordpress_properties
  const createPropertiesTable = `
    CREATE TABLE IF NOT EXISTS wordpress_properties (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      wp_id INTEGER UNIQUE NOT NULL,
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
    );
  `
  
  const createTasksTable = `
    CREATE TABLE IF NOT EXISTS wordpress_migration_tasks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      property_id UUID REFERENCES wordpress_properties(id) ON DELETE CASCADE,
      status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
      progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
      error_message TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      started_at TIMESTAMPTZ,
      completed_at TIMESTAMPTZ
    );
  `
  
  try {
    // Como Supabase não permite raw SQL direto via JS client,
    // vamos usar psql via connection string
    console.log('💡 Use psql para executar o schema:')
    console.log('\npsql "postgresql://postgres.ifhfpaehnjpdwdocdzwd:Y29vb29vb29s2024@aws-0-us-east-1.pooler.supabase.com:6543/postgres" -f sql/wordpress_catalog_schema.sql\n')
    
  } catch (error: any) {
    console.error('❌ Erro:', error.message)
  }
}

setupSchema()
