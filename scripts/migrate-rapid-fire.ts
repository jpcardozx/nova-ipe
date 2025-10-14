import { WordPressCatalogService } from '../lib/services/wordpress-catalog-service'
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

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
        if (match) r2Props.add(parseInt(match[1]))
      }
    }
    
    continuationToken = response.NextContinuationToken
  } while (continuationToken)
  
  return r2Props
}

async function migrateRapidFire() {
  console.log('⚡ MIGRAÇÃO RÁPIDA - SEM TESTE PRÉVIO')
  console.log('=' .repeat(70))
  console.log('Estratégia: Migrar direto, falhas são registradas e puladas')
  console.log('=' .repeat(70))
  
  const startTime = Date.now()
  let stats = {
    total: 0,
    migrated: 0,
    failed: 0,
    photosUploaded: 0,
    processed: 0
  }
  
  try {
    console.log('\n📦 Verificando R2...')
    const r2Properties = await getR2Properties()
    console.log(`✅ ${r2Properties.size} propriedades já no R2`)
    
    console.log('\n📋 Buscando propriedades...')
    const { data: allProperties, error } = await supabase
      .from('wordpress_properties')
      .select('wp_id, photo_count')
      .gt('photo_count', 0)
      .order('wp_id')
    
    if (error) throw error
    
    const toMigrate = allProperties.filter(p => !r2Properties.has(p.wp_id))
    stats.total = toMigrate.length
    
    console.log(`✅ ${stats.total} propriedades para migrar`)
    console.log('\n🚀 INICIANDO (processamento contínuo, sem testes)')
    console.log('=' .repeat(70))
    
    for (const prop of toMigrate) {
      stats.processed++
      const progress = ((stats.processed / stats.total) * 100).toFixed(1)
      
      try {
        process.stdout.write(`\r[${progress}%] 📤 wp_id ${prop.wp_id} (${prop.photo_count} fotos)...`)
        
        const uploadedUrls = await WordPressCatalogService.migratePhotosFromLightsail(
          prop.wp_id,
          prop.photo_count,
          () => {}
        )
        
        if (uploadedUrls.length > 0) {
          stats.migrated++
          stats.photosUploaded += uploadedUrls.length
          process.stdout.write(`\r[${progress}%] ✅ wp_id ${prop.wp_id}: ${uploadedUrls.length} fotos migradas\n`)
        } else {
          stats.failed++
          process.stdout.write(`\r[${progress}%] ⏭️  wp_id ${prop.wp_id}: Sem fotos disponíveis\n`)
        }
        
      } catch (error: any) {
        stats.failed++
        process.stdout.write(`\r[${progress}%] ❌ wp_id ${prop.wp_id}: Erro\n`)
      }
      
      // Mostrar stats a cada 20 propriedades
      if (stats.processed % 20 === 0) {
        const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1)
        const rate = (stats.migrated / parseFloat(elapsed)).toFixed(1)
        console.log(`   💫 ${elapsed}min | ✅ ${stats.migrated} | ❌ ${stats.failed} | ⚡ ${rate}/min`)
      }
    }
    
    // Relatório final
    const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1)
    const rate = (stats.migrated / parseFloat(duration)).toFixed(1)
    
    console.log('\n\n📊 RELATÓRIO FINAL')
    console.log('=' .repeat(70))
    console.log(`⏱️  Tempo: ${duration} minutos`)
    console.log(`📋 Processadas: ${stats.processed}/${stats.total}`)
    console.log(`✅ Migradas: ${stats.migrated}`)
    console.log(`❌ Falhas/Indisponíveis: ${stats.failed}`)
    console.log(`📸 Fotos migradas: ${stats.photosUploaded}`)
    console.log(`⚡ Taxa: ${rate} propriedades/minuto`)
    
    console.log('\n📦 Verificando R2 final...')
    const finalR2 = await getR2Properties()
    console.log(`✅ Total no R2: ${finalR2.size} propriedades`)
    console.log(`⏳ Restantes: ${allProperties.length - finalR2.size}`)
    
    if (finalR2.size === allProperties.length) {
      console.log('\n🎉 100% COMPLETO!')
    } else {
      console.log('\n✨ Migração concluída! Restantes são propriedades sem fotos disponíveis.')
    }
    
    console.log('\n🎯 Próximo passo:')
    console.log('   http://localhost:3001/dashboard/wordpress-catalog')
    
  } catch (error: any) {
    console.error('\n❌ ERRO:', error.message)
    process.exit(1)
  }
}

migrateRapidFire()
