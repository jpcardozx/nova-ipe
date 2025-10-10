#!/usr/bin/env tsx
/**
 * Importa properties deletadas (deleted=1) como archived
 * Com badges de classificação para facilitar dashboard
 */

import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const SQL_FILE =
  'exports/imoveis/imoveis-export-20251008/database/imoveis-completo.sql'
const BATCH_SIZE = 20
const LIGHTSAIL_BASE_URL =
  'https://wpl-imoveis.com/wp-content/uploads/wplpro'

function parseDeletedPropertiesFromSQL(sqlFilePath: string) {
  const sqlContent = readFileSync(sqlFilePath, 'utf-8')
  const properties: any[] = []

  const insertPattern =
    /INSERT INTO `wp_wpl_properties` VALUES\s*\(([\s\S]+?)\);/gi
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
        const deleted = parseInt(values[2]) || 0

        // APENAS properties deletadas
        if (deleted === 1) {
          const id = parseInt(values[0]) || 0
          const picNumb = parseInt(values[6]) || 0

          // Construir photo_urls
          let photoUrls: string[] = []
          let thumbnailUrl: string | null = null

          try {
            const galleryIds = cleanString(values[54]) // gallery_image_ids
            if (galleryIds) {
              let imageIds: string[] = []
              try {
                imageIds = JSON.parse(galleryIds)
              } catch {
                imageIds = galleryIds.split(',').filter(Boolean)
              }

              if (imageIds.length > 0) {
                photoUrls = imageIds.map(
                  (imgId: string) =>
                    `${LIGHTSAIL_BASE_URL}/properties/${id}/${imgId.trim()}.jpg`
                )
                thumbnailUrl = photoUrls[0]
              }
            }

            // Fallback para post_image_url
            const postImageUrl = cleanString(values[53])
            if (!thumbnailUrl && postImageUrl) {
              thumbnailUrl = postImageUrl
            }
          } catch (error) {
            // Ignorar erros de parsing de fotos
          }

          const property = {
            id,
            kind: parseInt(values[1]) || 0,
            deleted,
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
            pic_numb: picNumb,
            field_312: cleanString(values[64]),
            field_313: cleanString(values[65]),
            field_308: cleanString(values[66]),
            photo_urls: photoUrls,
            thumbnail_url: thumbnailUrl,
          }

          if (property.id > 0) {
            properties.push(property)
          }
        }
      }
    }
  }

  return properties
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function importDeletedAsArchived() {
  console.log('📦 IMPORTANDO PROPERTIES DELETADAS COMO ARCHIVED')
  console.log('═'.repeat(60))
  console.log()

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

  // 1. Parse deleted properties
  console.log('📖 Carregando properties deletadas do SQL...')
  const deletedProps = parseDeletedPropertiesFromSQL(SQL_FILE)
  console.log(`   ✓ ${deletedProps.length} properties deletadas encontradas`)
  console.log()

  // 2. Verificar quais já existem
  console.log('🔍 Verificando existentes no Supabase...')
  const { data: existing } = await supabase
    .from('wordpress_properties')
    .select('wp_id')

  const existingWpIds = new Set(existing?.map((p) => p.wp_id) || [])
  const toImport = deletedProps.filter((p) => !existingWpIds.has(p.id))

  console.log(`   ✓ ${toImport.length} properties para importar`)
  console.log(`   ⊗ ${deletedProps.length - toImport.length} já existem`)
  console.log()

  if (toImport.length === 0) {
    console.log('✅ Nada para importar!')
    return
  }

  // 3. Import em batches
  console.log(`📤 Importando em batches de ${BATCH_SIZE}...`)
  console.log('─'.repeat(60))

  let success = 0
  let failed = 0
  const totalBatches = Math.ceil(toImport.length / BATCH_SIZE)

  for (let i = 0; i < toImport.length; i += BATCH_SIZE) {
    const batch = toImport.slice(i, i + BATCH_SIZE)
    const batchNum = Math.floor(i / BATCH_SIZE) + 1
    const progress = ((i / toImport.length) * 100).toFixed(1)

    process.stdout.write(
      `\nBatch ${batchNum}/${totalBatches} (${progress}%) `
    )

    const records = batch.map((prop) => ({
      wp_id: prop.id,
      data: prop,
      status: 'archived', // Badge: archived
      photo_count: prop.photo_urls?.length || 0,
      photo_urls: prop.photo_urls || [],
      thumbnail_url: prop.thumbnail_url,
      notes: 'Property deletada na origem (deleted=1)',
    }))

    const { error } = await supabase
      .from('wordpress_properties')
      .insert(records)

    if (error) {
      console.log(`\n   ❌ Batch error: ${error.message}`)
      // Tentar uma por uma para identificar duplicatas
      for (const record of records) {
        const { error: singleError } = await supabase
          .from('wordpress_properties')
          .insert(record)

        if (singleError) {
          if (singleError.code === '23505') {
            // Duplicate
            process.stdout.write('S')
          } else {
            process.stdout.write('X')
            failed++
          }
        } else {
          process.stdout.write('.')
          success++
        }
      }
    } else {
      success += batch.length
      process.stdout.write('.'.repeat(batch.length))
    }

    await sleep(300)
  }

  console.log('\n')
  console.log('─'.repeat(60))
  console.log('✅ Importação concluída!')
  console.log()
  console.log(`📊 Resultados:`)
  console.log(`   ✓ Sucesso:  ${success}`)
  console.log(`   ✗ Falhas:   ${failed}`)
  console.log()
  console.log('═'.repeat(60))
  console.log('📋 BADGES DE CLASSIFICAÇÃO:')
  console.log('   🟢 pending:  Properties ativas aguardando review')
  console.log('   📦 archived: Properties deletadas na origem')
  console.log('   ✅ approved: Properties aprovadas para Sanity')
  console.log('   ❌ rejected: Properties rejeitadas no review')
  console.log('═'.repeat(60))
}

importDeletedAsArchived().catch((error) => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})
