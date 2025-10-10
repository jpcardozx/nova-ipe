#!/usr/bin/env tsx
/**
 * Migração em batch de fotos do Lightsail para Cloudflare R2
 * Processa todas as properties com fotos (pic_numb > 0)
 */

import { WordPressCatalogService } from '../lib/services/wordpress-catalog-service'
import { CloudflareR2Service } from '../lib/services/cloudflare-r2-service'

async function migrateAll() {
  console.log('📸 Migração em Batch: Lightsail → Cloudflare R2')
  console.log('═'.repeat(60))
  console.log('')

  let page = 1
  let hasMore = true
  let totalProcessed = 0
  let totalSuccess = 0
  let totalFailed = 0
  let totalPhotos = 0

  try {
    while (hasMore) {
      console.log(`\n📦 Processando página ${page}...`)
      
      const { properties, totalPages } = await WordPressCatalogService.getProperties({
        page,
        limit: 30
      })

      console.log(`   Encontradas ${properties.length} properties nesta página`)

      for (const prop of properties) {
        // Só migra se tem fotos E ainda não foi migrado
        if (prop.photo_count > 0 && (!prop.photo_urls || prop.photo_urls.length === 0)) {
          totalProcessed++
          
          console.log(`\n   [${totalProcessed}] Property ${prop.wp_id}`)
          console.log(`      Título: ${prop.data.field_313 || prop.data.field_312 || 'Sem título'}`)
          console.log(`      Fotos: ${prop.photo_count}`)
          
          try {
            const urls = await WordPressCatalogService.migratePhotosFromLightsail(
              prop.wp_id,
              prop.photo_count,
              (current, total) => {
                process.stdout.write(`\r      ⏳ Progresso: ${current}/${total} fotos`)
              }
            )
            
            console.log(`\n      ✅ ${urls.length}/${prop.photo_count} fotos migradas com sucesso!`)
            totalSuccess++
            totalPhotos += urls.length
            
          } catch (error) {
            console.log(`\n      ❌ Erro ao migrar:`, error instanceof Error ? error.message : error)
            totalFailed++
          }
        } else if (prop.photo_urls && prop.photo_urls.length > 0) {
          console.log(`\n   [Skip] Property ${prop.wp_id} - Já migrado (${prop.photo_urls.length} fotos)`)
        }
      }

      hasMore = page < totalPages
      page++
      
      // Pausa entre páginas para não sobrecarregar
      if (hasMore) {
        console.log('\n   ⏸️  Pausa de 2 segundos...')
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }

    // Estatísticas finais
    console.log('\n')
    console.log('═'.repeat(60))
    console.log('📊 Estatísticas Finais')
    console.log('═'.repeat(60))
    console.log(`\n✅ Properties processadas: ${totalProcessed}`)
    console.log(`✅ Migrações bem-sucedidas: ${totalSuccess}`)
    console.log(`❌ Migrações com erro: ${totalFailed}`)
    console.log(`📸 Total de fotos migradas: ${totalPhotos}`)
    
    if (totalSuccess > 0) {
      console.log('\n🌩️  Cloudflare R2 Storage:')
      const stats = await CloudflareR2Service.getStorageStats()
      console.log(`   Total de arquivos: ${stats.totalFiles}`)
      console.log(`   Tamanho total: ${stats.totalSizeGB} GB`)
      console.log(`   Custo mensal: $${stats.monthlyCost}`)
      console.log(`   Custo anual: $${(parseFloat(stats.monthlyCost) * 12).toFixed(2)}`)
    }

    console.log('\n🎉 Migração concluída!')
    console.log('\n📋 Próximos passos:')
    console.log('   1. Acesse http://localhost:3000/dashboard/wordpress-catalog')
    console.log('   2. Verifique se as fotos aparecem nos cards')
    console.log('   3. Revise e aprove as melhores fichas')
    console.log('   4. Migre aprovadas para o Sanity')
    console.log('')

  } catch (error) {
    console.error('\n❌ Erro durante migração em batch:', error)
    console.error('\n📊 Estatísticas até o erro:')
    console.error(`   Properties processadas: ${totalProcessed}`)
    console.error(`   Sucessos: ${totalSuccess}`)
    console.error(`   Falhas: ${totalFailed}`)
    process.exit(1)
  }
}

// Confirmação antes de executar
console.log('⚠️  Este script irá migrar TODAS as fotos do Lightsail para R2.')
console.log('⚠️  Isso pode levar 30-60 minutos dependendo da conexão.')
console.log('')
console.log('💰 Custo estimado no R2:')
console.log('   ~761 properties × 8 fotos × 500KB = ~3GB')
console.log('   $0.015/GB × 3GB = $0.045/mês')
console.log('')

// Adiciona timeout para dar tempo de ler
setTimeout(() => {
  console.log('🚀 Iniciando migração em 3 segundos...')
  setTimeout(() => migrateAll(), 3000)
}, 2000)
