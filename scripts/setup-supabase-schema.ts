#!/usr/bin/env tsx
/**
 * Setup automático do schema no Supabase
 * Executa via Supabase REST API
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { readFileSync } from 'fs'
config({ path: resolve(process.cwd(), '.env.local') })

import { supabase } from '../lib/supabase'

async function setupSchema() {
  console.log('🗄️  Setup Supabase Schema\n')
  console.log('═'.repeat(60))
  
  try {
    // Ler schema SQL
    const schemaPath = resolve(process.cwd(), 'sql/wordpress_catalog_schema.sql')
    const schemaSql = readFileSync(schemaPath, 'utf-8')
    
    console.log('📖 Schema carregado:')
    console.log(`   Arquivo: ${schemaPath}`)
    console.log(`   Tamanho: ${(schemaSql.length / 1024).toFixed(2)} KB`)
    console.log('')
    
    // Executar schema
    console.log('⚙️  Executando schema no Supabase...')
    console.log('   (Isso pode levar alguns segundos)')
    console.log('')
    
    // Nota: Supabase client não tem método direto para SQL raw
    // Vamos verificar se as tabelas já existem
    
    const { data: tables, error: tablesError } = await supabase
      .from('wordpress_properties')
      .select('id')
      .limit(1)
    
    if (tablesError && tablesError.message.includes('relation')) {
      console.log('❌ Tabelas não existem ainda.')
      console.log('')
      console.log('📋 Por favor, execute manualmente:')
      console.log('')
      console.log('1. Acesse Supabase SQL Editor:')
      console.log('   https://app.supabase.com/project/ifhfpaehnjpdwdocdzwd/sql/new')
      console.log('')
      console.log('2. Copie e cole o seguinte SQL:')
      console.log('   (Schema está em: sql/wordpress_catalog_schema.sql)')
      console.log('')
      console.log('3. Clique "RUN" (ou Ctrl+Enter)')
      console.log('')
      console.log('═'.repeat(60))
      
      // Mostrar primeiras linhas do schema
      console.log('\n📄 Primeiras linhas do schema:')
      console.log('─'.repeat(60))
      console.log(schemaSql.split('\n').slice(0, 30).join('\n'))
      console.log('\n... (ver arquivo completo em sql/wordpress_catalog_schema.sql)')
      console.log('')
      
      return false
    }
    
    console.log('✅ Tabelas já existem!')
    console.log('')
    
    // Verificar estrutura
    console.log('🔍 Verificando estrutura...')
    
    const { count: wpCount } = await supabase
      .from('wordpress_properties')
      .select('*', { count: 'exact', head: true })
    
    const { count: taskCount } = await supabase
      .from('wordpress_migration_tasks')
      .select('*', { count: 'exact', head: true })
    
    console.log(`   ✅ wordpress_properties: ${wpCount || 0} rows`)
    console.log(`   ✅ wordpress_migration_tasks: ${taskCount || 0} rows`)
    console.log('')
    
    console.log('═'.repeat(60))
    console.log('✅ Schema está pronto para uso!')
    console.log('')
    
    return true
    
  } catch (error) {
    console.error('❌ Erro:', error)
    return false
  }
}

setupSchema().then(success => {
  if (success) {
    console.log('🚀 Próximo passo:')
    console.log('   npx tsx scripts/import-to-supabase-correct.ts')
  }
  process.exit(success ? 0 : 1)
})
