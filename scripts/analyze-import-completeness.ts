#!/usr/bin/env tsx
/**
 * Análise completa das properties importadas vs SQL original
 * Verifica completude e mapeia o que falta
 */

import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'
import { parsePropertiesFromSQL } from './wordpress-importer/importer'
import { readFileSync } from 'fs'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const SQL_FILE = 'exports/imoveis/imoveis-export-20251008/database/imoveis-completo.sql'

interface PropertyAnalysis {
  wp_id: number
  status: string
  inSupabase: boolean
  isComplete: boolean
  missingFields: string[]
  sourceStatus: 'active' | 'deleted'
}

// Parse SQL sem filtro de deleted
function parseAllPropertiesFromSQL(sqlFilePath: string) {
  const sqlContent = readFileSync(sqlFilePath, 'utf-8')
  const properties: any[] = []

  const insertPattern = /INSERT INTO `wp_wpl_properties` VALUES\s*\(([\s\S]+?)\);/gi
  const matches = sqlContent.matchAll(insertPattern)

  function parseRowValues(row: string): string[] {
    const values: string[] = []
    let current = ''
    let inString = false
    let escapeNext = false

    for (let i = 0; i < row.length; i++) {
      const char = row[i]
      if (escapeNext) {
        current += char
        escapeNext = false
        continue
      }
      if (char === '\\') {
        escapeNext = true
        continue
      }
      if (char === "'") {
        inString = !inString
        continue
      }
      if (!inString && char === ',') {
        values.push(current)
        current = ''
        continue
      }
      current += char
    }
    values.push(current)
    return values
  }

  function cleanString(val: string): string {
    if (!val || val === 'NULL') return ''
    return val.replace(/^'|'$/g, '').trim()
  }

  for (const match of matches) {
    const valuesStr = match[1]
    const rows = valuesStr.split(/\),\s*\(/g)

    for (let row of rows) {
      row = row.replace(/^\(/, '').replace(/\)$/, '')
      const values = parseRowValues(row)

      if (values && values.length > 50) {
        const property = {
          id: parseInt(values[0]) || 0,
          kind: parseInt(values[1]) || 0,
          deleted: parseInt(values[2]) || 0,
          mls_id: cleanString(values[3]),
          listing: parseInt(values[8]) || 0,
          property_type: parseInt(values[9]) || 0,
          location1_name: cleanString(values[17]),
          location2_name: cleanString(values[18]),
          location3_name: cleanString(values[19]),
          location4_name: cleanString(values[20]),
          price: parseFloat(values[25]) || 0,
          bedrooms: parseFloat(values[29]) || 0,
          bathrooms: parseFloat(values[31]) || 0,
          living_area: parseFloat(values[32]) || 0,
          lot_area: parseFloat(values[35]) || 0,
          add_date: cleanString(values[42]),
          pic_numb: parseInt(values[6]) || 0,
          field_312: cleanString(values[64]), // Título página
          field_313: cleanString(values[65]), // Título imóvel
          field_308: cleanString(values[66]), // Descrição
        }

        if (property.id > 0) {
          properties.push(property)
        }
      }
    }
  }

  return properties
}

