#!/usr/bin/env tsx
/**
 * Cria tabelas WordPress diretamente no Supabase
 * usando SQL via connection string
 */

import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { readFileSync } from 'fs'
import { join } from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

async function createTables() {
  console.log('🗄️  Criando tabelas WordPress no Supabase via SQL\n')
  console.log('═'.repeat(60))
  
  const sqlPath = join(process.cwd(), 'sql/wordpress_catalog_schema.sql')
  const sql = readFileSync(sqlPath, 'utf-8')
  
  // Connection strings possíveis do Supabase
  const connectionStrings = [
    `postgresql://postgres.ifhfpaehnjpdwdocdzwd:Y29vb29vb29s2024@aws-0-us-east-1.pooler.supabase.com:6543/postgres`,
    `postgresql://postgres:Y29vb29vb29s2024@db.ifhfpaehnjpdwdocdzwd.supabase.co:5432/postgres`,
    `postgresql://postgres:Y29vb29vb29s2024@aws-0-us-east-1.pooler.supabase.com:5432/postgres`
  ]
  
  console.log('🔍 Testando connection strings...\n')
  
  let connString: string | null = null
  
  for (const cs of connectionStrings) {
    try {
      const host = cs.match(/@([^:]+)/)?.[1] || 'unknown'
      process.stdout.write(`   Testando ${host}... `)
      
      const { stdout, stderr } = await execAsync(
        `echo "SELECT 1;" | psql "${cs}" -t`,
        { timeout: 5000 }
      )
      
      if (stdout.includes('1') || !stderr) {
        console.log('✅')
        connString = cs
        break
      } else {
        console.log(`❌ ${stderr.substring(0, 50)}`)
      }
    } catch (err: any) {
      console.log(`❌ timeout ou erro`)
    }
  }
  
  if (!connString) {
    console.log('\n❌ Nenhuma connection string funcionou\n')
    console.log('💡 SOLUÇÃO ALTERNATIVA:')
    console.log('   1. Acesse: https://supabase.com/dashboard/project/ifhfpaehnjpdwdocdzwd')
    console.log('   2. Settings → Database → Connection string')
    console.log('   3. Use a connection string correta\n')
    return
  }
  
  console.log('\n📤 Executando SQL schema...\n')
  
  try {
    const { stdout, stderr } = await execAsync(
      `psql "${connString}" -f "${sqlPath}"`,
      { timeout: 30000 }
    )
    
    if (stderr && !stderr.includes('NOTICE')) {
      console.log('⚠️  Warnings:', stderr)
    }
    
    if (stdout) {
      console.log(stdout)
    }
    
    console.log('\n✅ Tabelas criadas com sucesso!\n')
    console.log('📊 Verificando...\n')
    
    // Verifica se as tabelas existem
    const { stdout: tables } = await execAsync(
      `echo "SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename LIKE 'wordpress%';" | psql "${connString}" -t`
    )
    
    if (tables.includes('wordpress_properties')) {
      console.log('   ✅ wordpress_properties')
    }
    if (tables.includes('wordpress_migration_tasks')) {
      console.log('   ✅ wordpress_migration_tasks')
    }
    
    console.log('\n═'.repeat(60))
    console.log('🚀 Próximo passo:')
    console.log('   npx tsx scripts/import-to-supabase-correct.ts\n')
    
  } catch (err: any) {
    console.error('\n❌ Erro ao executar SQL:', err.message)
    console.error('\nSTDERR:', err.stderr)
  }
}

createTables()
