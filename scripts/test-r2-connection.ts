#!/usr/bin/env tsx
/**
 * Teste de conexão com Cloudflare R2
 * Verifica se as credenciais estão corretas e o bucket é acessível
 */

// Carrega variáveis de ambiente do .env.local
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { CloudflareR2Service } from '../lib/services/cloudflare-r2-service'

async function test() {
  console.log('🧪 Testando conexão com Cloudflare R2...')
  console.log('═'.repeat(50))
  console.log('')

  // Debug: verificar se env vars estão disponíveis
  console.log('🔍 Debug de credenciais:')
  console.log(`   R2_ENDPOINT: ${process.env.R2_ENDPOINT ? '✅ Found' : '❌ Missing'}`)
  console.log(`   R2_ACCESS_KEY_ID: ${process.env.R2_ACCESS_KEY_ID ? '✅ Found (' + process.env.R2_ACCESS_KEY_ID.substring(0, 8) + '...)' : '❌ Missing'}`)
  console.log(`   R2_SECRET_ACCESS_KEY: ${process.env.R2_SECRET_ACCESS_KEY ? '✅ Found (' + process.env.R2_SECRET_ACCESS_KEY.substring(0, 8) + '...)' : '❌ Missing'}`)
  console.log(`   R2_BUCKET_NAME: ${process.env.R2_BUCKET_NAME || 'wpl-realty (default)'}`)
  console.log(`   Key lengths: accessKey=${process.env.R2_ACCESS_KEY_ID?.length}, secretKey=${process.env.R2_SECRET_ACCESS_KEY?.length}`)
  console.log('')

  try {
    // Teste direto com S3Client
    console.log('🔧 Criando cliente R2 diretamente...')
    const { S3Client, ListBucketsCommand } = await import('@aws-sdk/client-s3')
    
    const testClient = new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT!,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!.trim(),
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!.trim(),
      },
    })
    
    console.log('✅ Cliente criado')
    console.log('')
    // Test 1: Upload de arquivo teste
    console.log('📤 Test 1: Upload de arquivo teste...')
    const testBuffer = Buffer.from('Hello from nova-ipe WordPress Catalog!')
    const testPath = 'test/connection-test.txt'
    
    const url = await CloudflareR2Service.uploadFile(
      testBuffer,
      testPath,
      'text/plain'
    )
    
    console.log('✅ Upload bem-sucedido!')
    console.log(`   URL: ${url}`)
    console.log('')

    // Test 2: Storage stats
    console.log('📊 Test 2: Storage stats...')
    const stats = await CloudflareR2Service.getStorageStats()
    
    console.log('✅ Stats obtidas com sucesso!')
    console.log(`   Total de arquivos: ${stats.totalFiles}`)
    console.log(`   Tamanho total: ${stats.totalSizeGB} GB`)
    console.log(`   Custo mensal estimado: $${stats.monthlyCost}`)
    console.log('')

    // Test 3: Cleanup (opcional)
    console.log('🧹 Test 3: Limpando arquivo teste...')
    await CloudflareR2Service.deleteFile(testPath)
    console.log('✅ Arquivo removido!')
    console.log('')

    console.log('═'.repeat(50))
    console.log('🎉 Todos os testes passaram!')
    console.log('')
    console.log('✅ Cloudflare R2 está configurado corretamente!')
    console.log('✅ Você pode prosseguir com a migração de fotos.')
    console.log('')
    console.log('📋 Próximos passos:')
    console.log('   1. Executar SQL schema no Supabase')
    console.log('   2. Importar fichas: npx tsx scripts/import-to-supabase-correct.ts')
    console.log('   3. Migrar fotos: npx tsx scripts/migrate-all-photos-to-r2.ts')
    console.log('')

  } catch (error) {
    console.log('')
    console.log('═'.repeat(50))
    console.error('❌ Erro ao conectar com R2:')
    console.error('')
    
    if (error instanceof Error) {
      console.error(`   ${error.message}`)
      
      if (error.message.includes('InvalidAccessKeyId')) {
        console.error('')
        console.error('💡 Solução: Verifique suas credenciais R2')
        console.error('   - R2_ACCESS_KEY_ID está correto?')
        console.error('   - R2_SECRET_ACCESS_KEY está correto?')
      }
      
      if (error.message.includes('NoSuchBucket')) {
        console.error('')
        console.error('💡 Solução: O bucket não existe')
        console.error('   - Crie o bucket "wpl-realty" no Cloudflare Dashboard')
        console.error('   - Ou altere R2_BUCKET_NAME no .env.local')
      }
      
      if (error.message.includes('AccessDenied')) {
        console.error('')
        console.error('💡 Solução: Sem permissão')
        console.error('   - Verifique se o API Token tem permissão Read & Write')
        console.error('   - Gere um novo token se necessário')
      }
    }
    
    console.error('')
    console.error('📚 Ver documentação: docs/CLOUDFLARE_R2_SETUP.md')
    console.error('')
    process.exit(1)
  }
}

test()
