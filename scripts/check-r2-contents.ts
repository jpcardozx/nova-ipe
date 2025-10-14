import { S3Client, ListObjectsV2Command, HeadBucketCommand } from '@aws-sdk/client-s3'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Carregar variáveis de ambiente
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'R2_ENDPOINT',
  'R2_ACCESS_KEY_ID',
  'R2_SECRET_ACCESS_KEY',
  'R2_BUCKET_NAME'
]

const missing = requiredEnvVars.filter(v => !process.env[v])
if (missing.length > 0) {
  console.error('❌ Variáveis de ambiente faltando:', missing.join(', '))
  process.exit(1)
}

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

interface R2Stats {
  totalObjects: number
  propertiesWithPhotos: Set<string>
  photosByProperty: Map<string, number>
  totalSize: number
  fileTypes: Map<string, number>
}

async function checkR2Contents() {
  console.log('🔍 VERIFICANDO CONTEÚDO DO R2')
  console.log('=' .repeat(60))
  
  try {
    // Teste de conexão
    console.log('\n📡 Testando conexão com R2...')
    await s3Client.send(new HeadBucketCommand({
      Bucket: process.env.R2_BUCKET_NAME!
    }))
    console.log('✅ Conexão estabelecida com sucesso!')
    
    // Listar objetos
    console.log('\n📦 Listando objetos no bucket...')
    const stats: R2Stats = {
      totalObjects: 0,
      propertiesWithPhotos: new Set(),
      photosByProperty: new Map(),
      totalSize: 0,
      fileTypes: new Map()
    }
    
    let continuationToken: string | undefined
    let pageCount = 0
    
    do {
      pageCount++
      process.stdout.write(`\r   Página ${pageCount}... `)
      
      const command = new ListObjectsV2Command({
        Bucket: process.env.R2_BUCKET_NAME!,
        MaxKeys: 1000,
        ContinuationToken: continuationToken
      })
      
      const response = await s3Client.send(command)
      
      if (response.Contents) {
        for (const obj of response.Contents) {
          if (!obj.Key) continue
          
          stats.totalObjects++
          stats.totalSize += obj.Size || 0
          
          // Extrair wp_id do path (wordpress-photos/{wp_id}/img_foto*.jpg)
          const match = obj.Key.match(/wordpress-photos\/(\d+)\//)
          if (match) {
            const wpId = match[1]
            stats.propertiesWithPhotos.add(wpId)
            stats.photosByProperty.set(
              wpId,
              (stats.photosByProperty.get(wpId) || 0) + 1
            )
          }
          
          // Tipo de arquivo
          const ext = path.extname(obj.Key).toLowerCase()
          stats.fileTypes.set(ext, (stats.fileTypes.get(ext) || 0) + 1)
        }
      }
      
      continuationToken = response.NextContinuationToken
    } while (continuationToken)
    
    console.log('\n✅ Listagem completa!\n')
    
    // Exibir estatísticas do R2
    console.log('📊 ESTATÍSTICAS DO R2')
    console.log('=' .repeat(60))
    console.log(`Total de objetos: ${stats.totalObjects.toLocaleString()}`)
    console.log(`Propriedades com fotos: ${stats.propertiesWithPhotos.size.toLocaleString()}`)
    console.log(`Tamanho total: ${(stats.totalSize / 1024 / 1024).toFixed(2)} MB`)
    console.log(`Custo estimado/mês: $${((stats.totalSize / 1024 / 1024 / 1024) * 0.015).toFixed(4)}`)
    
    if (stats.fileTypes.size > 0) {
      console.log('\nTipos de arquivo:')
      Array.from(stats.fileTypes.entries())
        .sort((a, b) => b[1] - a[1])
        .forEach(([ext, count]) => {
          console.log(`  ${ext || '(sem extensão)'}: ${count.toLocaleString()}`)
        })
    }
    
    // Listar algumas propriedades
    if (stats.propertiesWithPhotos.size > 0) {
      console.log('\nExemplos de propriedades no R2:')
      const examples = Array.from(stats.propertiesWithPhotos).slice(0, 10)
      examples.forEach(wpId => {
        const photoCount = stats.photosByProperty.get(wpId) || 0
        console.log(`  - wp_id ${wpId}: ${photoCount} foto${photoCount !== 1 ? 's' : ''}`)
      })
      if (stats.propertiesWithPhotos.size > 10) {
        console.log(`  ... e mais ${stats.propertiesWithPhotos.size - 10} propriedades`)
      }
    }
    
    // Agora verificar o que falta
    console.log('\n\n🔍 COMPARANDO COM BANCO DE DADOS')
    console.log('=' .repeat(60))
    
    // Buscar todas propriedades com fotos no banco
    const { data: properties, error } = await supabase
      .from('wordpress_properties')
      .select('wp_id, photo_count, photo_urls, thumbnail_url')
      .gt('photo_count', 0)
      .order('wp_id')
    
    if (error) {
      console.error('❌ Erro ao buscar propriedades:', error.message)
      return
    }
    
    console.log(`\nTotal de propriedades no banco com fotos: ${properties.length}`)
    console.log(`Total de propriedades no R2: ${stats.propertiesWithPhotos.size}`)
    
    // Identificar o que falta
    const missingProperties: string[] = []
    const propertiesWithR2Photos: string[] = []
    const propertiesWithOldUrls: string[] = []
    
    for (const prop of properties) {
      const wpId = prop.wp_id.toString()
      const hasR2Photos = stats.propertiesWithPhotos.has(wpId)
      
      if (hasR2Photos) {
        propertiesWithR2Photos.push(wpId)
        
        // Verificar se as URLs no banco apontam para R2
        const photoUrls = Array.isArray(prop.photo_urls) ? prop.photo_urls : []
        const hasR2Urls = photoUrls.some((url: string) => 
          url.includes('r2.cloudflarestorage.com') || url.includes('wpl-realty')
        )
        
        if (!hasR2Urls && photoUrls.length > 0) {
          propertiesWithOldUrls.push(wpId)
        }
      } else {
        missingProperties.push(wpId)
      }
    }
    
    console.log('\n📋 RESUMO DA COMPARAÇÃO')
    console.log('=' .repeat(60))
    console.log(`✅ Propriedades com fotos no R2: ${propertiesWithR2Photos.length}`)
    console.log(`⚠️  Propriedades com URLs antigas no banco: ${propertiesWithOldUrls.length}`)
    console.log(`❌ Propriedades faltando no R2: ${missingProperties.length}`)
    
    if (propertiesWithOldUrls.length > 0) {
      console.log('\n⚠️  ATENÇÃO: Estas propriedades têm fotos no R2 mas URLs antigas no banco:')
      console.log('   (Necessário atualizar URLs no banco de dados)')
      propertiesWithOldUrls.slice(0, 10).forEach(wpId => {
        console.log(`   - wp_id ${wpId}`)
      })
      if (propertiesWithOldUrls.length > 10) {
        console.log(`   ... e mais ${propertiesWithOldUrls.length - 10} propriedades`)
      }
    }
    
    if (missingProperties.length > 0) {
      console.log('\n❌ Propriedades que ainda precisam migração:')
      missingProperties.slice(0, 20).forEach(wpId => {
        const prop = properties.find(p => p.wp_id.toString() === wpId)
        console.log(`   - wp_id ${wpId} (${prop?.photo_count || 0} fotos)`)
      })
      if (missingProperties.length > 20) {
        console.log(`   ... e mais ${missingProperties.length - 20} propriedades`)
      }
    }
    
    // Recomendações
    console.log('\n\n💡 RECOMENDAÇÕES')
    console.log('=' .repeat(60))
    
    if (propertiesWithR2Photos.length > 0 && propertiesWithOldUrls.length > 0) {
      console.log('1. ✅ Fotos já estão no R2! Ótimo!')
      console.log('2. ⚠️  Atualizar URLs no banco para apontar para R2')
      console.log('   Execute: pnpm tsx scripts/update-r2-urls.ts')
    }
    
    if (missingProperties.length > 0) {
      console.log(`3. 📤 Migrar ${missingProperties.length} propriedades restantes`)
      console.log('   Execute: pnpm tsx scripts/migrate-missing-to-r2.ts')
    }
    
    if (propertiesWithR2Photos.length === properties.length && propertiesWithOldUrls.length === 0) {
      console.log('🎉 TUDO PRONTO! Todas as fotos estão no R2 e URLs atualizadas!')
    }
    
  } catch (error: any) {
    console.error('\n❌ ERRO:', error.message)
    if (error.$metadata) {
      console.error('Detalhes:', JSON.stringify(error.$metadata, null, 2))
    }
    process.exit(1)
  }
}

checkR2Contents()
