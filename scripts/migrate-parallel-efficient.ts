import { WordPressCatalogService } from '../lib/services/wordpress-catalog-service'
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

// Carregar variáveis de ambiente
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

const LIGHTSAIL_BASE = 'http://13.223.237.99/wp-content/uploads/WPL'
const PARALLEL_LIMIT = 5 // Processar 5 propriedades ao mesmo tempo
const CACHE_FILE = 'migration-cache.json'

interface CacheData {
  migratedIds: number[]
  unavailableIds: number[]
  lastUpdated: string
}

interface MigrationResult {
  wpId: number
  success: boolean
  photosCount: number
  error?: string
}

// Carregar cache
function loadCache(): CacheData {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'))
    }
  } catch {}
  return { migratedIds: [], unavailableIds: [], lastUpdated: new Date().toISOString() }
}

// Salvar cache
function saveCache(cache: CacheData) {
  cache.lastUpdated = new Date().toISOString()
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2))
}

// Buscar propriedades já no R2
async function getR2Properties(): Promise<Set<number>> {
  const r2Props = new Set<number>()
  let continuationToken: string | undefined
  
  do {
    const command = new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME!,
      MaxKeys: 1000,
      ContinuationToken: continuationToken,
      Prefix: 'wordpress-photos/'
    })
    
    const response = await s3Client.send(command)
    
    if (response.Contents) {
      for (const obj of response.Contents) {
        const match = obj.Key?.match(/wordpress-photos\/(\d+)\//)
        if (match) {
          r2Props.add(parseInt(match[1]))
        }
      }
    }
    
    continuationToken = response.NextContinuationToken
  } while (continuationToken)
  
  return r2Props
}

// Testar disponibilidade (mais rápido - só testa primeira foto)
async function quickTestAvailability(wpId: number): Promise<boolean> {
  const testUrl = `${LIGHTSAIL_BASE}/${wpId}/img_foto01.jpg`
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 2000) // 2s timeout
    
    const response = await fetch(testUrl, { 
      method: 'HEAD',
      signal: controller.signal
    })
    
    clearTimeout(timeout)
    return response.ok
  } catch {
    return false
  }
}

// Migrar uma propriedade
async function migrateOne(wpId: number, photoCount: number): Promise<MigrationResult> {
  try {
    const uploadedUrls = await WordPressCatalogService.migratePhotosFromLightsail(
      wpId,
      photoCount,
      () => {} // Sem callback para ser mais rápido
    )
    
    return {
      wpId,
      success: uploadedUrls.length > 0,
      photosCount: uploadedUrls.length,
    }
  } catch (error: any) {
    return {
      wpId,
      success: false,
      photosCount: 0,
      error: error.message
    }
  }
}

// Processar batch em paralelo
async function processBatch(
  properties: Array<{ wpId: number; photoCount: number }>,
  cache: CacheData
): Promise<MigrationResult[]> {
  const promises = properties.map(prop => migrateOne(prop.wpId, prop.photoCount))
  return await Promise.all(promises)
}

