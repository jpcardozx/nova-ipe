#!/usr/bin/env tsx
/**
 * Download fotos do servidor Locaweb e upload direto para R2
 * Processa APENAS imóveis não arquivados
 */

import 'dotenv/config'
import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'
import { WordPressCatalogService } from '../lib/services/wordpress-catalog-service'
import { CloudflareR2Service } from '../lib/services/cloudflare-r2-service'

const execAsync = promisify(exec)

const SSH_HOST = '187.45.193.173'
const SSH_USER = 'imobiliariaipe1'
const SSH_PASS = 'Imobiliaria@10203040'
const SSH_OPTS = '-o StrictHostKeyChecking=no -o HostKeyAlgorithms=+ssh-rsa -o PubkeyAcceptedKeyTypes=+ssh-rsa -p 22'
const REMOTE_WPL_PATH = 'public_html/wp-content/uploads/WPL'
const LOCAL_TEMP_DIR = '/tmp/wpl-photos'

// Criar diretório temporário
if (!fs.existsSync(LOCAL_TEMP_DIR)) {
  fs.mkdirSync(LOCAL_TEMP_DIR, { recursive: true })
}

interface PropertyToMigrate {
  id: string
  wp_id: number
  photo_count: number
  status: string
}

async function getPropertiesToMigrate(): Promise<PropertyToMigrate[]> {
  console.log('📋 Buscando imóveis não arquivados do Supabase...')

  const properties: PropertyToMigrate[] = []
  let page = 1
  let hasMore = true

  while (hasMore) {
    const result = await WordPressCatalogService.getProperties({
      page,
      limit: 100
    })

    // Filtra apenas NÃO ARQUIVADOS, não rejeitados e SEM fotos migradas para R2
    // Prioriza imóveis ativos
    const filtered = result.properties.filter(p =>
      p.status !== 'rejected' &&
      p.status !== 'archived' && // Pula arquivados por enquanto
      p.photo_count > 0 &&
      (
        !p.photo_urls ||
        p.photo_urls.length === 0 ||
        p.photo_urls[0]?.includes('wpl-imoveis.com') // Domínio morto - precisa migrar
      )
    )

    properties.push(...filtered.map(p => ({
      id: p.id,
      wp_id: p.wp_id,
      photo_count: p.photo_count,
      status: p.status
    })))

    hasMore = page < result.totalPages
    page++
  }

  console.log(`✅ Encontrados ${properties.length} imóveis para migrar fotos`)
  return properties.sort((a, b) => a.wp_id - b.wp_id)
}

