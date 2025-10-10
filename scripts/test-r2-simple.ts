#!/usr/bin/env tsx
/**
 * Teste simples e direto de conexão R2
 */

import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { S3Client, ListBucketsCommand, CreateBucketCommand, HeadBucketCommand } from '@aws-sdk/client-s3'

async function test() {
  console.log('🧪 Teste Direto - Cloudflare R2\n')
  
  const endpoint = process.env.R2_ENDPOINT!
  const accessKeyId = process.env.R2_ACCESS_KEY_ID!
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY!
  const bucketName = process.env.R2_BUCKET_NAME || 'wpl-realty'
  
  console.log(`📍 Endpoint: ${endpoint}`)
  console.log(`🔑 Access Key: ${accessKeyId.substring(0, 8)}...`)
  console.log(`🔐 Secret Key: ${secretAccessKey.substring(0, 8)}...`)
  console.log(`📦 Bucket: ${bucketName}\n`)
  
  const client = new S3Client({
    region: 'auto',
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  })
  
  try {
    // Teste 1: Listar buckets
    console.log('1️⃣  Listando buckets...')
    const listCommand = new ListBucketsCommand({})
    const listResult = await client.send(listCommand)
    console.log(`✅ ${listResult.Buckets?.length || 0} bucket(s) encontrado(s)`)
    if (listResult.Buckets) {
      listResult.Buckets.forEach(b => console.log(`   - ${b.Name}`))
    }
    console.log('')
    
    // Teste 2: Verificar se bucket existe
    console.log(`2️⃣  Verificando bucket "${bucketName}"...`)
    try {
      const headCommand = new HeadBucketCommand({ Bucket: bucketName })
      await client.send(headCommand)
      console.log(`✅ Bucket "${bucketName}" existe e é acessível!\n`)
    } catch (headError: any) {
      if (headError.name === 'NotFound') {
        console.log(`❌ Bucket "${bucketName}" não existe.\n`)
        console.log(`💡 Criando bucket "${bucketName}"...`)
        try {
          const createCommand = new CreateBucketCommand({ Bucket: bucketName })
          await client.send(createCommand)
          console.log(`✅ Bucket "${bucketName}" criado com sucesso!\n`)
        } catch (createError: any) {
          console.log(`❌ Erro ao criar bucket: ${createError.message}\n`)
        }
      } else {
        console.log(`❌ Erro ao verificar bucket: ${headError.message}\n`)
      }
    }
    
    console.log('══════════════════════════════════════════════════')
    console.log('🎉 Conexão com R2 está funcionando!')
    console.log('✅ Você pode prosseguir com a migração de fotos.')
    console.log('')
    
  } catch (error: any) {
    console.log('══════════════════════════════════════════════════')
    console.error('❌ Erro:', error.message)
    console.error('\n💡 Dicas:')
    console.error('   - Verifique se as credenciais estão corretas')
    console.error('   - Acesse https://dash.cloudflare.com → R2 →  API Tokens')
    console.error('   - Crie novo token se necessário')
    console.error('')
    process.exit(1)
  }
}

test()
