#!/usr/bin/env tsx
/**
 * Upload de fotos LOCAIS (já baixadas) para Cloudflare R2
 * Lê de: exports/imoveis/imoveis-export-20251008/fotos-completas/
 * Atualiza photo_urls no Supabase
 */

import fs from 'fs'
import path from 'path'
import { CloudflareR2Service } from '../lib/services/cloudflare-r2-service'
import { WordPressCatalogService } from '../lib/services/wordpress-catalog-service'

const PHOTOS_DIR = '/home/jpcardozx/projetos/nova-ipe/exports/imoveis/imoveis-export-20251008/fotos-completas'

interface PropertyFolder {
  wpId: number
  folderPath: string
  photos: string[]
}

async function findPropertyFolders(): Promise<PropertyFolder[]> {
  console.log('📁 Procurando pastas de imóveis...')
  console.log(`   Local: ${PHOTOS_DIR}`)
  console.log('')

  if (!fs.existsSync(PHOTOS_DIR)) {
    throw new Error(`❌ Pasta não encontrada: ${PHOTOS_DIR}`)
  }

  const folders: PropertyFolder[] = []

  // Estrutura esperada: wplpro/properties/{wpId}/
  const wplproPath = path.join(PHOTOS_DIR, 'properties')

  if (fs.existsSync(wplproPath)) {
    const propertyFolders = fs.readdirSync(wplproPath)

    for (const folderName of propertyFolders) {
      const wpId = parseInt(folderName)
      if (isNaN(wpId)) continue

      const folderPath = path.join(wplproPath, folderName)
      const stats = fs.statSync(folderPath)

      if (!stats.isDirectory()) continue

      // Buscar apenas JPGs principais (não thumbnails)
      const allFiles = fs.readdirSync(folderPath)
      const photos = allFiles
        .filter(f => {
          const lower = f.toLowerCase()
          // Pega apenas fotos principais, ignora thumbnails e versões redimensionadas
          return (
            (lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png')) &&
            !lower.includes('thimg_') &&
            !lower.includes('_thumb') &&
            !f.startsWith('.')
          )
        })
        .sort((a, b) => {
          // Ordena por número na foto (img_foto01.jpg, img_foto02.jpg...)
          const numA = parseInt(a.match(/\d+/)?.[0] || '0')
          const numB = parseInt(b.match(/\d+/)?.[0] || '0')
          return numA - numB
        })

      if (photos.length > 0) {
        folders.push({
          wpId,
          folderPath,
          photos
        })
      }
    }
  }

  console.log(`✅ Encontradas ${folders.length} pastas com fotos`)
  console.log('')

  return folders.sort((a, b) => a.wpId - b.wpId)
}

async function uploadPropertyPhotos(
  property: PropertyFolder,
  onProgress?: (current: number, total: number) => void
): Promise<string[]> {
  const uploadedUrls: string[] = []

  for (let i = 0; i < property.photos.length; i++) {
    const photoName = property.photos[i]
    const photoPath = path.join(property.folderPath, photoName)

    try {
      // Ler arquivo local
      const buffer = fs.readFileSync(photoPath)

      // Caminho no R2: wordpress-photos/{wpId}/img_fotoXX.jpg
      const r2Path = `wordpress-photos/${property.wpId}/${photoName}`

      // Upload
      const url = await CloudflareR2Service.uploadFile(buffer, r2Path, 'image/jpeg')
      uploadedUrls.push(url)

      onProgress?.(i + 1, property.photos.length)
    } catch (error) {
      console.error(`      ❌ Erro ao fazer upload de ${photoName}:`, error instanceof Error ? error.message : error)
    }
  }

  return uploadedUrls
}

async function main() {
  console.log('📸 Upload Local → Cloudflare R2')
  console.log('═'.repeat(60))
  console.log('')

  // Buscar pastas locais
  const propertyFolders = await findPropertyFolders()

  if (propertyFolders.length === 0) {
    console.log('⚠️  Nenhuma pasta com fotos encontrada')
    console.log('')
    console.log('Certifique-se que as fotos estão em:')
    console.log(`   ${PHOTOS_DIR}/properties/{wpId}/`)
    console.log('')
    console.log('Execute antes:')
    console.log('   bash scripts/download-photos-from-lightsail.sh')
    return
  }

  console.log('📊 Resumo:')
  console.log(`   Total de imóveis: ${propertyFolders.length}`)
  console.log(`   Total de fotos: ${propertyFolders.reduce((sum, p) => sum + p.photos.length, 0)}`)
  console.log('')

  // Primeiras 5 pastas como preview
  console.log('📋 Preview das primeiras 5 pastas:')
  propertyFolders.slice(0, 5).forEach(p => {
    console.log(`   Property ${p.wpId}: ${p.photos.length} fotos`)
  })
  console.log('')

  console.log('⚠️  Este processo pode levar 30-60 minutos')
  console.log('⚠️  Não interrompa o processo!')
  console.log('')
  console.log('💰 Custo estimado no R2:')
  const totalGB = (propertyFolders.reduce((sum, p) => sum + p.photos.length, 0) * 500) / 1024 / 1024 // ~500KB por foto
  console.log(`   ~${totalGB.toFixed(2)}GB × $0.015/GB = $${(totalGB * 0.015).toFixed(4)}/mês`)
  console.log('')

  // Aguardar 5 segundos
  console.log('🚀 Iniciando em 5 segundos...')
  await new Promise(resolve => setTimeout(resolve, 5000))
  console.log('')

  let processedCount = 0
  let successCount = 0
  let failedCount = 0
  let totalPhotosUploaded = 0

  for (const property of propertyFolders) {
    processedCount++

    console.log(`\n[${processedCount}/${propertyFolders.length}] Property ${property.wpId}`)
    console.log(`   Fotos locais: ${property.photos.length}`)

    try {
      // Verificar se já migrou
      const existing = await WordPressCatalogService.getPropertyByWpId(property.wpId)

      if (!existing) {
        console.log(`   ⚠️  Property ${property.wpId} não encontrada no Supabase (pode ter sido deletada)`)
        failedCount++
        continue
      }

      if (existing.photo_urls && existing.photo_urls.length > 0) {
        console.log(`   ⏭️  Já migrado (${existing.photo_urls.length} URLs no banco)`)
        continue
      }

      // Upload para R2
      const urls = await uploadPropertyPhotos(
        property,
        (current, total) => {
          process.stdout.write(`\r   ⏳ Upload: ${current}/${total} fotos`)
        }
      )

      console.log(`\n   ✅ ${urls.length} fotos enviadas para R2`)

      // Atualizar Supabase
      if (urls.length > 0) {
        await WordPressCatalogService.updatePhotoUrls(property.wpId, urls)
        console.log(`   ✅ URLs atualizadas no Supabase`)
        successCount++
        totalPhotosUploaded += urls.length
      } else {
        console.log(`   ⚠️  Nenhuma foto foi enviada`)
        failedCount++
      }

    } catch (error) {
      console.log(`\n   ❌ Erro:`, error instanceof Error ? error.message : error)
      failedCount++
    }

    // Pausa entre properties
    if (processedCount < propertyFolders.length) {
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  // Estatísticas finais
  console.log('\n')
  console.log('═'.repeat(60))
  console.log('📊 Estatísticas Finais')
  console.log('═'.repeat(60))
  console.log(`\n✅ Properties processadas: ${processedCount}`)
  console.log(`✅ Uploads bem-sucedidos: ${successCount}`)
  console.log(`❌ Falhas: ${failedCount}`)
  console.log(`📸 Total de fotos enviadas: ${totalPhotosUploaded}`)

  if (successCount > 0) {
    console.log('\n🌩️  Cloudflare R2 Storage:')
    const stats = await CloudflareR2Service.getStorageStats()
    console.log(`   Total de arquivos: ${stats.totalFiles}`)
    console.log(`   Tamanho total: ${stats.totalSizeGB} GB`)
    console.log(`   Custo mensal: $${stats.monthlyCost}`)
    console.log(`   Custo anual: $${(parseFloat(stats.monthlyCost) * 12).toFixed(2)}`)
  }

  console.log('\n🎉 Upload concluído!')
  console.log('\n📋 Próximos passos:')
  console.log('   1. Acesse http://localhost:3000/dashboard/wordpress-catalog')
  console.log('   2. Verifique se as fotos aparecem nos cards')
  console.log('   3. Revise e aprove as melhores fichas')
  console.log('')
}

main().catch(error => {
  console.error('\n❌ Erro fatal:', error)
  process.exit(1)
})