async function downloadPropertyPhotos(wpId: number, maxPhotos: number): Promise<string[]> {
  const localDir = path.join(LOCAL_TEMP_DIR, String(wpId))

  // Criar diretório local
  if (!fs.existsSync(localDir)) {
    fs.mkdirSync(localDir, { recursive: true })
  }

  // Baixar pasta inteira via rsync (com timeout de 60s)
  const remoteDir = `${REMOTE_WPL_PATH}/${wpId}/`
  const cmd = `timeout 60 sshpass -p '${SSH_PASS}' rsync -avz --timeout=30 -e "ssh ${SSH_OPTS}" ${SSH_USER}@${SSH_HOST}:${remoteDir} ${localDir}/ 2>&1`

  try {
    await execAsync(cmd, { timeout: 70000 }) // 70s no Node.js

    // Listar arquivos baixados (apenas .jpg principais, sem thumbnails)
    // IMPORTANTE: Ordenar por nome para manter img_foto01, img_foto02, etc. em ordem
    const files = fs.readdirSync(localDir)
      .filter(f => {
        const lower = f.toLowerCase()
        return (
          (lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png')) &&
          !lower.includes('thumb') &&
          !lower.startsWith('.') &&
          f.startsWith('img_foto') // Apenas fotos principais (img_fotoXX.jpg)
        )
      })
      .sort((a, b) => {
        // Ordena por número: img_foto01.jpg, img_foto02.jpg, etc.
        const numA = parseInt(a.match(/\d+/)?.[0] || '0')
        const numB = parseInt(b.match(/\d+/)?.[0] || '0')
        return numA - numB
      })
      .slice(0, maxPhotos) // Limita quantidade
      .map(f => path.join(localDir, f))

    return files
  } catch (error) {
    console.error(`   ❌ Erro ao baixar fotos do imóvel ${wpId}:`, error instanceof Error ? error.message : error)
    return []
  }
}

async function uploadPhotosToR2(wpId: number, localPhotos: string[]): Promise<string[]> {
  const uploadedUrls: string[] = []

  for (let i = 0; i < localPhotos.length; i++) {
    const photoPath = localPhotos[i]
    const photoName = path.basename(photoPath)

    try {
      // Ler arquivo local
      const buffer = fs.readFileSync(photoPath)

      // Upload para R2
      const r2Path = `wordpress-photos/${wpId}/${photoName}`
      const url = await CloudflareR2Service.uploadFile(buffer, r2Path, 'image/jpeg')
      uploadedUrls.push(url)

      process.stdout.write(`\r   ⏳ Upload R2: ${i + 1}/${localPhotos.length} fotos`)
    } catch (error) {
      console.error(`\n      ❌ Erro ao fazer upload de ${photoName}:`, error instanceof Error ? error.message : error)
    }
  }

  console.log('') // Nova linha após progresso
  return uploadedUrls
}

function cleanupLocalPhotos(wpId: number) {
  const localDir = path.join(LOCAL_TEMP_DIR, String(wpId))
  if (fs.existsSync(localDir)) {
    fs.rmSync(localDir, { recursive: true, force: true })
  }
}

async function main() {
  console.log('📸 Migração de Fotos: Locaweb → Cloudflare R2')
  console.log('═'.repeat(60))
  console.log('')

  // 1. Buscar imóveis
  const properties = await getPropertiesToMigrate()

  if (properties.length === 0) {
    console.log('✅ Nenhum imóvel pendente de migração de fotos!')
    console.log('   Todas as fotos já foram migradas.')
    return
  }

  console.log('')
  console.log('📊 Resumo:')
  console.log(`   Total de imóveis: ${properties.length}`)
  console.log(`   Total de fotos estimado: ${properties.reduce((sum, p) => sum + p.photo_count, 0)}`)
  console.log('')

  // Preview
  console.log('📋 Primeiros 10 imóveis:')
  properties.slice(0, 10).forEach(p => {
    console.log(`   Property ${p.wp_id}: ${p.photo_count} fotos (status: ${p.status})`)
  })
  console.log('')

  console.log('⚠️  Este processo pode levar 30-90 minutos')
  console.log('⚠️  Fotos serão baixadas temporariamente em /tmp/wpl-photos')
  console.log('⚠️  Após upload para R2, arquivos locais serão deletados')
  console.log('')

  console.log('🚀 Iniciando em 5 segundos...')
  await new Promise(resolve => setTimeout(resolve, 5000))
  console.log('')

  let processedCount = 0
  let successCount = 0
  let failedCount = 0
  let totalPhotosUploaded = 0
  let totalPhotosDownloaded = 0

  for (const property of properties) {
    processedCount++

    console.log(`\n[${processedCount}/${properties.length}] Property ${property.wp_id}`)
    console.log(`   Fotos esperadas: ${property.photo_count}`)

    try {
      // Determinar limite de fotos por status
      const maxPhotos = property.status === 'archived' ? 3 : 30

      // 1. Download do Locaweb
      process.stdout.write(`   ⏳ Download Locaweb (max ${maxPhotos} fotos)...`)
      const localPhotos = await downloadPropertyPhotos(property.wp_id, maxPhotos)

      if (localPhotos.length === 0) {
        console.log(`\r   ⚠️  Nenhuma foto encontrada no servidor`)
        failedCount++
        continue
      }

      console.log(`\r   ✅ Download: ${localPhotos.length} fotos baixadas (limite: ${maxPhotos})`)
      totalPhotosDownloaded += localPhotos.length

      // 2. Upload para R2
      const r2Urls = await uploadPhotosToR2(property.wp_id, localPhotos)

      if (r2Urls.length === 0) {
        console.log(`   ⚠️  Nenhuma foto enviada para R2`)
        failedCount++
        cleanupLocalPhotos(property.wp_id)
        continue
      }

      console.log(`   ✅ Upload R2: ${r2Urls.length} fotos enviadas`)
      totalPhotosUploaded += r2Urls.length

      // 3. Atualizar Supabase
      await WordPressCatalogService.updatePhotoUrls(property.wp_id, r2Urls)
      console.log(`   ✅ Supabase atualizado`)

      // 4. Limpar arquivos locais
      cleanupLocalPhotos(property.wp_id)

      successCount++

    } catch (error) {
      console.log(`\n   ❌ Erro:`, error instanceof Error ? error.message : error)
      failedCount++
      cleanupLocalPhotos(property.wp_id)
    }

    // Pausa entre properties
    if (processedCount < properties.length) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  // Estatísticas finais
  console.log('\n')
  console.log('═'.repeat(60))
  console.log('📊 Estatísticas Finais')
  console.log('═'.repeat(60))
  console.log(`\n✅ Properties processadas: ${processedCount}`)
  console.log(`✅ Migrações bem-sucedidas: ${successCount}`)
  console.log(`❌ Falhas: ${failedCount}`)
  console.log(`📥 Fotos baixadas: ${totalPhotosDownloaded}`)
  console.log(`📤 Fotos enviadas para R2: ${totalPhotosUploaded}`)

  if (successCount > 0) {
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
  console.log('')

  // Limpar diretório temporário
  if (fs.existsSync(LOCAL_TEMP_DIR)) {
    fs.rmSync(LOCAL_TEMP_DIR, { recursive: true, force: true })
    console.log('🧹 Arquivos temporários removidos')
  }
}

main().catch(error => {
  console.error('\n❌ Erro fatal:', error)
  process.exit(1)
})
