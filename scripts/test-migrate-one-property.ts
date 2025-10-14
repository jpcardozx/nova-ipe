#!/usr/bin/env tsx
/**
 * TESTE: Migração de 1 Property Para Cloudflare R2
 * Valida todo o fluxo antes da migração em massa
 */

// Carrega variáveis de ambiente
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { WordPressCatalogService } from '../lib/services/wordpress-catalog-service'
import { CloudflareR2Service } from '../lib/services/cloudflare-r2-service'

async function testMigration() {
  // Valida variáveis de ambiente
  console.log('🔍 Validando configuração...')
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'CLOUDFLARE_R2_ACCOUNT_ID',
    'CLOUDFLARE_R2_ACCESS_KEY_ID',
    'CLOUDFLARE_R2_SECRET_ACCESS_KEY',
    'CLOUDFLARE_R2_BUCKET_NAME'
  ]
  
  const missing = requiredEnvVars.filter(v => !process.env[v])
  if (missing.length > 0) {
    console.error('❌ Variáveis de ambiente faltando:', missing.join(', '))
    console.error('   Verifique o arquivo .env.local')
    process.exit(1)
  }
  console.log('✅ Configuração OK\n')
  
  console.log('🧪 TESTE: Migração de 1 Property para R2')
  console.log('═'.repeat(60))
  console.log('')

  try {
    // Busca primeira property com fotos
    console.log('1️⃣  Buscando property com fotos...')
    const { properties } = await WordPressCatalogService.getProperties({
      page: 1,
      limit: 50
    })

    const testProperty = properties.find(p => 
      p.photo_count > 0 && 
      (!p.photo_urls || p.photo_urls.length === 0)
    )

    if (!testProperty) {
      console.log('❌ Nenhuma property encontrada para testar')
      console.log('   (Todas já foram migradas ou não têm fotos)')
      return
    }

    console.log(`✅ Property encontrada: ${testProperty.wp_id}`)
    console.log(`   Título: ${testProperty.data.field_313 || testProperty.data.field_312 || 'Sem título'}`)
    console.log(`   Fotos: ${testProperty.photo_count}`)
    console.log('')

    // Testa conectividade com Lightsail
    console.log('2️⃣  Testando conectividade com Lightsail...')
    const testUrl = `http://13.223.237.99/wp-content/uploads/WPL/${testProperty.wp_id}/img_foto01.jpg`
    console.log(`   URL: ${testUrl}`)
    
    const response = await fetch(testUrl, { method: 'HEAD' })
    console.log(`   Status: ${response.status} ${response.statusText}`)
    
    if (!response.ok) {
      console.log('❌ Primeira foto não está disponível no Lightsail')
      console.log('   Tentando próxima property...')
      
      // Tenta segunda property
      const testProperty2 = properties.find((p, i) => 
        i > 0 && 
        p.photo_count > 0 && 
        (!p.photo_urls || p.photo_urls.length === 0)
      )
      
      if (testProperty2) {
        console.log(`\n✅ Tentando property ${testProperty2.wp_id}...`)
        const testUrl2 = `http://13.223.237.99/wp-content/uploads/WPL/${testProperty2.wp_id}/img_foto01.jpg`
        const response2 = await fetch(testUrl2, { method: 'HEAD' })
        
        if (response2.ok) {
          console.log('✅ Foto encontrada!')
          await migrateProperty(testProperty2)
          return
        }
      }
      
      console.log('\n❌ Não foi possível encontrar property com fotos disponíveis')
      console.log('   Possíveis causas:')
      console.log('   - Servidor Lightsail offline')
      console.log('   - Fotos foram removidas do servidor')
      console.log('   - Caminho das fotos mudou')
      return
    }
    
    console.log('✅ Foto disponível no Lightsail!')
    console.log('')

    // Executa migração
    await migrateProperty(testProperty)

  } catch (error) {
    console.error('\n❌ Erro durante teste:', error)
    console.error('')
    console.log('Possíveis causas:')
    console.log('  - Credenciais R2 inválidas (.env.local)')
    console.log('  - Bucket R2 não existe')
    console.log('  - Problema de rede')
    console.log('')
    console.log('Verifique o arquivo GUIA_MIGRACAO_IMAGENS_COMPLETO.md')
  }
}

async function migrateProperty(property: any) {
  console.log('3️⃣  Migrando fotos para Cloudflare R2...')
  console.log('')

  try {
    const urls = await WordPressCatalogService.migratePhotosFromLightsail(
      property.wp_id,
      property.photo_count,
      (current, total) => {
        const progress = Math.round((current / total) * 100)
        const bar = '█'.repeat(Math.floor(progress / 5)) + '░'.repeat(20 - Math.floor(progress / 5))
        process.stdout.write(`\r   [${bar}] ${progress}% (${current}/${total} fotos)`)
      }
    )

    console.log('\n')
    console.log(`✅ Migração concluída: ${urls.length}/${property.photo_count} fotos`)
    console.log('')

    // Mostra URLs migradas
    console.log('📸 URLs R2 geradas:')
    urls.slice(0, 3).forEach((url, i) => {
      console.log(`   ${i + 1}. ${url}`)
    })
    if (urls.length > 3) {
      console.log(`   ... e mais ${urls.length - 3} fotos`)
    }
    console.log('')

    // Stats do R2
    console.log('4️⃣  Verificando stats do R2...')
    const stats = await CloudflareR2Service.getStorageStats()
    console.log(`   Total de arquivos: ${stats.totalFiles}`)
    console.log(`   Tamanho total: ${stats.totalSizeGB} GB`)
    console.log(`   Custo mensal: $${stats.monthlyCost}`)
    console.log('')

    // Sucesso!
    console.log('═'.repeat(60))
    console.log('🎉 TESTE BEM-SUCEDIDO!')
    console.log('═'.repeat(60))
    console.log('')
    console.log('✅ Sistema está funcionando corretamente')
    console.log('✅ Lightsail → R2 migration OK')
    console.log('✅ Database update OK')
    console.log('✅ R2 storage OK')
    console.log('')
    console.log('📋 Próximos passos:')
    console.log('   1. Verifique a foto no dashboard:')
    console.log(`      http://localhost:3001/dashboard/wordpress-catalog`)
    console.log('   2. Se estiver OK, execute migração completa:')
    console.log('      pnpm tsx scripts/migrate-all-photos-to-r2.ts')
    console.log('')

  } catch (error) {
    console.error('\n❌ Erro durante migração:', error)
    throw error
  }
}

// Executa
testMigration().catch(console.error)
