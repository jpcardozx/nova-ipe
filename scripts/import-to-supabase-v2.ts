#!/usr/bin/env tsx
/**
 * Import WordPress properties to Supabase
 * Versão simplificada que não depende do Sanity client
 */

import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { readFileSync } from 'fs'
import { join } from 'path'
import { WordPressCatalogService } from '../lib/services/wordpress-catalog-service'
import type { WPLProperty } from './wordpress-importer/types'

const SQL_PATH = join(process.cwd(), 'exports/imoveis/imoveis-export-20251008/database/imoveis-completo.sql')

// Parser simplificado de SQL
function parsePropertiesFromSQL(sqlContent: string): WPLProperty[] {
  const properties: WPLProperty[] = []
  
  // Regex para encontrar INSERTs na tabela wp_wpl_properties
  const insertRegex = /INSERT INTO `wp_wpl_properties`[^(]*\(([^)]+)\) VALUES\s*/gi
  const valuesRegex = /\(([^)]+(?:\([^)]*\))?[^)]*)\)/g
  
  let match
  let columns: string[] = []
  
  // Encontrar os nomes das colunas
  if (match = insertRegex.exec(sqlContent)) {
    columns = match[1].split(',').map(c => c.trim().replace(/`/g, ''))
  }
  
  // Encontrar todos os VALUES
  const valueMatches = sqlContent.matchAll(/INSERT INTO `wp_wpl_properties`[^;]+;/g)
  
  for (const insertMatch of valueMatches) {
    const insertStatement = insertMatch[0]
    const valuesMatch = insertStatement.match(/VALUES\s+(.+);/)
    
    if (!valuesMatch) continue
    
    const valuesStr = valuesMatch[1]
    let currentValue = ''
    let depth = 0
    let inString = false
    let stringChar = ''
    
    for (let i = 0; i < valuesStr.length; i++) {
      const char = valuesStr[i]
      const prevChar = i > 0 ? valuesStr[i - 1] : ''
      
      if ((char === '"' || char === "'") && prevChar !== '\\') {
        if (!inString) {
          inString = true
          stringChar = char
        } else if (char === stringChar) {
          inString = false
        }
      }
      
      if (!inString) {
        if (char === '(') depth++
        if (char === ')') depth--
      }
      
      currentValue += char
      
      if (depth === 0 && char === ')' && currentValue.trim().startsWith('(')) {
        // Processar a row
        const rowData = currentValue.trim().slice(1, -1) // Remove ()
        const values: any[] = []
        
        // Parse simples dos valores
        const parts = rowData.split(',')
        let currentPart = ''
        let partDepth = 0
        let partInString = false
        
        for (const part of parts) {
          for (const char of part) {
            if (char === '"' || char === "'") {
              if (!partInString) partInString = true
              else partInString = false
            }
            if (!partInString) {
              if (char === '(') partDepth++
              if (char === ')') partDepth--
            }
          }
          
          currentPart += (currentPart ? ',' : '') + part
          
          if (partDepth === 0 && !partInString) {
            let value = currentPart.trim()
            
            // Limpar aspas
            if ((value.startsWith("'") && value.endsWith("'")) || 
                (value.startsWith('"') && value.endsWith('"'))) {
              value = value.slice(1, -1)
            }
            
            // NULL
            if (value === 'NULL' || value === '') {
              values.push(null)
            } else {
              values.push(value)
            }
            
            currentPart = ''
          }
        }
        
        // Criar objeto WPLProperty
        if (values.length >= columns.length) {
          const property: any = {}
          columns.forEach((col, idx) => {
            property[col] = values[idx]
          })
          
          if (property.id && property.deleted === '0') {
            properties.push(property as WPLProperty)
          }
        }
        
        currentValue = ''
      }
    }
  }
  
  return properties
}

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
      console.error('\n💡 Verifique se o arquivo SQL existe em:')
      console.error(`   ${SQL_PATH}`)
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
    console.log('   3. Migre fotos: npx tsx scripts/migrate-all-photos-to-r2.ts')
    console.log('')
    
  } catch (error) {
    console.error('\n❌ Erro durante import:', error)
    process.exit(1)
  }
}

main()
