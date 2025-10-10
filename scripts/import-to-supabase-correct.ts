#!/usr/bin/env tsx
/**
 * Import WordPress properties to Supabase
 * Lê o SQL export e insere no Supabase (não no Sanity!)
 */

// Carrega env vars primeiro
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { readFileSync } from 'fs'
import { join } from 'path'
import { WordPressCatalogService } from '../lib/services/wordpress-catalog-service'
import { parsePropertiesFromSQL } from './wordpress-importer/importer'

const SQL_PATH = join(process.cwd(), 'exports/imoveis/imoveis-export-20251008/database/imoveis-completo.sql')

async function main() {
  console.log('🚀 WordPress → Supabase Import\n')
  console.log('═'.repeat(50))
  
  try {
    // 1. Verificar arquivo
    console.log('\n📖 Arquivo SQL:', SQL_PATH)
    
    // 2. Extract properties (parsePropertiesFromSQL lê o arquivo internamente)
    console.log('\n🔍 Extraindo properties do SQL...')
    const properties = parsePropertiesFromSQL(SQL_PATH)
    console.log(`✓ ${properties.length} properties encontradas`)
    
    if (properties.length === 0) {
      console.error('❌ Nenhuma property encontrada no SQL!')
      process.exit(1)
    }
    
    // 3. Verificar se há registros existentes
    const { count: existingCount } = await WordPressCatalogService.countProperties()
    if (existingCount > 0) {
      console.log(`\n⚠️  Atenção: Já existem ${existingCount} properties no Supabase`)
      console.log('   O import vai pular duplicatas automaticamente.\n')
    }
    
    // 4. Import to Supabase
    console.log('\n📤 Importando para Supabase...')
    console.log('─'.repeat(50))
    
    let processed = 0
    const result = await WordPressCatalogService.importToSupabase(
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
    console.log(`   • Total processado: ${result.processed}/${result.total}`)
    console.log(`   • Novos registros: ${result.processed - (result.skipped || 0)}`)
    console.log(`   • Duplicatas ignoradas: ${result.skipped || 0}`)
    if (result.errors && result.errors > 0) {
      console.log(`   • ⚠️  Erros: ${result.errors} (verifique logs acima)`)
    }
    
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