async function migrateEfficient() {
  console.log('🚀 MIGRAÇÃO PARALELA EFICIENTE')
  console.log('=' .repeat(70))
  console.log(`Limite paralelo: ${PARALLEL_LIMIT} propriedades simultâneas`)
  console.log('=' .repeat(70))
  
  const startTime = Date.now()
  const cache = loadCache()
  
  let stats = {
    total: 0,
    alreadyMigrated: cache.migratedIds.length,
    alreadyUnavailable: cache.unavailableIds.length,
    tested: 0,
    available: 0,
    migrated: 0,
    failed: 0,
    unavailable: 0,
    photosUploaded: 0
  }
  
  try {
    // 1. Buscar propriedades já no R2
    console.log('\n📦 Verificando R2...')
    const r2Properties = await getR2Properties()
    console.log(`✅ ${r2Properties.size} propriedades já no R2`)
    
    // 2. Buscar todas propriedades do banco
    console.log('\n📋 Buscando propriedades do banco...')
    const { data: allProperties, error } = await supabase
      .from('wordpress_properties')
      .select('wp_id, photo_count')
      .gt('photo_count', 0)
      .order('wp_id')
    
    if (error) throw error
    
    // Filtrar as que precisam migração
    const toMigrate = allProperties.filter(p => 
      !r2Properties.has(p.wp_id) && 
      !cache.unavailableIds.includes(p.wp_id)
    )
    
    stats.total = toMigrate.length
    console.log(`✅ ${stats.total} propriedades para processar`)
    console.log(`⏭️  ${cache.unavailableIds.length} já identificadas como indisponíveis\n`)
    
    if (stats.total === 0) {
      console.log('🎉 Não há mais nada para migrar!')
      return
    }
    
    // 3. Processar em batches paralelos
    console.log('🔄 INICIANDO MIGRAÇÃO PARALELA')
    console.log('=' .repeat(70))
    
    const totalBatches = Math.ceil(stats.total / PARALLEL_LIMIT)
    
    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const start = batchIndex * PARALLEL_LIMIT
      const end = Math.min(start + PARALLEL_LIMIT, stats.total)
      const batch = toMigrate.slice(start, end)
      
      const progress = ((start / stats.total) * 100).toFixed(1)
      console.log(`\n📦 Batch ${batchIndex + 1}/${totalBatches} [${progress}%]`)
      
      // Testar disponibilidade em paralelo
      const availabilityTests = await Promise.all(
        batch.map(async p => ({
          prop: p,
          available: await quickTestAvailability(p.wp_id)
        }))
      )
      
      // Filtrar apenas disponíveis
      const available = availabilityTests.filter(t => t.available).map(t => t.prop)
      const unavailable = availabilityTests.filter(t => !t.available).map(t => t.prop)
      
      // Registrar indisponíveis no cache
      unavailable.forEach(p => {
        if (!cache.unavailableIds.includes(p.wp_id)) {
          cache.unavailableIds.push(p.wp_id)
        }
        stats.unavailable++
        console.log(`   ⏭️  wp_id ${p.wp_id}: Indisponível`)
      })
      
      if (available.length === 0) {
        console.log(`   ⚠️  Nenhuma propriedade disponível neste batch`)
        continue
      }
      
      // Migrar disponíveis em paralelo
      console.log(`   🔄 Migrando ${available.length} propriedades...`)
      const mappedBatch = available.map(p => ({ wpId: p.wp_id, photoCount: p.photo_count }))
      const results = await processBatch(mappedBatch, cache)
      
      // Processar resultados
      for (const result of results) {
        if (result.success) {
          stats.migrated++
          stats.photosUploaded += result.photosCount
          cache.migratedIds.push(result.wpId)
          console.log(`   ✅ wp_id ${result.wpId}: ${result.photosCount} fotos`)
        } else {
          stats.failed++
          console.log(`   ❌ wp_id ${result.wpId}: ${result.error || 'Erro desconhecido'}`)
        }
      }
      
      // Salvar cache a cada batch
      saveCache(cache)
      
      // Status do batch
      const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1)
      console.log(`   ⏱️  ${elapsed}min | ✅ ${stats.migrated} | ❌ ${stats.failed} | ⏭️  ${stats.unavailable}`)
    }
    
    // 4. Relatório final
    const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1)
    
    console.log('\n\n📊 RELATÓRIO FINAL')
    console.log('=' .repeat(70))
    console.log(`⏱️  Tempo total: ${duration} minutos`)
    console.log(`📋 Total processado: ${stats.total}`)
    console.log(`✅ Migradas com sucesso: ${stats.migrated}`)
    console.log(`❌ Falhas: ${stats.failed}`)
    console.log(`⏭️  Indisponíveis: ${stats.unavailable}`)
    console.log(`📸 Total de fotos migradas: ${stats.photosUploaded}`)
    
    // Velocidade
    const propsPerMin = (stats.migrated / parseFloat(duration)).toFixed(1)
    console.log(`⚡ Velocidade: ${propsPerMin} propriedades/minuto`)
    
    // Verificar R2 atualizado
    console.log('\n📦 Verificando R2 atualizado...')
    const updatedR2 = await getR2Properties()
    console.log(`✅ Total no R2 agora: ${updatedR2.size} propriedades`)
    
    const remaining = allProperties.length - updatedR2.size
    console.log(`⏳ Restantes: ${remaining} propriedades`)
    
    if (remaining > 0) {
      console.log('\n💡 Para continuar, execute novamente:')
      console.log('   pnpm tsx scripts/migrate-parallel-efficient.ts')
    } else {
      console.log('\n🎉 MIGRAÇÃO 100% COMPLETA!')
      console.log('\n✨ Próximo passo: Validar no dashboard')
      console.log('   http://localhost:3001/dashboard/wordpress-catalog')
    }
    
    // Limpar cache se completo
    if (remaining === 0) {
      fs.unlinkSync(CACHE_FILE)
      console.log('\n🧹 Cache limpo')
    }
    
  } catch (error: any) {
    console.error('\n❌ ERRO:', error.message)
    console.error('💾 Progresso salvo em cache. Execute novamente para continuar.')
    saveCache(cache)
    process.exit(1)
  }
}

// Verificar interrupção
process.on('SIGINT', () => {
  console.log('\n\n⚠️  Migração interrompida pelo usuário')
  console.log('💾 Progresso foi salvo. Execute novamente para continuar:')
  console.log('   pnpm tsx scripts/migrate-parallel-efficient.ts')
  process.exit(0)
})

migrateEfficient()
