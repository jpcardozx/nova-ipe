import { WordPressCatalogService } from '../lib/services/wordpress-catalog-service'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Carregar variáveis de ambiente
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const LIGHTSAIL_BASE = 'http://13.223.237.99/wp-content/uploads/WPL'

interface MigrationStats {
  total: number
  tested: number
  available: number
  migrated: number
  failed: number
  skipped: number
  unavailable: number
  photosUploaded: number
  bytesTransferred: number
  errors: Array<{ wpId: number; error: string }>
  unavailableProperties: Array<{ wpId: number; photoCount: number }>
}

async function testPhotoAvailability(wpId: number): Promise<boolean> {
  // Testa as 3 primeiras fotos - se pelo menos 1 existir, vale migrar
  const testUrls = [
    `${LIGHTSAIL_BASE}/${wpId}/img_foto01.jpg`,
    `${LIGHTSAIL_BASE}/${wpId}/img_foto02.jpg`,
    `${LIGHTSAIL_BASE}/${wpId}/img_foto03.jpg`
  ]
  
  let foundAny = false
  for (const url of testUrls) {
    try {
      const response = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(3000) })
      if (response.ok) {
        foundAny = true
        break
      }
    } catch {
      continue
    }
  }
  
  return foundAny
}

async function migrateAvailablePhotos() {
  console.log('🚀 MIGRAÇÃO INTELIGENTE PARA R2')
  console.log('=' .repeat(70))
  console.log('Estratégia: Testar disponibilidade antes de migrar')
  console.log('=' .repeat(70))
  
  const stats: MigrationStats = {
    total: 0,
    tested: 0,
    available: 0,
    migrated: 0,
    failed: 0,
    skipped: 0,
    unavailable: 0,
    photosUploaded: 0,
    bytesTransferred: 0,
    errors: [],
    unavailableProperties: []
  }
  
  const startTime = Date.now()
  
  try {
    // 1. Buscar propriedades sem R2
    console.log('\n📋 Buscando propriedades...')
    const { data: allProperties, error } = await supabase
      .from('wordpress_properties')
      .select('wp_id, photo_count, photo_urls')
      .gt('photo_count', 0)
      .order('wp_id')
    
    if (error) {
      console.error('❌ Erro ao buscar propriedades:', error.message)
      return
    }
    
    // Filtrar apenas as sem R2
    const withoutR2 = allProperties.filter(p => {
      const urls = Array.isArray(p.photo_urls) ? p.photo_urls : []
      return !urls.some((url: string) => url.includes('r2.cloudflarestorage.com'))
    })
    
    stats.total = withoutR2.length
    console.log(`✅ Encontradas ${stats.total} propriedades para migrar\n`)
    
    // 2. Processar em lotes
    const BATCH_SIZE = 50
    const totalBatches = Math.ceil(stats.total / BATCH_SIZE)
    
    console.log('🔄 INICIANDO MIGRAÇÃO')
    console.log('=' .repeat(70))
    
    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const start = batchIndex * BATCH_SIZE
      const end = Math.min(start + BATCH_SIZE, stats.total)
      const batch = withoutR2.slice(start, end)
      
      console.log(`\n📦 Lote ${batchIndex + 1}/${totalBatches} (propriedades ${start + 1}-${end})`)
      console.log('-'.repeat(70))
      
      for (const prop of batch) {
        const wpId = prop.wp_id
        const photoCount = prop.photo_count
        
        stats.tested++
        const progress = ((stats.tested / stats.total) * 100).toFixed(1)
        
        // Testar disponibilidade
        process.stdout.write(`\r   [${progress}%] 🔍 Testando wp_id ${wpId}...`)
        const isAvailable = await testPhotoAvailability(wpId)
        
        if (!isAvailable) {
          stats.unavailable++
          stats.unavailableProperties.push({ wpId, photoCount })
          process.stdout.write(`\r   [${progress}%] ⏭️  wp_id ${wpId}: Fotos indisponíveis (404)\n`)
          continue
        }
        
        stats.available++
        
        // Migrar
        try {
          process.stdout.write(`\r   [${progress}%] 📤 Migrando wp_id ${wpId} (${photoCount} fotos)...`)
          
          const uploadedUrls = await WordPressCatalogService.migratePhotosFromLightsail(
            wpId,
            photoCount,
            (uploaded, total) => {
              // Progress callback
            }
          )
          
          if (uploadedUrls && uploadedUrls.length > 0) {
            stats.migrated++
            stats.photosUploaded += uploadedUrls.length
            // Estimativa de tamanho: ~130KB por foto (média observada)
            stats.bytesTransferred += uploadedUrls.length * 130 * 1024
            
            process.stdout.write(
              `\r   [${progress}%] ✅ wp_id ${wpId}: ${uploadedUrls.length} fotos migradas\n`
            )
          } else {
            stats.failed++
            const error = 'Nenhuma foto foi migrada'
            stats.errors.push({ wpId, error })
            process.stdout.write(`\r   [${progress}%] ❌ wp_id ${wpId}: ${error}\n`)
          }
          
        } catch (err: any) {
          stats.failed++
          stats.errors.push({ wpId, error: err.message })
          process.stdout.write(`\r   [${progress}%] ❌ wp_id ${wpId}: ${err.message}\n`)
        }
        
        // Delay mínimo entre propriedades
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
      // Status do lote
      console.log('-'.repeat(70))
      console.log(`Lote ${batchIndex + 1}: ✅ ${stats.migrated} | ❌ ${stats.failed} | ⏭️  ${stats.unavailable}`)
    }
    
    // 3. Relatório final
    const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1)
    const sizeMB = (stats.bytesTransferred / 1024 / 1024).toFixed(2)
    const monthlyCost = ((stats.bytesTransferred / 1024 / 1024 / 1024) * 0.015).toFixed(4)
    
    console.log('\n\n📊 RELATÓRIO FINAL')
    console.log('=' .repeat(70))
    console.log(`⏱️  Tempo total: ${duration} minutos`)
    console.log(`📋 Propriedades testadas: ${stats.tested}/${stats.total}`)
    console.log(`✅ Disponíveis no Lightsail: ${stats.available} (${((stats.available/stats.tested)*100).toFixed(1)}%)`)
    console.log(`⏭️  Indisponíveis no Lightsail: ${stats.unavailable} (${((stats.unavailable/stats.tested)*100).toFixed(1)}%)`)
    console.log(`🎯 Migradas com sucesso: ${stats.migrated}`)
    console.log(`❌ Falhas na migração: ${stats.failed}`)
    console.log(`📸 Total de fotos migradas: ${stats.photosUploaded}`)
    console.log(`💾 Dados transferidos: ${sizeMB} MB`)
    console.log(`💰 Custo mensal estimado: $${monthlyCost}`)
    
    if (stats.errors.length > 0) {
      console.log(`\n❌ ERROS (${stats.errors.length})`)
      console.log('-'.repeat(70))
      stats.errors.slice(0, 10).forEach(({ wpId, error }) => {
        console.log(`   wp_id ${wpId}: ${error}`)
      })
      if (stats.errors.length > 10) {
        console.log(`   ... e mais ${stats.errors.length - 10} erros`)
      }
    }
    
    if (stats.unavailableProperties.length > 0) {
      console.log(`\n⚠️  FOTOS INDISPONÍVEIS (${stats.unavailableProperties.length} propriedades)`)
      console.log('-'.repeat(70))
      console.log('Estas propriedades não têm fotos disponíveis no Lightsail:')
      stats.unavailableProperties.slice(0, 20).forEach(({ wpId, photoCount }) => {
        console.log(`   wp_id ${wpId}: ${photoCount} fotos esperadas`)
      })
      if (stats.unavailableProperties.length > 20) {
        console.log(`   ... e mais ${stats.unavailableProperties.length - 20} propriedades`)
      }
      console.log('\n💡 Sugestão: Verificar backup do Lightsail para recuperar estas fotos')
    }
    
    console.log('\n✨ PRÓXIMOS PASSOS')
    console.log('=' .repeat(70))
    console.log('1. ✅ Verificar fotos no dashboard: http://localhost:3001/dashboard/wordpress-catalog')
    console.log('2. 📊 Validar carregamento e performance')
    console.log('3. 🔍 Investigar fotos indisponíveis (se necessário)')
    
    if (stats.migrated > 0) {
      console.log('\n🎉 Migração concluída com sucesso!')
    }
    
  } catch (error: any) {
    console.error('\n❌ ERRO FATAL:', error.message)
    console.error(error.stack)
    process.exit(1)
  }
}

migrateAvailablePhotos()