async function analyzeCompleteness() {
  console.log('🔍 ANÁLISE DE COMPLETUDE DAS IMPORTAÇÕES')
  console.log('═'.repeat(60))
  console.log()

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

  // 1. Get todas properties do SQL
  console.log('📖 Carregando properties do SQL...')
  const allPropertiesFromSQL = parseAllPropertiesFromSQL(SQL_FILE)
  console.log(`   ✓ ${allPropertiesFromSQL.length} properties encontradas`)

  // 2. Get todas properties do Supabase
  console.log('\n📊 Carregando properties do Supabase...')
  const { data: supabaseProps, error } = await supabase
    .from('wordpress_properties')
    .select('wp_id, data, status, photo_count, photo_urls, thumbnail_url')

  if (error) {
    console.error('❌ Erro ao buscar do Supabase:', error)
    process.exit(1)
  }

  console.log(`   ✓ ${supabaseProps.length} properties no Supabase`)

  // 3. Criar mapa de wp_ids no Supabase
  const supabaseWpIds = new Set(supabaseProps.map((p) => p.wp_id))

  // 4. Análise detalhada
  console.log('\n📋 ANÁLISE DETALHADA:')
  console.log('─'.repeat(60))

  const analysis: PropertyAnalysis[] = []

  for (const sqlProp of allPropertiesFromSQL) {
    const inSupabase = supabaseWpIds.has(sqlProp.id)
    const sourceStatus = sqlProp.deleted === 1 ? 'deleted' : 'active'

    const missingFields: string[] = []
    let isComplete = true

    if (inSupabase) {
      const supabaseProp = supabaseProps.find((p) => p.wp_id === sqlProp.id)!

      // Verificar campos essenciais
      if (!supabaseProp.data) {
        missingFields.push('data')
        isComplete = false
      }
      if (
        sqlProp.pic_numb > 0 &&
        (!supabaseProp.photo_urls || supabaseProp.photo_urls.length === 0)
      ) {
        missingFields.push('photo_urls')
        isComplete = false
      }
      if (sqlProp.pic_numb > 0 && !supabaseProp.thumbnail_url) {
        missingFields.push('thumbnail_url')
        isComplete = false
      }
    }

    analysis.push({
      wp_id: sqlProp.id,
      status: sourceStatus,
      inSupabase,
      isComplete,
      missingFields,
      sourceStatus,
    })
  }

  // 5. Estatísticas
  const stats = {
    total: allPropertiesFromSQL.length,
    inSupabase: analysis.filter((a) => a.inSupabase).length,
    notInSupabase: analysis.filter((a) => !a.inSupabase).length,
    incomplete: analysis.filter((a) => a.inSupabase && !a.isComplete).length,
    active: analysis.filter((a) => a.sourceStatus === 'active').length,
    deleted: analysis.filter((a) => a.sourceStatus === 'deleted').length,
    activeInSupabase: analysis.filter(
      (a) => a.sourceStatus === 'active' && a.inSupabase
    ).length,
    deletedInSupabase: analysis.filter(
      (a) => a.sourceStatus === 'deleted' && a.inSupabase
    ).length,
  }

  console.log('\n📊 RESUMO GERAL:')
  console.log('─'.repeat(60))
  console.log(`Total no SQL:              ${stats.total}`)
  console.log(`  ├─ Ativas (deleted=0):   ${stats.active}`)
  console.log(`  └─ Deletadas (deleted=1): ${stats.deleted}`)
  console.log()
  console.log(`No Supabase:               ${stats.inSupabase}`)
  console.log(`  ├─ Ativas:               ${stats.activeInSupabase}`)
  console.log(`  └─ Deletadas:            ${stats.deletedInSupabase}`)
  console.log()
  console.log(`Faltando importar:         ${stats.notInSupabase}`)
  console.log(`Incompletas (precisam fix): ${stats.incomplete}`)
  console.log()

  // 6. Detalhamento do que falta
  console.log('\n📋 DETALHAMENTO:')
  console.log('─'.repeat(60))

  const missing = analysis.filter((a) => !a.inSupabase)
  const missingActive = missing.filter((a) => a.sourceStatus === 'active')
  const missingDeleted = missing.filter((a) => a.sourceStatus === 'deleted')

  console.log('\n❌ FALTAM IMPORTAR:')
  console.log(
    `   ${missing.length} properties (${missingActive.length} ativas + ${missingDeleted.length} deletadas)`
  )

  if (missingActive.length > 0) {
    console.log('\n   🚨 ATIVAS não importadas (CRÍTICO):')
    missingActive.slice(0, 10).forEach((a) => {
      console.log(`      - wp_id: ${a.wp_id}`)
    })
    if (missingActive.length > 10) {
      console.log(`      ... e mais ${missingActive.length - 10}`)
    }
  }

  if (missingDeleted.length > 0) {
    console.log('\n   📦 DELETADAS não importadas:')
    console.log(`      ${missingDeleted.length} properties arquivadas`)
  }

  const incomplete = analysis.filter((a) => a.inSupabase && !a.isComplete)
  if (incomplete.length > 0) {
    console.log('\n⚠️  PROPERTIES INCOMPLETAS:')
    incomplete.slice(0, 5).forEach((a) => {
      console.log(
        `   wp_id ${a.wp_id}: faltam ${a.missingFields.join(', ')}`
      )
    })
    if (incomplete.length > 5) {
      console.log(`   ... e mais ${incomplete.length - 5}`)
    }
  }

  // 7. Recomendações
  console.log('\n')
  console.log('═'.repeat(60))
  console.log('🎯 RECOMENDAÇÕES:')
  console.log('═'.repeat(60))

  if (missingActive.length > 0) {
    console.log('\n🔴 CRÍTICO: Importar properties ativas faltantes')
    console.log(
      '   Comando: npx tsx scripts/import-missing-active-properties.ts'
    )
  }

  if (stats.incomplete > 0) {
    console.log('\n🟡 IMPORTANTE: Completar properties com dados faltantes')
    console.log('   Comando: npx tsx scripts/fix-incomplete-properties.ts')
  }

  if (missingDeleted.length > 0) {
    console.log('\n🟢 OPCIONAL: Importar properties deletadas como archived')
    console.log(
      '   Comando: npx tsx scripts/import-deleted-as-archived.ts'
    )
  }

  console.log('\n')

  // Salvar análise em arquivo
  const reportPath = 'docs/IMPORT_COMPLETENESS_ANALYSIS.json'
  const report = {
    timestamp: new Date().toISOString(),
    stats,
    missingActive: missingActive.map((a) => a.wp_id),
    missingDeleted: missingDeleted.map((a) => a.wp_id),
    incomplete: incomplete.map((a) => ({
      wp_id: a.wp_id,
      missingFields: a.missingFields,
    })),
  }

  const { writeFileSync } = await import('fs')
  writeFileSync(reportPath, JSON.stringify(report, null, 2))
  console.log(`💾 Análise salva em: ${reportPath}`)
}

analyzeCompleteness().catch((error) => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})
