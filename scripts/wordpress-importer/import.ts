#!/usr/bin/env tsx
import path from 'path'
import { runImport } from './importer'

const SQL_FILE = path.join(process.cwd(), 'exports/imoveis/imoveis-export-20251008/database/imoveis-completo.sql')

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║   🏠 WordPress WPL → Sanity Importer                         ║
║   Importação segura em batches de 30 imóveis                ║
╚═══════════════════════════════════════════════════════════════╝
`)

// Validate environment
const requiredEnv = [
  'NEXT_PUBLIC_SANITY_PROJECT_ID',
  'NEXT_PUBLIC_SANITY_DATASET',
  'SANITY_API_TOKEN'
]

const missing = requiredEnv.filter(key => !process.env[key])
if (missing.length > 0) {
  console.error('❌ Missing required environment variables:')
  missing.forEach(key => console.error(`   - ${key}`))
  process.exit(1)
}

// Run import
runImport(SQL_FILE)
  .then(() => {
    console.log('\n✅ Import completed successfully\n')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n❌ Import failed:', error)
    process.exit(1)
  })
