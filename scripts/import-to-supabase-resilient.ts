#!/usr/bin/env tsx
/**
 * Import WordPress properties to Supabase with resilient error handling
 * - Retry logic with exponential backoff
 * - Batch processing
 * - Detailed error logging
 */

import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { WordPressCatalogService } from '../lib/services/wordpress-catalog-service'
import { parsePropertiesFromSQL } from './wordpress-importer/importer'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const SQL_FILE = 'exports/imoveis/imoveis-export-20251008/database/imoveis-completo.sql'
const BATCH_SIZE = 10
const MAX_RETRIES = 3
const INITIAL_BACKOFF = 1000 // 1 segundo

interface ImportResult {
  success: number
  failed: number
  skipped: number
  errors: Array<{ wp_id: number; error: string }>
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function importWithRetry(
  property: any,
  retryCount = 0
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false },
      global: {
        fetch: (url, options = {}) => {
          return fetch(url, {
            ...options,
            signal: AbortSignal.timeout(30000), // 30s timeout
          })
        },
      },
    })

    const { error } = await supabase.from('wordpress_properties').insert({
      wp_id: property.id,
      data: property,
      status: 'pending',
      photo_count: property.post_image_count || 0,
      photo_urls: property.gallery_image_ids
        ? JSON.parse(property.gallery_image_ids)
        : [],
      thumbnail_url: property.post_image_url || null,
    })

    if (error) {
      // Duplicate - skip
      if (error.code === '23505') {
        return { success: true }
      }
      throw error
    }

    return { success: true }
  } catch (error: any) {
    // Retry on network errors
    if (
      retryCount < MAX_RETRIES &&
      (error.message?.includes('fetch failed') ||
        error.message?.includes('timeout') ||
        error.message?.includes('ECONNRESET'))
    ) {
      const backoff = INITIAL_BACKOFF * Math.pow(2, retryCount)
      console.log(
        `   ⏳ Retry ${retryCount + 1}/${MAX_RETRIES} for property ${property.id} in ${backoff}ms...`
      )
      await sleep(backoff)
      return importWithRetry(property, retryCount + 1)
    }

    return {
      success: false,
      error: error.message || String(error),
    }
  }
}

async function importBatch(
  properties: any[],
  startIndex: number
): Promise<ImportResult> {
  const result: ImportResult = {
    success: 0,
    failed: 0,
    skipped: 0,
    errors: [],
  }

  const batch = properties.slice(startIndex, startIndex + BATCH_SIZE)

  for (const property of batch) {
    const { success, error } = await importWithRetry(property)

    if (success) {
      result.success++
      process.stdout.write('.')
    } else {
      result.failed++
      result.errors.push({ wp_id: property.ID, error: error! })
      process.stdout.write('X')
    }
  }

  return result
}

async function main() {
  console.log('🚀 WordPress → Supabase Import (Resilient)')
  console.log('═'.repeat(60))
  console.log()

  // Parse SQL
  console.log(`📖 Arquivo SQL: ${SQL_FILE}`)
  console.log('🔍 Extraindo properties do SQL...')
  const properties = parsePropertiesFromSQL(SQL_FILE)
  console.log(`✓ ${properties.length} properties encontradas`)
  console.log()

  // Check existing
  let existingCount = 0
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
    const { count } = await supabase
      .from('wordpress_properties')
      .select('*', { count: 'exact', head: true })
    existingCount = count || 0
  } catch (error) {
    console.log('⚠️  Could not check existing count, proceeding anyway...')
  }

  console.log(`📊 Estado atual: ${existingCount} registros no Supabase`)
  console.log()

  // Import in batches
  console.log(`📤 Importando em batches de ${BATCH_SIZE}...`)
  console.log('─'.repeat(60))

  const totalResult: ImportResult = {
    success: 0,
    failed: 0,
    skipped: 0,
    errors: [],
  }

  const totalBatches = Math.ceil(properties.length / BATCH_SIZE)

  for (let i = 0; i < properties.length; i += BATCH_SIZE) {
    const batchNumber = Math.floor(i / BATCH_SIZE) + 1
    const progress = ((i / properties.length) * 100).toFixed(1)

    process.stdout.write(
      `\nBatch ${batchNumber}/${totalBatches} (${progress}%) `
    )

    const batchResult = await importBatch(properties, i)

    totalResult.success += batchResult.success
    totalResult.failed += batchResult.failed
    totalResult.skipped += batchResult.skipped
    totalResult.errors.push(...batchResult.errors)

    // Small delay between batches
    await sleep(500)
  }

  console.log()
  console.log()
  console.log('─'.repeat(60))
  console.log('✅ Importação concluída!')
  console.log()
  console.log(`📊 Resultados:`)
  console.log(`   ✓ Sucesso:  ${totalResult.success}`)
  console.log(`   ✗ Falhas:   ${totalResult.failed}`)
  console.log(`   ⊗ Ignoradas: ${totalResult.skipped}`)
  console.log()

  if (totalResult.errors.length > 0) {
    console.log(`❌ Erros detalhados:`)
    totalResult.errors.slice(0, 10).forEach(({ wp_id, error }) => {
      console.log(`   Property ${wp_id}: ${error}`)
    })
    if (totalResult.errors.length > 10) {
      console.log(`   ... e mais ${totalResult.errors.length - 10} erros`)
    }
  }

  console.log()
  console.log('═'.repeat(60))

  // Exit with error if too many failures
  if (totalResult.failed > properties.length * 0.1) {
    console.log('⚠️  Mais de 10% de falhas - verifique conexão')
    process.exit(1)
  }
}

main().catch((error) => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})
